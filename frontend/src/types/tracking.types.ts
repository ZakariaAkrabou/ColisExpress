export type Language = 'fr' | 'en';
export type Direction = 'FR_TO_MA' | 'MA_TO_FR';
export type StatusType = 'transit' | 'active' | 'delivered';

export interface LocalizedString {
  fr: string;
  en: string;
}

export interface ParcelRecord {
  id: string;
  stepIndex: number;
  statusType: StatusType;
  statusText: LocalizedString;
  headline: LocalizedString;
  eta: LocalizedString;
  isDelivered: boolean;
  image: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  weight: string;
  price: string;
  quantity: string;
  direction: Direction;
  isPaid: boolean;
  isADomicile: boolean;
  description: string;
}

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'warning' | 'info';
}

export interface BackendColis {
  _id?: string;
  id?: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  weight: number;
  price: number;
  quantity?: number;
  ncommand?: string;
  isPaid?: boolean;
  isADomicile?: boolean;
  status: 'pending' | 'in_transit' | 'delivered';
  date?: string;
  description?: string;
  image?: string;
  direction?: Direction;
}
