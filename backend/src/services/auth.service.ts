import { User } from '../models/user.model';
import { generateToken } from '../utils/jwt';

export class AuthService {

    static async login(email: string, password: string) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
            throw new Error('Account is disabled');
        }

        const token = generateToken(user.id, user.role);


        return {
            token
        };
    }
}
