import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserRole = 'admin' | 'ramasseur';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['admin', 'ramasseur'],
            default: 'ramasseur'
        },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);


UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
   
    this.password = await bcrypt.hash(this.password as string, salt);
});


UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    
    return bcrypt.compare(candidatePassword, this.password as string);
};

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);