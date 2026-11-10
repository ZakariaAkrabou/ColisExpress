import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ClientService } from '../services/client.service';

export class ClientController {
  /**
   * POST /clients
   * Create a new client
   */
  static async createClient(req: Request, res: Response): Promise<void> {
    try {
      const { name, phone, city } = req.body;

      if (!name || !phone || !city) {
        res.status(400).json({ message: 'Name, phone, and city are required' });
        return;
      }

      const client = await ClientService.createClient({ name, phone, city });

      res.status(201).json({
        message: 'Client created successfully',
        client,
      });
    } catch (error: any) {
      if (
        error.name === 'ValidationError' ||
        error.message?.includes('required') ||
        error.message?.includes('cannot be empty')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }

      console.error('Create Client Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /clients
   * Return all clients
   */
  static async getAllClients(_req: Request, res: Response): Promise<void> {
    try {
      const clients = await ClientService.getAllClients();

      res.status(200).json({
        message: 'Clients retrieved successfully',
        count: clients.length,
        clients,
      });
    } catch (error: any) {
      console.error('Get All Clients Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /clients/:id
   * Find a client using its MongoDB ID
   */
  static async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        res.status(400).json({ message: 'Invalid client ID' });
        return;
      }

      const client = await ClientService.getClientById(id as string);

      res.status(200).json({
        message: 'Client retrieved successfully',
        client,
      });
    } catch (error: any) {
      if (error.message === 'Invalid client ID' || error.name === 'CastError') {
        res.status(400).json({ message: error.message });
        return;
      }

      if (error.message === 'Client not found') {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('Get Client By ID Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * PUT /clients/:id
   * Update client by ID
   */
  static async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, phone, city } = req.body;

      if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        res.status(400).json({ message: 'Invalid client ID' });
        return;
      }

      if (name === undefined && phone === undefined && city === undefined) {
        res.status(400).json({
          message: 'At least one field (name, phone, city) must be provided to update',
        });
        return;
      }

      const client = await ClientService.updateClient(id as string, { name, phone, city });

      res.status(200).json({
        message: 'Client updated successfully',
        client,
      });
    } catch (error: any) {
      if (
        error.message === 'Invalid client ID' ||
        error.message?.includes('cannot be empty') ||
        error.message?.includes('must be provided') ||
        error.name === 'ValidationError' ||
        error.name === 'CastError'
      ) {
        res.status(400).json({ message: error.message });
        return;
      }

      if (error.message === 'Client not found') {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('Update Client Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * DELETE /clients/:id
   * Delete a client by ID
   */
  static async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        res.status(400).json({ message: 'Invalid client ID' });
        return;
      }

      const client = await ClientService.deleteClient(id as string);

      res.status(200).json({
        message: 'Client deleted successfully',
        client,
      });
    } catch (error: any) {
      if (error.message === 'Invalid client ID' || error.name === 'CastError') {
        res.status(400).json({ message: error.message });
        return;
      }

      if (error.message === 'Client not found') {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('Delete Client Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method aliases
  static create = ClientController.createClient;
  static getAll = ClientController.getAllClients;
  static getById = ClientController.getClientById;
  static update = ClientController.updateClient;
  static delete = ClientController.deleteClient;
}

