
export type ColisStatus = 'pending' | 'in_transit' | 'delivered';
export type ColisDirection = 'FR_TO_MA' | 'MA_TO_FR';

export interface Colis {
  id: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  weight: number;
  price: number;
  quantity: number;
  orderInCommand: number;
  ncommand: string;
  isPaid: boolean;
  isADomicile: boolean;
  status: ColisStatus;
  date?: string;
  description?: string;
  image?: string;
  direction?: ColisDirection;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateColisInput = {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  weight: number;
  price: number;
  quantity?: number;
  isPaid?: boolean;
  isADomicile?: boolean;
  status?: ColisStatus;
  date?: string;
  description?: string;
  image?: string;
  direction: ColisDirection;
};

export type UpdateColisInput = Partial<CreateColisInput>;

export interface ColisFilters {
  status?: ColisStatus;
  direction?: ColisDirection;
  fromCity?: string;
  toCity?: string;
}
