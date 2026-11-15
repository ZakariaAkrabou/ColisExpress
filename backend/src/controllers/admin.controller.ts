import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await AdminService.getAllUsers();
      res.status(200).json({ data: users });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


  static async createRamasseur(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email, and password are required' });
        return;
      }

      const user = await AdminService.createRamasseur({ name, email, password });
      
      res.status(201).json({
        message: 'Ramasseur account created successfully',
        data: user,
      });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }


  static async toggleUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedUser = await AdminService.toggleUserStatus(id);
      
      res.status(200).json({
        message: `User status updated to ${updatedUser.isActive ? 'Active' : 'Inactive'}`,
        data: updatedUser,
      });
    } catch (error: any) {
      if (error.message === 'User not found' || error.message === 'Cannot deactivate an Admin account') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

   static async forceLogout(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await AdminService.forceLogout(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await AdminService.deleteUser(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}