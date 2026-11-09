import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/auth.model';


export interface AuthRequest extends Request {
    user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_sercet_fallback_key';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {

    try {
        let token;

        if (req.headers.authorization && req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({ message: 'Not authorized to access this route. No token provided.' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
            return;
        }

        if (!currentUser.isActive) {
            res.status(403).json({ message: 'This account has been disabled.' });
            return;
        }

        req.user = currentUser;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
    }
};


export const restrictTo = (...roles: UserRole[]) => {

    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if(!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'You do not have permission to perform this action.' });
            
            return;
        }
        next();
    }
}