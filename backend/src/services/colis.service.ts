import mongoose from 'mongoose';
import Colis, { IColis } from '../models/colis.model';

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

export class ColisService {
  /**
   * Helper to format ncommand
   * Formats order of colis / total quantity of colis. Example: order 1 of 2 -> "1/2"
   */
  static formatNCommand(order: number, totalQuantity: number): string {
    const validTotal = Number(totalQuantity) > 0 ? Number(totalQuantity) : 1;
    const validOrder = Number(order) > 0 ? Number(order) : 1;
    return `${validOrder}/${validTotal}`;
  }

  /**
   * Create a new colis in MongoDB
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
      orderInCommand = 1,
      ncommand,
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
    const parsedOrder = Math.max(1, parseInt(String(orderInCommand), 10) || 1);

    // If ncommand not explicitly given, compute it as order/total quantity (e.g. 1/2)
    const finalNCommand = ncommand && ncommand.trim()
      ? ncommand.trim()
      : ColisService.formatNCommand(parsedOrder, parsedQuantity);

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
      orderInCommand: parsedOrder,
      ncommand: finalNCommand,
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
   * Create multiple colis entries for a multi-quantity batch
   * E.g. for quantity = 2, creates colis 1/2 and 2/2
   */
  static async createColisBatch(data: CreateColisDTO): Promise<IColis[]> {
    const totalQuantity = Math.max(1, parseInt(String(data.quantity), 10) || 1);
    
    if (totalQuantity === 1) {
      const single = await ColisService.createColis({
        ...data,
        quantity: 1,
        orderInCommand: 1,
        ncommand: ColisService.formatNCommand(1, 1),
      });
      return [single];
    }

    const createdList: IColis[] = [];
    for (let order = 1; order <= totalQuantity; order++) {
      const colis = await ColisService.createColis({
        ...data,
        quantity: totalQuantity,
        orderInCommand: order,
        ncommand: ColisService.formatNCommand(order, totalQuantity),
      });
      createdList.push(colis);
    }

    return createdList;
  }

  /**
   * Return all colis
   */
  static async getAllColis(filter: Record<string, any> = {}): Promise<IColis[]> {
    return await Colis.find(filter).sort({ createdAt: -1 });
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

    if (data.quantity !== undefined || data.orderInCommand !== undefined) {
      const q = data.quantity !== undefined ? Math.max(1, Number(data.quantity)) : existingColis.quantity;
      const o = data.orderInCommand !== undefined ? Math.max(1, Number(data.orderInCommand)) : existingColis.orderInCommand;
      updateData.quantity = q;
      updateData.orderInCommand = o;
      updateData.ncommand = ColisService.formatNCommand(o, q);
    } else if (data.ncommand !== undefined) {
      if (!data.ncommand.trim()) {
        throw new Error('ncommand cannot be empty');
      }
      updateData.ncommand = data.ncommand.trim();
    }

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
      { new: true, runValidators: true }
    );

    if (!updatedColis) {
      throw new Error('Colis not found');
    }

    return updatedColis;
  }

  /**
   * Delete a colis by ID
   */
  static async deleteColis(id: string): Promise<IColis> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid colis ID');
    }

    const deletedColis = await Colis.findByIdAndDelete(id);

    if (!deletedColis) {
      throw new Error('Colis not found');
    }

    return deletedColis;
  }

  // Method aliases
  static create = ColisService.createColis;
  static createBatch = ColisService.createColisBatch;
  static getAll = ColisService.getAllColis;
  static getById = ColisService.getColisById;
  static update = ColisService.updateColis;
  static delete = ColisService.deleteColis;
}

