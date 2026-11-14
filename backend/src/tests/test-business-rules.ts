import mongoose from 'mongoose';
import * as dns from 'node:dns';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });
dns.setServers(['8.8.8.8', '1.1.1.1']);

import Colis from '../models/colis.model';
import Counter from '../models/counter.model';
import { ColisService } from '../services/colis.service';

async function runTests() {
  console.log('--- STARTING COLIS SERVICE BUSINESS RULE TESTS ---');
  await mongoose.connect(process.env.DATABASE_URL!);
  console.log('Connected to MongoDB.');

  try {
    // 0. Clean slate
    console.log('\n--- Step 0: Cleaning database ---');
    await ColisService.deleteAllColis();
    const countInitial = await Colis.countDocuments();
    const counterInitial = await Counter.findById('colis_order');
    console.log(`Documents count after deleteAll: ${countInitial}`);
    console.log(`Counter after deleteAll: ${counterInitial?.seq}`);
    if (countInitial !== 0 || (counterInitial && counterInitial.seq !== 0)) {
      throw new Error('Clean slate failed!');
    }

    // 1. Scenario 1: Create a command with quantity 2
    console.log('\n--- Scenario 1: Create command with quantity 2 ---');
    const cmd1 = await ColisService.createColis({
      senderName: 'Test Sender 1',
      senderPhone: '0600000001',
      receiverName: 'Test Receiver 1',
      receiverPhone: '0600000002',
      fromCity: 'Paris',
      toCity: 'Casablanca',
      weight: 2.5,
      price: 50,
      quantity: 2,
    });

    const docsAfter1 = await Colis.find().lean();
    console.log(`Documents count in DB: ${docsAfter1.length}`);
    console.log(`Command 1 created: orderInCommand=${cmd1.orderInCommand}, quantity=${cmd1.quantity}, ncommand=${cmd1.ncommand}`);

    if (docsAfter1.length !== 1) {
      throw new Error(`Expected exactly 1 document in DB, but found ${docsAfter1.length}`);
    }
    if (cmd1.orderInCommand !== 1 || cmd1.ncommand !== '1/2' || cmd1.quantity !== 2) {
      throw new Error(`Command 1 values incorrect: order=${cmd1.orderInCommand}, ncommand=${cmd1.ncommand}`);
    }
    console.log('✓ Scenario 1 PASSED: Exactly 1 document created with 1/2');

    // 2. Scenario 2: Create another command with quantity 10
    console.log('\n--- Scenario 2: Create command with quantity 10 ---');
    const cmd2 = await ColisService.createColis({
      senderName: 'Test Sender 2',
      senderPhone: '0600000003',
      receiverName: 'Test Receiver 2',
      receiverPhone: '0600000004',
      fromCity: 'Lyon',
      toCity: 'Rabat',
      weight: 15,
      price: 200,
      quantity: 10,
    });

    const docsAfter2 = await Colis.find().lean();
    console.log(`Documents count in DB: ${docsAfter2.length}`);
    console.log(`Command 2 created: orderInCommand=${cmd2.orderInCommand}, quantity=${cmd2.quantity}, ncommand=${cmd2.ncommand}`);

    if (docsAfter2.length !== 2) {
      throw new Error(`Expected exactly 2 documents in DB, but found ${docsAfter2.length}`);
    }
    if (cmd2.orderInCommand !== 2 || cmd2.ncommand !== '2/10' || cmd2.quantity !== 10) {
      throw new Error(`Command 2 values incorrect: order=${cmd2.orderInCommand}, ncommand=${cmd2.ncommand}`);
    }
    console.log('✓ Scenario 2 PASSED: Exactly 1 document created with 2/10');

    // 3. Scenario 3: Update the second command quantity to 8
    console.log('\n--- Scenario 3: Update second command quantity to 8 ---');
    const updatedCmd2 = await ColisService.updateColis(cmd2._id.toString(), {
      quantity: 8,
    });

    console.log(`Command 2 after update: orderInCommand=${updatedCmd2.orderInCommand}, quantity=${updatedCmd2.quantity}, ncommand=${updatedCmd2.ncommand}`);
    if (updatedCmd2.orderInCommand !== 2 || updatedCmd2.quantity !== 8 || updatedCmd2.ncommand !== '2/8') {
      throw new Error(`Command 2 update incorrect: order=${updatedCmd2.orderInCommand}, ncommand=${updatedCmd2.ncommand}`);
    }
    console.log('✓ Scenario 3 PASSED: Second command became 2/8 without changing orderInCommand');

    // 4. Scenario 4: Delete the first command -> remaining command must become 1/8
    console.log('\n--- Scenario 4: Delete first command ---');
    await ColisService.deleteColis(cmd1._id.toString());

    const docsAfterDel = await Colis.find().lean();
    console.log(`Documents count in DB after deleting cmd1: ${docsAfterDel.length}`);
    if (docsAfterDel.length !== 1) {
      throw new Error(`Expected 1 document remaining, but found ${docsAfterDel.length}`);
    }
    const remainingCmd = docsAfterDel[0];
    console.log(`Remaining command in DB: orderInCommand=${remainingCmd.orderInCommand}, quantity=${remainingCmd.quantity}, ncommand=${remainingCmd.ncommand}`);
    if (remainingCmd.orderInCommand !== 1 || remainingCmd.ncommand !== '1/8' || remainingCmd.quantity !== 8) {
      throw new Error(`Remaining command incorrect: order=${remainingCmd.orderInCommand}, ncommand=${remainingCmd.ncommand}`);
    }
    console.log('✓ Scenario 4 PASSED: Remaining command sequentially renumbered to 1/8');

    // 5. Scenario 5: Delete all commands, then create a new command -> numbering must restart at 1
    console.log('\n--- Scenario 5: Delete all commands and restart ---');
    await ColisService.deleteAllColis();
    const docsAfterDelAll = await Colis.find().lean();
    console.log(`Documents count in DB after deleteAll: ${docsAfterDelAll.length}`);

    const cmdNew = await ColisService.createColis({
      senderName: 'New Sender',
      senderPhone: '0611223344',
      receiverName: 'New Receiver',
      receiverPhone: '0655667788',
      fromCity: 'Marseille',
      toCity: 'Tanger',
      weight: 3,
      price: 60,
      quantity: 5,
    });

    const docsAfterNew = await Colis.find().lean();
    console.log(`Documents count in DB after new create: ${docsAfterNew.length}`);
    console.log(`New command: orderInCommand=${cmdNew.orderInCommand}, quantity=${cmdNew.quantity}, ncommand=${cmdNew.ncommand}`);

    if (docsAfterNew.length !== 1) {
      throw new Error(`Expected 1 document, found ${docsAfterNew.length}`);
    }
    if (cmdNew.orderInCommand !== 1 || cmdNew.ncommand !== '1/5') {
      throw new Error(`New command numbering did not restart at 1! Got order=${cmdNew.orderInCommand}, ncommand=${cmdNew.ncommand}`);
    }
    console.log('✓ Scenario 5 PASSED: Numbering restarted at 1/5');

    // 6. Extra Scenario: Bulk Delete Test
    console.log('\n--- Scenario 6: Test Bulk Delete and Sequential Renumbering ---');
    // Create 3 commands: quantity 3, 4, 5 -> 2/3, 3/4, 4/5
    const b1 = await ColisService.createColis({
      senderName: 'Sender B1',
      senderPhone: '0600000010',
      receiverName: 'Receiver B1',
      receiverPhone: '0600000011',
      fromCity: 'Paris',
      toCity: 'Fes',
      weight: 1,
      price: 20,
      quantity: 4,
    }); // 2/4
    const b2 = await ColisService.createColis({
      senderName: 'Sender B2',
      senderPhone: '0600000020',
      receiverName: 'Receiver B2',
      receiverPhone: '0600000021',
      fromCity: 'Paris',
      toCity: 'Fes',
      weight: 1,
      price: 20,
      quantity: 7,
    }); // 3/7
    const b3 = await ColisService.createColis({
      senderName: 'Sender B3',
      senderPhone: '0600000030',
      receiverName: 'Receiver B3',
      receiverPhone: '0600000031',
      fromCity: 'Paris',
      toCity: 'Fes',
      weight: 1,
      price: 20,
      quantity: 9,
    }); // 4/9

    // Delete b1 and b2 via bulk delete
    await ColisService.deleteColisBulk([b1._id.toString(), b2._id.toString()]);
    const remainingBulk = await Colis.find().sort({ orderInCommand: 1 }).lean();
    console.log(`Remaining documents after bulk delete: ${remainingBulk.length}`);
    for (const d of remainingBulk) {
      console.log(`- ID: ${d._id}, orderInCommand: ${d.orderInCommand}, ncommand: ${d.ncommand}, quantity: ${d.quantity}`);
    }
    if (remainingBulk[0].orderInCommand !== 1 || remainingBulk[1].orderInCommand !== 2) {
      throw new Error('Bulk delete sequential renumbering failed!');
    }
    console.log('✓ Scenario 6 PASSED: Bulk delete successfully renumbered remaining items sequentially');

    // 7. Concurrency Test
    console.log('\n--- Scenario 7: Concurrent Creation Test ---');
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        ColisService.createColis({
          senderName: `Sender C${i}`,
          senderPhone: `06000000${i}0`,
          receiverName: `Receiver C${i}`,
          receiverPhone: `06000000${i}1`,
          fromCity: 'Paris',
          toCity: 'Casablanca',
          weight: 1,
          price: 20,
          quantity: i + 1,
        })
      );
    }
    const concurrentResults = await Promise.all(promises);
    const orderNumbers = concurrentResults.map((r) => r.orderInCommand);
    console.log(`Created 5 commands concurrently with orders: ${orderNumbers.join(', ')}`);
    const uniqueOrders = new Set(orderNumbers);
    if (uniqueOrders.size !== 5) {
      throw new Error(`Duplicate orderInCommand detected in concurrency test! ${orderNumbers.join(', ')}`);
    }
    console.log('✓ Scenario 7 PASSED: Concurrency safe - all 5 orders are unique and distinct');

    // Clean up test data
    await ColisService.deleteAllColis();
    console.log('\nAll tests completed and database cleared.');
  } finally {
    await mongoose.disconnect();
  }
}

runTests().catch((err) => {
  console.error('TEST ERROR:', err);
  process.exit(1);
});

