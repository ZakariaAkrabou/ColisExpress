import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/auth.model';

dotenv.config({ quiet: true });

const seedAdmin = async () => {
  try {
    const mongoURL = process.env.DATABASE_URL || '';
    if (!mongoURL) throw new Error('DATABASE_URL is missing');

    await mongoose.connect(mongoURL);

    const adminEmail = 'admin@colisexpress.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (adminExists) {
      console.log('Admin account already exists.');
      process.exit(0);
    }

    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: 'AdminPassword123!',
      role: 'admin'
    });

    console.log('Admin account created successfully.');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: AdminPassword123!`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();