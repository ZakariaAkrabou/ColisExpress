import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User, IUser, UserRole } from '../models/user.model';

export interface AuthRequest extends Request {
    user?: IUser;
}



export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token;

        const authHeader = req.headers.authorization;
        if (authHeader && /^Bearer\s/i.test(authHeader)) {
            token = authHeader
                .replace(/^(Bearer\s+)+/i, '')
                .trim()
                .replace(/^["']|["']$/g, '');
        }

        if (!token) {
            res.status(401).json({ message: 'Not authorized to access this route. No token provided.' });
            return;
        }

       
        const decoded = verifyToken(token);

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
    } catch (error: any) {
        
        console.error(" JWT VERIFY ERROR:", error.message,
            "| Authorization header received:", JSON.stringify((req.headers.authorization || '').slice(0, 40)));
        res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
    }
};

export const restrictTo = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'You do not have permission to perform this action.' });
            return;
        }
        next();
    }
}