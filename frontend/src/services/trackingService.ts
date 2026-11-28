import type { BackendColis, ParcelRecord, StatusType } from '../types/tracking.types';
import { apiGet, resolveAssetUrl } from './api';

export const MOCK_PARCELS: Record<string, ParcelRecord> = {
  'CM-849201': {
    id: 'CM-849201',
    stepIndex: 2,
    statusType: 'transit',
    statusText: { fr: 'En transit', en: 'In Transit' },
    headline: { fr: 'En transit vers la destination', en: 'In transit to destination' },
    eta: { fr: 'Lun. 30 Nov, avant 18h00', en: 'Mon, Nov 30, before 6:00 PM' },
    isDelivered: false,
    image:
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80',
    senderName: 'az',
    senderPhone: '0655448877',
    receiverName: 'az',
    receiverPhone: '0655448877',
    fromCity: 'das',
    toCity: 'sse',
    weight: '2',
    price: '22',
    quantity: '2',
    direction: 'FR_TO_MA',
    isPaid: true,
    isADomicile: true,
    description: 'sss',
  },
  'CM-304912': {
    id: 'CM-304912',
    stepIndex: 3,
    statusType: 'active',
    statusText: { fr: 'En cours de livraison', en: 'Out for Delivery' },
    headline: {
      fr: 'Votre livreur CASMOH est en route à Marrakech',
      en: 'Your CASMOH courier is on the way in Marrakech',
    },
    eta: { fr: 'Aujourd’hui, avant 18h00', en: 'Today, before 6:00 PM' },
    isDelivered: false,
    image:
      'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=80',
    senderName: 'Karim Benjelloun',
    senderPhone: '+33 6 14 82 90 31',
    receiverName: 'Salma El Idrissi',
    receiverPhone: '+212 6 61 48 22 19',
    fromCity: 'Lyon',
    toCity: 'Marrakech',
    weight: '19',
    price: '65',
    quantity: '2',
    direction: 'FR_TO_MA',
    isPaid: false,
    isADomicile: true,
    description:
      '1 valise scellée vêtements et cadeaux familiaux + 1 carton petit électroménager',
  },
  'CM-991024': {
    id: 'CM-991024',
    stepIndex: 4,
    statusType: 'delivered',
    statusText: { fr: 'Livré', en: 'Delivered' },
    headline: {
      fr: 'Colis et valises livrés avec succès au destinataire',
      en: 'Parcels and suitcases successfully delivered',
    },
    eta: { fr: 'Ven. 27 Nov à 15:40', en: 'Fri, Nov 27 at 3:40 PM' },
    isDelivered: true,
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    senderName: 'Nadia Alaoui',
    senderPhone: '+212 6 62 90 11 45',
    receiverName: 'Mehdi Tazi',
    receiverPhone: '+33 7 81 34 55 09',
    fromCity: 'Casablanca',
    toCity: 'Paris',
    weight: '34',
    price: '110',
    quantity: '3',
    direction: 'MA_TO_FR',
    isPaid: true,
    isADomicile: false,
    description: '2 valises effets personnels + 1 colis artisanat marocain emballé',
  },
};

const mapBackendColisToParcel = (colis: BackendColis): ParcelRecord => {
  const statusMap: Record<
    BackendColis['status'],
    {
      stepIndex: number;
      statusType: StatusType;
      statusText: { fr: string; en: string };
      headline: { fr: string; en: string };
      isDelivered: boolean;
    }
  > = {
    pending: {
      stepIndex: 1,
      statusType: 'active',
      statusText: { fr: 'En attente', en: 'Pending' },
      headline: {
        fr: 'Colis enregistré et prêt pour expédition',
        en: 'Parcel registered and ready for dispatch',
      },
      isDelivered: false,
    },
    in_transit: {
      stepIndex: 2,
      statusType: 'transit',
      statusText: { fr: 'En transit', en: 'In Transit' },
      headline: {
        fr: `En transit vers ${colis.toCity}`,
        en: `In transit to ${colis.toCity}`,
      },
      isDelivered: false,
    },
    delivered: {
      stepIndex: 4,
      statusType: 'delivered',
      statusText: { fr: 'Livré', en: 'Delivered' },
      headline: {
        fr: 'Colis livré avec succès au destinataire',
        en: 'Parcel successfully delivered to recipient',
      },
      isDelivered: true,
    },
  };

  const mapped = statusMap[colis.status] || statusMap.pending;
  const trackingId = colis.ncommand || colis._id || colis.id || '';

  return {
    id: trackingId,
    stepIndex: mapped.stepIndex,
    statusType: mapped.statusType,
    statusText: mapped.statusText,
    headline: mapped.headline,
    eta: {
      fr: colis.date || '3 à 5 jours ouvrés',
      en: colis.date || '3 to 5 business days',
    },
    isDelivered: mapped.isDelivered,
    image: resolveAssetUrl(colis.image),
    senderName: colis.senderName,
    senderPhone: colis.senderPhone,
    receiverName: colis.receiverName,
    receiverPhone: colis.receiverPhone,
    fromCity: colis.fromCity,
    toCity: colis.toCity,
    weight: String(colis.weight ?? 0),
    price: String(colis.price ?? 0),
    quantity: String(colis.quantity ?? 1),
    direction: colis.direction || 'FR_TO_MA',
    isPaid: colis.isPaid !== false,
    isADomicile: colis.isADomicile !== false,
    description: colis.description || '',
  };
};

export const findParcelByTrackingCode = async (
  rawCode: string
): Promise<ParcelRecord | null> => {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) return null;

  // Check local mock records first for demo codes
  if (MOCK_PARCELS[normalized]) {
    return MOCK_PARCELS[normalized];
  }

  try {
    // If valid MongoDB ObjectId, query /colis/:id directly
    if (/^[a-f\d]{24}$/i.test(rawCode.trim())) {
      const res = await apiGet<{ colis: BackendColis }>(`/colis/${rawCode.trim()}`);
      if (res?.colis) {
        return mapBackendColisToParcel(res.colis);
      }
    }

    // Otherwise search all colis by ncommand or id
    const res = await apiGet<{ colis: BackendColis[] }>('/colis');
    const match = (res?.colis || []).find((item) => {
      const idMatch =
        (item._id || '').toUpperCase() === normalized ||
        (item.id || '').toUpperCase() === normalized;
      const commandMatch = (item.ncommand || '').toUpperCase() === normalized;
      return idMatch || commandMatch;
    });

    return match ? mapBackendColisToParcel(match) : null;
  } catch {
    return null;
  }
};
