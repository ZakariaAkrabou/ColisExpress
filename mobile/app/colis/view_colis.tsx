import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Package, Edit3, X, Printer, Share2, FileText } from 'lucide-react-native';
import { Colis } from './create-colis';
import {
  generateSingleColisPrintHTML,
  printHtmlContent,
  sharePdfFile,
} from '../docs/printService';

export interface ViewColisProps {
  visible: boolean;
  colis: Colis | null;
  onClose: () => void;
  onEdit?: (colis: Colis) => void;
  onStatusChange?: (colisId: string, newStatus: Colis['status']) => void;
  onOpenDocs?: (city?: string) => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500';

export default function ViewColis({
  visible,
  colis,
  onClose,
  onEdit,
  onStatusChange,
  onOpenDocs,
}: ViewColisProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  if (!colis) return null;

  const handlePrint = async () => {
    setIsPrinting(true);
    const html = generateSingleColisPrintHTML(colis);
    await printHtmlContent(html);
    setIsPrinting(false);
  };

  const handleShare = async () => {
    setIsSharing(true);
    const html = generateSingleColisPrintHTML(colis);
    await sharePdfFile(html, `Colis_${colis.id}.pdf`);
    setIsSharing(false);
  };

  const getStatusBadgeStyle = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'in_transit':
        return styles.statusTransit;
      case 'delivered':
        return styles.statusDelivered;
    }
  };

  const getStatusTextStyle = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return styles.statusTextPending;
      case 'in_transit':
        return styles.statusTextTransit;
      case 'delivered':
        return styles.statusTextDelivered;
    }
  };

  const getStatusLabel = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return '⏳ En attente';
      case 'in_transit':
        return '🚚 En transit';
      case 'delivered':
        return '✅ Livré';
    }
  };

  const isPaid = colis.isPaid !== false;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerIconBadge}>
                <Package size={18} color="#1d4ed8" strokeWidth={2.4} />
              </View>
              <Text style={styles.modalTitle}>Détails du Colis</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Parcel Image Banner */}
            <View style={styles.imageBannerContainer}>
              <Image
                source={{ uri: colis.image || DEFAULT_IMAGE }}
                style={styles.imageBanner}
              />
              <View style={styles.imageOverlayGradient}>
                <Text style={styles.imageOverlayTracking}>{colis.id}</Text>
                <View style={styles.bannerBadgesGroup}>
                  <View style={[styles.paidBadgeBanner, isPaid ? styles.paidBannerSuccess : styles.paidBannerDanger]}>
                    <Text style={[styles.paidBadgeBannerText, isPaid ? styles.paidBannerTextSuccess : styles.paidBannerTextDanger]}>
                      {isPaid ? '🟢 Payé' : '🔴 Non Payé'}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, getStatusBadgeStyle(colis.status)]}>
                    <Text style={[styles.statusText, getStatusTextStyle(colis.status)]}>
                      {getStatusLabel(colis.status)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Primary Details Card */}
            <View style={styles.modalSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Numéro de suivi</Text>
                <Text style={styles.detailValueHighlight}>{colis.id}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Paiement</Text>
                <View style={[styles.paidBadgeInline, isPaid ? styles.paidBadgeInlineSuccess : styles.paidBadgeInlineDanger]}>
                  <Text style={[styles.paidBadgeInlineText, isPaid ? styles.paidBadgeTextSuccess : styles.paidBadgeTextDanger]}>
                    {isPaid ? '💳 Payé' : '⚠️ Non Payé'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mode de livraison</Text>
                <Text style={styles.detailValue}>
                  {colis.isADomicile !== false ? '🏠 À domicile' : '📦 Point relais'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Statut actuel</Text>
                <View style={[styles.statusBadge, getStatusBadgeStyle(colis.status)]}>
                  <Text style={[styles.statusText, getStatusTextStyle(colis.status)]}>
                    {getStatusLabel(colis.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date d'enregistrement</Text>
                <Text style={styles.detailValue}>{colis.date}</Text>
              </View>
            </View>

            {/* Quick Status Update Options */}
            {onStatusChange && (
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>⚡ Modifier le statut rapidement</Text>
                <View style={styles.statusButtonsRow}>
                  {(['pending', 'in_transit', 'delivered'] as const).map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.statusOptionBtn,
                        colis.status === st && styles.statusOptionActive,
                      ]}
                      onPress={() => onStatusChange(colis.id, st)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          colis.status === st && styles.statusOptionActiveText,
                        ]}
                      >
                        {st === 'pending' ? '⏳ Attente' : st === 'in_transit' ? '🚚 Transit' : '✅ Livré'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Route & Contact Section */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>🗺️ Trajet & Coordonnées</Text>

              <View style={styles.routeStepCard}>
                <View style={[styles.stepDot, { backgroundColor: '#16a34a' }]} />
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>EXPÉDITEUR / DÉPART</Text>
                  <Text style={styles.stepCity}>{colis.fromCity}</Text>
                  <Text style={styles.stepSub}>👤 {colis.senderName}</Text>
                  <Text style={styles.stepSub}>📞 {colis.senderPhone}</Text>
                </View>
              </View>

              <View style={styles.routeConnectorContainer}>
                <View style={styles.routeConnectorLine} />
              </View>

              <View style={styles.routeStepCard}>
                <View style={[styles.stepDot, { backgroundColor: '#2563eb' }]} />
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>DESTINATAIRE / ARRIVÉE</Text>
                  <Text style={styles.stepCity}>{colis.toCity}</Text>
                  <Text style={styles.stepSub}>👤 {colis.receiverName}</Text>
                  <Text style={styles.stepSub}>📞 {colis.receiverPhone}</Text>
                </View>
              </View>
            </View>

            {/* Specifications Section */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>⚖️ Caractéristiques du colis</Text>
              <View style={styles.specGrid}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Poids</Text>
                  <Text style={styles.specValue}>{colis.weight} kg</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Quantité</Text>
                  <Text style={styles.specValue}>{colis.quantity || 1} pcs</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Prix</Text>
                  <Text style={styles.specValue}>{colis.price} MAD</Text>
                </View>
              </View>

              <View style={styles.descriptionBox}>
                <Text style={styles.specLabel}>Description du contenu</Text>
                <Text style={styles.descriptionText}>{colis.description || 'Aucune description'}</Text>
              </View>
            </View>

            {/* Documents & Printing Section */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>🖨️ Impression & Documents</Text>
              
              <View style={styles.printButtonsRow}>
                {/* Print Ticket Button */}
                <TouchableOpacity
                  style={[styles.printPrimaryBtn, isPrinting && styles.printBtnDisabled]}
                  onPress={handlePrint}
                  disabled={isPrinting}
                  activeOpacity={0.85}
                >
                  {isPrinting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Printer size={16} color="#ffffff" style={{ marginRight: 6 }} />
                      <Text style={styles.printPrimaryBtnText}>Imprimer le ticket</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Share PDF Button */}
                <TouchableOpacity
                  style={[styles.printSecondaryBtn, isSharing && styles.printBtnDisabled]}
                  onPress={handleShare}
                  disabled={isSharing}
                  activeOpacity={0.85}
                >
                  {isSharing ? (
                    <ActivityIndicator size="small" color="#1d4ed8" />
                  ) : (
                    <>
                      <Share2 size={15} color="#1d4ed8" style={{ marginRight: 6 }} />
                      <Text style={styles.printSecondaryBtnText}>PDF</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Shortcut to Docs by City */}
              {onOpenDocs && (
                <TouchableOpacity
                  style={styles.openDocsBtn}
                  onPress={() => {
                    onClose();
                    onOpenDocs(colis.fromCity);
                  }}
                  activeOpacity={0.8}
                >
                  <FileText size={15} color="#475569" style={{ marginRight: 6 }} />
                  <Text style={styles.openDocsBtnText}>
                    Ouvrir les documents ({colis.fromCity})
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Action Bar */}
            {onEdit && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  onClose();
                  onEdit(colis);
                }}
                activeOpacity={0.85}
              >
                <Edit3 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.editButtonText}>Modifier ce colis</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 14,
    marginBottom: 14,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    marginBottom: 10,
  },
  imageBannerContainer: {
    height: 150,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  imageBanner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlayGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageOverlayTracking: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerBadgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paidBadgeBanner: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  paidBannerSuccess: {
    backgroundColor: '#dcfce7',
  },
  paidBannerDanger: {
    backgroundColor: '#fee2e2',
  },
  paidBadgeBannerText: {
    fontSize: 10,
    fontWeight: '800',
  },
  paidBannerTextSuccess: {
    color: '#15803d',
  },
  paidBannerTextDanger: {
    color: '#b91c1c',
  },
  modalSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  detailValueHighlight: {
    fontSize: 15,
    color: '#1d4ed8',
    fontWeight: '800',
  },
  paidBadgeInline: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  paidBadgeInlineSuccess: {
    backgroundColor: '#dcfce7',
  },
  paidBadgeInlineDanger: {
    backgroundColor: '#fee2e2',
  },
  paidBadgeInlineText: {
    fontSize: 12,
    fontWeight: '800',
  },
  paidBadgeTextSuccess: {
    color: '#15803d',
  },
  paidBadgeTextDanger: {
    color: '#b91c1c',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
  },
  statusTransit: {
    backgroundColor: '#dbeafe',
  },
  statusDelivered: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextPending: {
    color: '#b45309',
  },
  statusTextTransit: {
    color: '#1d4ed8',
  },
  statusTextDelivered: {
    color: '#15803d',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusOptionBtn: {
    flex: 1,
    paddingVertical: 9,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusOptionActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  statusOptionText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  statusOptionActiveText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  routeStepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 4,
  },
  routeConnectorContainer: {
    paddingLeft: 14,
    paddingVertical: 2,
  },
  routeConnectorLine: {
    width: 2,
    height: 12,
    backgroundColor: '#cbd5e1',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stepCity: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  stepSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  specItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  specLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  descriptionBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  descriptionText: {
    color: '#0f172a',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  printButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  printPrimaryBtn: {
    flex: 2,
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  printPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  printSecondaryBtn: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 10,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  printSecondaryBtnText: {
    color: '#1d4ed8',
    fontSize: 12.5,
    fontWeight: '700',
  },
  printBtnDisabled: {
    opacity: 0.6,
  },
  openDocsBtn: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  openDocsBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
});
