import mongoose, { Schema, Document } from 'mongoose';


export interface IBackupAuth extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string; 
  createdAt: Date;
  updatedAt: Date;
}

const BackupAuthSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);

export const BackupAuth = mongoose.model<IBackupAuth>('BackupAuth', BackupAuthSchema, 'backup_auth');


export interface IBackupLog extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileId: string;
  size: number; 
  status: 'success' | 'failed';
  errorMessage?: string;
  createdAt: Date;
}

const BackupLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileId: { type: String, required: true },
    size: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    errorMessage: { type: String },
  },
  { timestamps: true }
);
export const BackupLog = mongoose.model<IBackupLog>('BackupLog', BackupLogSchema, 'backup_logs');
