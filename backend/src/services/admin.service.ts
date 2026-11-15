import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

export class AdminService {

  static async getAllUsers() {
   
    return await User.find().select('-password').sort({ createdAt: -1 });
  }


  static async createRamasseur(data: { name: string; email: string; password: string }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }


    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'ramasseur', 
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
    };
  }


  static async toggleUserStatus(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'admin') {
      throw new Error('Cannot deactivate an Admin account');
    }

    user.isActive = !user.isActive;
    await user.save();

    return {
      id: user.id,
      name: user.name,
      isActive: user.isActive,
    };
  }

  static async forceLogout(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('Cannot force logout an Admin account');

    user.tokenVersion += 1; 
    await user.save();
    return { message: 'User forcefully logged out' };
  }

 
  static async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('Cannot delete an Admin account');

    await User.findByIdAndDelete(userId);
    return { message: 'User deleted permanently' };
  }
}