import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ColisService } from '../services/colis.service';

export class ColisController {
  /**
   * POST /colis
   * Create a new colis (or batch if createBatch=true or if requested)
   */
  static async createColis(req: Request, res: Response): Promise<void> {
    try {
      const {
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        fromCity,
        toCity,
        weight,
        price,
        quantity,
        orderInCommand,
        ncommand,
        isPaid,
        isADomicile,
        status,
        date,
        description,
        image,
        direction,
        createBatch,
      } = req.body;

      if (!senderName || !senderPhone || !receiverName || !receiverPhone || !fromCity || !toCity || weight === undefined || price === undefined) {
        res.status(400).json({
          message: 'Sender name, sender phone, receiver name, receiver phone, departure city, destination city, weight, and price are required',
        });
        return;
      }

      // If createBatch is true and quantity > 1, create individual colis records
      if (createBatch && Number(quantity) > 1) {
        const colisList = await ColisService.createColisBatch({
          senderName,
          senderPhone,
          receiverName,
          receiverPhone,
          fromCity,
          toCity,
          weight,
          price,
          quantity,
          orderInCommand,
          ncommand,
          isPaid,
          isADomicile,
          status,
          date,
          description,
          image,
          direction,
        });

        res.status(201).json({
          message: `${colisList.length} colis created successfully`,
          count: colisList.length,
          colis: colisList,
        });
        return;
      }

      const colis = await ColisService.createColis({
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        fromCity,
        toCity,
        weight,
        price,
        quantity,
        orderInCommand,
        ncommand,
        isPaid,
        isADomicile,
        status,
        date,
        description,
        image,
        direction,
      });

      res.status(201).json({
        message: 'Colis created successfully',
        colis,
      });
    } catch (error: any) {
      if (
        error.name === 'ValidationError' ||
        error.message?.includes('required') ||
        error.message?.includes('must be') ||
        error.message?.includes('cannot be empty')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }

      console.error('Create Colis Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /colis
   * Return all colis with optional filters
   */
  static async getAllColis(req: Request, res: Response): Promise<void> {
    try {
      const { status, direction, fromCity, toCity } = req.query;
      const filter: Record<string, any> = {};

      if (status) filter.status = status;
      if (direction) filter.direction = direction;
      if (fromCity) filter.fromCity = fromCity;
      if (toCity) filter.toCity = toCity;

      const colis = await ColisService.getAllColis(filter);

      res.status(200).json({
        message: 'Colis retrieved successfully',
        count: colis.length,
        colis,
      });
    } catch (error: any) {
      console.error('Get All Colis Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /colis/:id
   * Find a colis using its MongoDB ID
   */
  static async getColisById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        res.status(400).json({ message: 'Invalid colis ID' });
        return;
      }

      const colis = await ColisService.getColisById(id as string);

      res.status(200).json({
        message: 'Colis retrieved successfully',
        colis,
      });
    } catch (error: any) {
      if (error.message === 'Invalid colis ID' || error.name === 'CastError') {
        res.status(400).json({ message: error.message });
        return;
      }

      if (error.message === 'Colis not found') {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('Get Colis By ID Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * PUT /colis/:id
   * Update colis by ID
   */
  static async updateColis(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        res.status(400).json({ message: 'Invalid colis ID' });
        return;
      }

      const colis = await ColisService.updateColis(id as string, req.body);

      res.status(200).json({
        message: 'Colis updated successfully',
        colis,
      });
    } catch (error: any) {
      if (
        error.message === 'Invalid colis ID' ||
        error.message?.includes('cannot be empty') ||
        error.message?.includes('must be provided') ||
        error.message?.includes('must be') ||
        error.name === 'ValidationError' ||
        error.name === 'CastError'
      ) {
        res.status(400).json({ message: error.message });
        return;
      }

      if (error.message === 'Colis not found') {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('Update Colis Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * DELETE /colis/:id
   * Delete a colis by ID
   */
  static async deleteColis(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        res.status(400).json({ message: 'Invalid colis ID' });
        return;
      }

      const colis = await ColisService.deleteColis(id as string);

      res.status(200).json({
        message: 'Colis deleted successfully',
        colis,
      });
    } catch (error: any) {
      if (error.message === 'Invalid colis ID' || error.name === 'CastError') {
        res.status(400).json({ message: error.message });
        return;
      }

      if (error.message === 'Colis not found') {
        res.status(404).json({ message: error.message });
        return;
      }

      console.error('Delete Colis Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method aliases
  static create = ColisController.createColis;
  static getAll = ColisController.getAllColis;
  static getById = ColisController.getColisById;
  static update = ColisController.updateColis;
  static delete = ColisController.deleteColis;
}

