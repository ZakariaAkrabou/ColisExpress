import mongoose from 'mongoose';
import Client, { IClient } from '../models/client.model';

export interface CreateClientDTO {
  name: string;
  phone: string;
  city: string;
}

export interface UpdateClientDTO {
  name?: string;
  phone?: string;
  city?: string;
}

export class ClientService {
  /**
   * Create a new client in MongoDB
   */
  static async createClient(data: CreateClientDTO): Promise<IClient> {
    const { name, phone, city } = data;

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Client name is required');
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      throw new Error('Phone number is required');
    }

    if (!city || typeof city !== 'string' || !city.trim()) {
      throw new Error('City is required');
    }

    const client = await Client.create({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
    });

    return client;
  }

  /**
   * Return all clients
   */
  static async getAllClients(): Promise<IClient[]> {
    return await Client.find().sort({ createdAt: -1 });
  }

  /**
   * Find a client using its MongoDB ID
   */
  static async getClientById(id: string): Promise<IClient> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client ID');
    }

    const client = await Client.findById(id);

    if (!client) {
      throw new Error('Client not found');
    }

    return client;
  }

  /**
   * Update client name, phone, and city by ID
   */
  static async updateClient(id: string, data: UpdateClientDTO): Promise<IClient> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client ID');
    }

    const updateData: Partial<CreateClientDTO> = {};

    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || !data.name.trim()) {
        throw new Error('Client name cannot be empty');
      }
      updateData.name = data.name.trim();
    }

    if (data.phone !== undefined) {
      if (typeof data.phone !== 'string' || !data.phone.trim()) {
        throw new Error('Phone number cannot be empty');
      }
      updateData.phone = data.phone.trim();
    }

    if (data.city !== undefined) {
      if (typeof data.city !== 'string' || !data.city.trim()) {
        throw new Error('City cannot be empty');
      }
      updateData.city = data.city.trim();
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field (name, phone, city) must be provided to update');
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      throw new Error('Client not found');
    }

    return updatedClient;
  }

  /**
   * Delete a client by ID
   */
  static async deleteClient(id: string): Promise<IClient> {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client ID');
    }

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      throw new Error('Client not found');
    }

    return deletedClient;
  }

  // Method aliases
  static create = ClientService.createClient;
  static getAll = ClientService.getAllClients;
  static getById = ClientService.getClientById;
  static update = ClientService.updateClient;
  static delete = ClientService.deleteClient;
}

