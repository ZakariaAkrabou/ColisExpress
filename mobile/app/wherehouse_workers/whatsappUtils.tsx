import React from 'react';
import { Linking, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface WhatsAppIconProps {
  size?: number;
  color?: string;
}

export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.411z"
      fill={color}
    />
  </Svg>
);

export const contactWorkerViaWhatsApp = async (
  phoneNumber: string,
  workerName?: string
) => {
  if (!phoneNumber) {
    Alert.alert('Numéro manquant', "Cet ouvrier n'a pas de numéro de téléphone enregistré.");
    return;
  }

  // Clean the phone number (remove all non-digits)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  if (cleanPhone.length < 8) {
    Alert.alert('Numéro invalide', 'Le format du numéro de téléphone est incomplet.');
    return;
  }

  const message = workerName
    ? `Bonjour ${workerName}, je vous contacte depuis la gestion ColisExpress.`
    : `Bonjour, je vous contacte depuis la gestion ColisExpress.`;

  const encodedMessage = encodeURIComponent(message);
  const deepLink = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
  const webLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  try {
    const supported = await Linking.canOpenURL(deepLink);
    if (supported) {
      await Linking.openURL(deepLink);
    } else {
      await Linking.openURL(webLink);
    }
  } catch (error) {
    // Attempt web fallback
    try {
      await Linking.openURL(webLink);
    } catch (e) {
      Alert.alert(
        'WhatsApp non accessible',
        `Impossible d'ouvrir WhatsApp pour contacter ${workerName || 'cet ouvrier'}.\nNuméro: ${phoneNumber}`
      );
    }
  }
};

export const callWorkerDirectly = (phoneNumber: string) => {
  if (!phoneNumber) return;
  const cleanPhone = phoneNumber.replace(/\s+/g, '');
  Linking.openURL(`tel:${cleanPhone}`).catch(() => {
    Alert.alert('Appel direct', `Numéro: ${phoneNumber}`);
  });
};

export const emailWorkerDirectly = (email: string, workerName?: string) => {
  if (!email) return;
  const subject = encodeURIComponent('ColisExpress - Communication Entrepôt');
  const body = encodeURIComponent(
    `Bonjour ${workerName || ''},\n\nSuite aux opérations d'entrepôt ColisExpress, ...`
  );
  Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`).catch(() => {
    Alert.alert('E-mail', `Adresse: ${email}`);
  });
};

