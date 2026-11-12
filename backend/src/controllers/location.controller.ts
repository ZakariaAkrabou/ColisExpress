import { Request, Response } from 'express';
import { LocationService } from '../services/location.service';

export class LocationController {


    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { country } = req.query;
            if (!country) {
                res.status(400).json({ message: 'Country query parameter is required' });
                return;
            }

            const locations = await LocationService.getLocationsByCountry(country as string);
            res.status(200).json({ data: locations });
        } catch (error: any) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }


    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, country } = req.body;

            if (!name || !country) {
                res.status(400).json({ message: 'Name and country are required' });
                return;
            }

            const newLocation = await LocationService.addLocation(name, country);
            res.status(201).json({ message: 'City added successfully', data: newLocation });
        } catch (error: any) {
            if (error.message.includes('already exists')) {
                res.status(409).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            
            const id = req.params.id as string;

            await LocationService.deleteLocation(id);
            res.status(200).json({ message: 'City deleted successfully' });
        } catch (error: any) {
            if (error.message === 'Location not found') {
                res.status(404).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}