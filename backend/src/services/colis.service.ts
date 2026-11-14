import mongoose, { ClientSession } from 'mongoose';
import Colis, { IColis } from '../models/colis.model';
import Counter from '../models/counter.model';

export interface CreateColisDTO {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  weight: number;
  price: number;
  quantity?: number;
  orderInCommand?: number;
  ncommand?: string;
  isPaid?: boolean;
  isADomicile?: boolean;
  status?: 'pending' | 'in_transit' | 'delivered';
  date?: string;
  description?: string;
  image?: string;
  direction?: 'FR_TO_MA' | 'MA_TO_FR';
}

export interface UpdateColisDTO {
  senderName?: string;
  senderPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
  fromCity?: string;
  toCity?: string;
  weight?: number;
  price?: number;
  quantity?: number;
  orderInCommand?: number;
  ncommand?: string;
  isPaid?: boolean;
  isADomicile?: boolean;
  status?: 'pending' | 'in_transit' | 'delivered';
  date?: string;
  description?: string;
  image?: string;
  direction?: 'FR_TO_MA' | 'MA_TO_FR';
}

const COUNTER_ID = 'colis_order';

export class ColisService {
  /**
   * Helper to format ncommand
   * Formats orderInCommand / total quantity of colis. Example: order 1 of 2 -> "1/2"
   */
  static formatNCommand(order: number, totalQuantity: number): string {
    const validTotal = Number(totalQuantity) > 0 ? Number(totalQuantity) : 1;
    const validOrder = Number(order) > 0 ? Number(order) : 1;
    return `${validOrder}/${validTotal}`;
  }

  /**
   * Concurrency-safe counter generation.
   * Atomically increments and returns the next sequence number outside long-lived transaction locks
   * using findOneAndUpdate with $inc. This eliminates WriteConflict during high-concurrency inserts.
   */
  private static async getNextOrderInCommand(): Promise<number> {
    // Check if initialized
    const existingCounter = await Counter.findById(COUNTER_ID);
    if (!existingCounter) {
      const highestDoc = await Colis.findOne({}, { orderInCommand: 1 })
        .sort({ orderInCommand: -1 })
        .lean();
      const currentMax = highestDoc && typeof highestDoc.orderInCommand === 'number' ? highestDoc.orderInCommand : 0;

      await Counter.findByIdAndUpdate(
        COUNTER_ID,
        { $setOnInsert: { seq: currentMax } },
        { upsert: true, returnDocument: 'after' }
      );
    }

    const updatedCounter = await Counter.findByIdAndUpdate(
      COUNTER_ID,
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    return updatedCounter ? updatedCounter.seq : 1;
  }

  /**
   * Renumbers all remaining Colis documents sequentially starting from 1
   * in order of their existing orderInCommand (or createdAt/id as fallback),
   * recalculates each ncommand using its own quantity, and resets the counter to remaining count.
   */
  private static async renumberRemaining(session?: ClientSession): Promise<void> {
    const opts = session ? { session } : {};

    const remaining = await Colis.find({}, null, opts).sort({
      orderInCommand: 1,
      createdAt: 1,
      _id: 1,
    });

    for (let i = 0; i < remaining.length; i++) {
      const doc = remaining[i];
      const newOrder = i + 1;
      const newNCommand = ColisService.formatNCommand(newOrder, doc.quantity);

      if (doc.orderInCommand !== newOrder || doc.ncommand !== newNCommand) {
        await Colis.updateOne(
          { _id: doc._id },
          { $set: { orderInCommand: newOrder, ncommand: newNCommand } },
          opts
        );
      }
    }

    // Synchronize the atomic counter to the remaining count
    await Counter.findByIdAndUpdate(
      COUNTER_ID,
      { $set: { seq: remaining.length } },
      { upsert: true, returnDocument: 'after', ...opts }
    );
  }

  /**
   * Helper to execute operations in a transaction with automatic retry on TransientTransactionError / WriteConflict.
   */
  private static async withTransaction<T>(
    fn: (session: ClientSession | undefined) => Promise<T>,
    maxRetries = 5
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      let session: ClientSession | undefined;
      try {
        session = await mongoose.startSession();
        session.startTransaction();
        const result = await fn(session);
        await session.commitTransaction();
        return result;
      } catch (error: any) {
        if (session && session.inTransaction()) {
          try {
            await session.abortTransaction();
          } catch {
            // Ignore abort error
          }
        }

        const isTransient =
          error?.errorLabelSet?.has('TransientTransactionError') ||
          error?.code === 112 ||
          error?.message?.includes('WriteConflict');

        if (isTransient && attempt < maxRetries) {
          // Exponential backoff with jitter
          const delay = Math.floor(Math.random() * 50) + attempt * 20;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // If transactions are not supported by deployment (e.g. standalone Mongo)
        if (
          error.message?.includes('Transactions are not supported') ||
          error.message?.includes('replica set')
        ) {
          return await fn(undefined);
        }

        throw error;
      } finally {
        if (session) {
          await session.endSession();
        }
      }
    }

    throw new Error('Transaction failed after maximum retries');
  }

  /**
   * Create a new colis in MongoDB.
   * IMPORTANT BUSINESS RULE: ONE COMMAND = ONE MONGODB DOCUMENT.
   * Always creates exactly ONE document using Colis.create() once.
   * `quantity` represents physical packages in the command and is stored as such.
   * `orderInCommand` is generated on the backend atomically; frontend values are never trusted.
   * `ncommand` is generated as `${orderInCommand}/${quantity}`.
   */
  static async createColis(data: CreateColisDTO): Promise<IColis> {
    const {
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      fromCity,
      toCity,
      weight,
      price,
      quantity = 1,
      isPaid = true,
      isADomicile = true,
      status = 'pending',
      date,
      description,
      image,
      direction,
    } = data;

    if (!senderName || typeof senderName !== 'string' || !senderName.trim()) {
      throw new Error('Sender name is required');
    }

    if (!senderPhone || typeof senderPhone !== 'string' || !senderPhone.trim()) {
      throw new Error('Sender phone is required');
    }

    if (!receiverName || typeof receiverName !== 'string' || !receiverName.trim()) {
      throw new Error('Receiver name is required');
    }

    if (!receiverPhone || typeof receiverPhone !== 'string' || !receiverPhone.trim()) {
      throw new Error('Receiver phone is required');
    }

    if (!fromCity || typeof fromCity !== 'string' || !fromCity.trim()) {
      throw new Error('Departure city is required');
    }

    if (!toCity || typeof toCity !== 'string' || !toCity.trim()) {
      throw new Error('Destination city is required');
    }

    const parsedWeight = Number(weight);
    if (isNaN(parsedWeight) || parsedWeight < 0) {
      throw new Error('Weight must be a valid positive number');
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error('Price must be a valid positive number');
    }

    const parsedQuantity = Math.max(1, parseInt(String(quantity), 10) || 1);

    // Atomically increment the sequence counter (thread-safe and concurrency-safe)
    const generatedOrder = await ColisService.getNextOrderInCommand();
    const generatedNCommand = ColisService.formatNCommand(generatedOrder, parsedQuantity);

    // Exactly ONE document created using Colis.create() once
    const colis = await Colis.create({
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      receiverName: receiverName.trim(),
      receiverPhone: receiverPhone.trim(),
      fromCity: fromCity.trim(),
      toCity: toCity.trim(),
      weight: parsedWeight,
      price: parsedPrice,
      quantity: parsedQuantity,
      orderInCommand: generatedOrder,
      ncommand: generatedNCommand,
      isPaid: Boolean(isPaid),
      isADomicile: Boolean(isADomicile),
      status: status || 'pending',
      date: date?.trim() || new Date().toLocaleDateString('fr-FR'),
      description: description?.trim() || '',
      image: image?.trim(),
      direction,
    });

    return colis;
  }

  /**
   * Return all colis
   */
  static async getAllColis(filter: Record<string, any> = {}): Promise<IColis[]> {
    return await Colis.find(filter).sort({ orderInCommand: 1, createdAt: -1 });
  }

  /**
   * Find a colis using its MongoDB ID
   */
  static async getColisById(id: string): Promise<IColis> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid colis ID');
    }

    const colis = await Colis.findById(id);

    if (!colis) {
      throw new Error('Colis not found');
    }

    return colis;
  }

  /**
   * Update colis by ID
   * Updating quantity must not change orderInCommand.
   * Recalculate ncommand using the existing order and the new quantity.
   * Frontend is NOT allowed to modify orderInCommand or ncommand directly.
   */
  static async updateColis(id: string, data: UpdateColisDTO): Promise<IColis> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid colis ID');
    }

    const existingColis = await Colis.findById(id);
    if (!existingColis) {
      throw new Error('Colis not found');
    }

    const updateData: Partial<IColis> = {};

    if (data.senderName !== undefined) {
      if (typeof data.senderName !== 'string' || !data.senderName.trim()) {
        throw new Error('Sender name cannot be empty');
      }
      updateData.senderName = data.senderName.trim();
    }

    if (data.senderPhone !== undefined) {
      if (typeof data.senderPhone !== 'string' || !data.senderPhone.trim()) {
        throw new Error('Sender phone cannot be empty');
      }
      updateData.senderPhone = data.senderPhone.trim();
    }

    if (data.receiverName !== undefined) {
      if (typeof data.receiverName !== 'string' || !data.receiverName.trim()) {
        throw new Error('Receiver name cannot be empty');
      }
      updateData.receiverName = data.receiverName.trim();
    }

    if (data.receiverPhone !== undefined) {
      if (typeof data.receiverPhone !== 'string' || !data.receiverPhone.trim()) {
        throw new Error('Receiver phone cannot be empty');
      }
      updateData.receiverPhone = data.receiverPhone.trim();
    }

    if (data.fromCity !== undefined) {
      if (typeof data.fromCity !== 'string' || !data.fromCity.trim()) {
        throw new Error('Departure city cannot be empty');
      }
      updateData.fromCity = data.fromCity.trim();
    }

    if (data.toCity !== undefined) {
      if (typeof data.toCity !== 'string' || !data.toCity.trim()) {
        throw new Error('Destination city cannot be empty');
      }
      updateData.toCity = data.toCity.trim();
    }

    if (data.weight !== undefined) {
      const parsedWeight = Number(data.weight);
      if (isNaN(parsedWeight) || parsedWeight < 0) {
        throw new Error('Weight must be a valid positive number');
      }
      updateData.weight = parsedWeight;
    }

    if (data.price !== undefined) {
      const parsedPrice = Number(data.price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error('Price must be a valid positive number');
      }
      updateData.price = parsedPrice;
    }

    // If quantity is updated, preserve existing orderInCommand and recalculate ncommand
    if (data.quantity !== undefined) {
      const newQuantity = Math.max(1, parseInt(String(data.quantity), 10) || 1);
      updateData.quantity = newQuantity;
      updateData.ncommand = ColisService.formatNCommand(existingColis.orderInCommand, newQuantity);
    }
    // Note: orderInCommand and ncommand sent from client are ignored to prevent tampering

    if (data.isPaid !== undefined) {
      updateData.isPaid = Boolean(data.isPaid);
    }

    if (data.isADomicile !== undefined) {
      updateData.isADomicile = Boolean(data.isADomicile);
    }

    if (data.status !== undefined) {
      if (!['pending', 'in_transit', 'delivered'].includes(data.status)) {
        throw new Error('Invalid status value');
      }
      updateData.status = data.status;
    }

    if (data.date !== undefined) {
      updateData.date = data.date.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description.trim();
    }

    if (data.image !== undefined) {
      updateData.image = data.image.trim();
    }

    if (data.direction !== undefined) {
      updateData.direction = data.direction;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field must be provided to update');
    }

    const updatedColis = await Colis.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedColis) {
      throw new Error('Colis not found');
    }

    return updatedColis;
  }

  /**
   * Delete a colis by ID
   * After deleting:
   * - Retrieve remaining documents in their current command order.
   * - Renumber sequentially starting from 1.
   * - Recalculate each ncommand using its own quantity.
   */
  static async deleteColis(id: string): Promise<IColis> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid colis ID');
    }

    return await ColisService.withTransaction(async (session) => {
      const opts = session ? { session } : {};
      const deletedColis = await Colis.findByIdAndDelete(id, opts);

      if (!deletedColis) {
        throw new Error('Colis not found');
      }

      await ColisService.renumberRemaining(session);

      return deletedColis;
    });
  }

  /**
   * Delete multiple Colis by array of MongoDB IDs
   * After deleting:
   * - Renumber all remaining command documents sequentially starting from 1.
   * - Recalculate each ncommand using its own quantity.
   */
  static async deleteColisBulk(ids: string[]): Promise<number> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('ids must be a non-empty array of MongoDB ObjectIds');
    }

    for (const id of ids) {
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid colis ID: ${id}`);
      }
    }

    return await ColisService.withTransaction(async (session) => {
      const opts = session ? { session } : {};
      const result = await Colis.deleteMany({ _id: { $in: ids } }, opts);
      const deletedCount = result.deletedCount || 0;

      await ColisService.renumberRemaining(session);

      return deletedCount;
    });
  }

  /**
   * Delete all Colis from the collection
   * Resets the command counter so the next created command starts at 1.
   */
  static async deleteAllColis(): Promise<number> {
    return await ColisService.withTransaction(async (session) => {
      const opts = session ? { session } : {};
      const result = await Colis.deleteMany({}, opts);
      const deletedCount = result.deletedCount || 0;

      await Counter.findByIdAndUpdate(
        COUNTER_ID,
        { $set: { seq: 0 } },
        { upsert: true, returnDocument: 'after', ...opts }
      );

      return deletedCount;
    });
  }

  // Method aliases
  static create = ColisService.createColis;
  static getAll = ColisService.getAllColis;
  static getById = ColisService.getColisById;
  static update = ColisService.updateColis;
  static delete = ColisService.deleteColis;
  static deleteBulk = ColisService.deleteColisBulk;
  static deleteAll = ColisService.deleteAllColis;
}
