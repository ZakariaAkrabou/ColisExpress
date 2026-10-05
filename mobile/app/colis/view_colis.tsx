import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { Colis } from './create-colis';

export interface ViewColisProps {
  visible: boolean;
  colis: Colis | null;
  onClose: () => void;
  onEdit?: (colis: Colis) => void;
  onStatusChange?: (colisId: string, newStatus: Colis['status']) => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500';

export default function ViewColis({
  visible,
  colis,
  onClose,
  onEdit,
  onStatusChange,
}: ViewColisProps) {
  if (!colis) return null;

  const getStatusStyle = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'in_transit':
        return styles.statusTransit;
      case 'delivered':
        return styles.statusDelivered;
    }
  };

  const getStatusLabel = (status: Colis['status']) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending';
      case 'in_transit':
        return '🚚 In Transit';
      case 'delivered':
        return '✅ Delivered';
    }
  };

  const isPaid = colis.isPaid !== false; // Default true if not specified

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
              <Text style={styles.modalIcon}>📦</Text>
              <Text style={styles.modalTitle}>Colis Details</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
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
                    <Text style={styles.paidBadgeBannerText}>{isPaid ? '🟢 Payé' : '🔴 Non Payé'}</Text>
                  </View>
                  <View style={[styles.statusBadge, getStatusStyle(colis.status)]}>
                    <Text style={styles.statusText}>{getStatusLabel(colis.status)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Primary Details Card */}
            <View style={styles.modalSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tracking Number</Text>
                <Text style={styles.detailValueHighlight}>{colis.id}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Status</Text>
                <View style={[styles.paidBadgeInline, isPaid ? styles.paidBadgeInlineSuccess : styles.paidBadgeInlineDanger]}>
                  <Text style={[styles.paidBadgeInlineText, isPaid ? styles.paidBadgeTextSuccess : styles.paidBadgeTextDanger]}>
                    {isPaid ? '💳 Payé (Yes)' : '⚠️ Non Payé (No)'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Delivery Mode</Text>
                <Text style={styles.detailValue}>
                  {colis.isADomicile !== false ? '🏠 À domicile' : '📦 Point relais'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Shipment Status</Text>
                <View style={[styles.statusBadge, getStatusStyle(colis.status)]}>
                  <Text style={styles.statusText}>{getStatusLabel(colis.status)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Registered Date</Text>
                <Text style={styles.detailValue}>{colis.date}</Text>
              </View>
            </View>

            {/* Quick Status Update Options */}
            {onStatusChange && (
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>⚡ Quick Status Update</Text>
                <View style={styles.statusButtonsRow}>
                  {(['pending', 'in_transit', 'delivered'] as const).map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.statusOptionBtn,
                        colis.status === st && styles.statusOptionActive,
                      ]}
                      onPress={() => onStatusChange(colis.id, st)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          colis.status === st && styles.statusOptionActiveText,
                        ]}
                      >
                        {st === 'pending' ? '⏳ Pending' : st === 'in_transit' ? '🚚 Transit' : '✅ Delivered'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Route & Contact Section */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>🗺️ Route & Contact Info</Text>

              <View style={styles.routeStep}>
                <View style={[styles.stepDot, { backgroundColor: '#10b981' }]} />
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>ORIGIN / SENDER</Text>
                  <Text style={styles.stepCity}>{colis.fromCity}</Text>
                  <Text style={styles.stepSub}>👤 {colis.senderName}</Text>
                  <Text style={styles.stepSub}>📞 {colis.senderPhone}</Text>
                </View>
              </View>

              <View style={styles.routeConnectorLine} />

              <View style={styles.routeStep}>
                <View style={[styles.stepDot, { backgroundColor: '#ef4444' }]} />
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>DESTINATION / RECEIVER</Text>
                  <Text style={styles.stepCity}>{colis.toCity}</Text>
                  <Text style={styles.stepSub}>👤 {colis.receiverName}</Text>
                  <Text style={styles.stepSub}>📞 {colis.receiverPhone}</Text>
                </View>
              </View>
            </View>

            {/* Specifications Section */}
            <View style={styles.modalSection}>
              <Text style={styles.sectionTitle}>⚖️ Package Specifications</Text>
              <View style={styles.specGrid}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Weight</Text>
                  <Text style={styles.specValue}>{colis.weight} kg</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Quantity</Text>
                  <Text style={styles.specValue}>{colis.quantity || 1} pcs</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Price</Text>
                  <Text style={styles.specValue}>{colis.price} €</Text>
                </View>
              </View>

              <View style={styles.descriptionBox}>
                <Text style={styles.specLabel}>Contents Description</Text>
                <Text style={styles.descriptionText}>{colis.description || 'No description'}</Text>
              </View>
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
                <Text style={styles.editButtonText}>✏️ Edit Parcel Details</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 14,
    marginBottom: 14,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#0f172a',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '700',
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
    borderColor: '#334155',
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
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageOverlayTracking: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  bannerBadgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidBadgeBanner: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginRight: 6,
  },
  paidBannerSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  paidBannerDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  paidBadgeBannerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  modalSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '600',
  },
  detailValueHighlight: {
    fontSize: 16,
    color: '#38bdf8',
    fontWeight: '800',
  },
  paidBadgeInline: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  paidBadgeInlineSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  paidBadgeInlineDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  paidBadgeInlineText: {
    fontSize: 12,
    fontWeight: '800',
  },
  paidBadgeTextSuccess: {
    color: '#10b981',
  },
  paidBadgeTextDanger: {
    color: '#ef4444',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusTransit: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  statusDelivered: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusOptionBtn: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusOptionActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  statusOptionText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  statusOptionActiveText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
  },
  routeConnectorLine: {
    width: 2,
    height: 16,
    backgroundColor: '#334155',
    marginLeft: 5,
    marginVertical: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stepCity: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 2,
  },
  stepSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 10,
    marginRight: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  specLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38bdf8',
  },
  descriptionBox: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  descriptionText: {
    color: '#f8fafc',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});
