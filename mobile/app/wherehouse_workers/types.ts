export interface WarehouseWorker {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  createdAt?: string;
}

export type WorkerModalMode = 'add' | 'edit';

export interface WarehouseWorkersPageProps {
  onBack?: () => void;
  workersList?: WarehouseWorker[];
  onUpdateWorkersList?: (workers: WarehouseWorker[]) => void;
}
