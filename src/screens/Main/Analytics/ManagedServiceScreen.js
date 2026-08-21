import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useStripe } from '@stripe/stripe-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { ScreenOverlayLoader } from '../../../components';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { useCustomQuery } from '../../../query/useCustomQuery';
import {
  createManagedServicePaymentIntent,
  getManagedServicePurchaseInfo,
  verifyManagedServicePayment,
} from '../../../api/managedServiceService';
import { formatMoney } from '../../../constants/coaching';
import { setUser } from '../../../redux/slices/appSlice';
import { showMessage } from '../../../utils';

const ManagedServiceScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector(state => state.app);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [quantity, setQuantity] = useState(1);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    data: purchaseInfo,
    isLoading: loadingPurchaseInfo,
    isError: purchaseInfoError,
    refetch: refetchPurchaseInfo,
  } = useCustomQuery({
    queryKey: ['managedServicePurchaseInfo'],
    queryFn: getManagedServicePurchaseInfo,
  });

  useEffect(() => {
    if (!purchaseInfo) return;
    const nextQuantity = Number(purchaseInfo.minQuantity) || 1;
    setQuantity(nextQuantity);
  }, [purchaseInfo]);

  const totalPrice = useMemo(() => {
    return Number(purchaseInfo?.pricePerSession || 0) * Number(quantity || 1);
  }, [purchaseInfo, quantity]);

  const applyVerificationSuccess = data => {
    const payload = data?.data || {};
    const sessionsAdded = Number(payload.sessions_added) || 0;
    const remaining = payload.remaining_sessions != null ? Number(payload.remaining_sessions) : null;

    if (remaining != null) {
      dispatch(
        setUser({
          ...user,
          remaining_sessions: remaining,
          remaining_service_sessions: remaining,
        }),
      );
    }

    queryClient.invalidateQueries({ queryKey: ['managedServicePurchaseInfo'] });

    showMessage({
      type: 'success',
      message:
        data?.message ||
        `Payment successful! ${sessionsAdded || quantity} managed-service session(s) added.`,
    });
  };

  const { mutate: verifyPayment, isPending: verifyingPayment } = useCustomMutation({
    mutationFn: verifyManagedServicePayment,
    onSuccess: data => {
      applyVerificationSuccess(data);
    },
    onError: err => {
      const body = err?.data;
      const message = body?.message || 'Unable to verify payment. Please try again.';
      showMessage({ type: 'danger', message });
    },
  });

  const { mutate: createPaymentIntent, isPending: creatingPaymentIntent } = useCustomMutation({
    mutationFn: createManagedServicePaymentIntent,
    onSuccess: async data => {
      const body = data?.data || data || {};
      const clientSecret = body?.client_secret;
      const intentId = body?.payment_intent_id;
      if (!clientSecret || !intentId) {
        showMessage({
          type: 'danger',
          message: data?.message || 'Unable to initialize payment. Please try again.',
        });
        return;
      }

      setPaymentIntentId(intentId);
      setIsProcessingPayment(true);
      try {
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'ClayMaster',
          appearance: {
            theme: 'light',
            colors: {
              primary: COLORS.primary,
              background: COLORS.mainBg,
              surface: COLORS.surface,
              componentBackground: COLORS.surface,
              componentBorder: COLORS.borderMuted,
              componentText: COLORS.textPrimary,
              placeholderText: COLORS.textSecondary,
              icon: COLORS.primary,
              error: COLORS.destructive,
            },
            shapes: {
              borderRadius: Sizer.hSize(14),
            },
            primaryButton: {
              colors: {
                background: COLORS.primary,
                text: COLORS.white100,
              },
            },
          },
        });

        if (initError) {
          showMessage({ type: 'danger', message: initError.message || 'Unable to prepare payment.' });
          return;
        }

        const { error: presentError } = await presentPaymentSheet();
        if (presentError) {
          if (presentError.code === 'Canceled') {
            showMessage({ message: 'Payment was cancelled.' });
          } else {
            showMessage({ type: 'danger', message: presentError.message || 'Payment failed.' });
          }
          return;
        }

        verifyPayment({ payment_intent_id: intentId });
      } catch (error) {
        showMessage({ type: 'danger', message: 'Something went wrong during payment.' });
      } finally {
        setIsProcessingPayment(false);
      }
    },
    onError: err => {
      const body = err?.data;
      if (body?.code === 'no_subscription') {
        showMessage({ type: 'danger', message: body.message || 'Please subscribe first.' });
        navigation.navigate('SubscriptionScreen');
        return;
      }
      if (body?.code === 'invalid_package') {
        showMessage({ type: 'danger', message: body.message || 'You must have a Classic or Pro Plan to purchase extra sessions.' });
        return;
      }
      const message = body?.message || 'Unable to create payment intent. Please try again.';
      showMessage({ type: 'danger', message });
    },
  });

  const startPurchase = () => {
    if (!purchaseInfo) {
      showMessage({ type: 'danger', message: 'Unable to load purchase information.' });
      return;
    }
    createPaymentIntent({ quantity });
  };

  const decrementQuantity = () => {
    if (!purchaseInfo) return;
    setQuantity(q => Math.max(Number(purchaseInfo.minQuantity) || 1, q - 1));
  };

  const incrementQuantity = () => {
    if (!purchaseInfo) return;
    setQuantity(q => Math.min(Number(purchaseInfo.maxQuantity) || 10, q + 1));
  };

  const loading = loadingPurchaseInfo;
  const processing = creatingPaymentIntent || verifyingPayment || isProcessingPayment;
  const canPurchase = Boolean(purchaseInfo && totalPrice > 0 && !processing);

  if (useRequireLibraryMode()) {
    return null;
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Managed Services"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Icon name="headset-outline" iconFamily="Ionicons" size={22} color={COLORS.white100} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.white100}>
                Managed Services
              </Typography>
              <Typography size={14} color="rgba(255,255,255,0.85)" mT={2}>
                Analytics & session credits
              </Typography>
            </View>
          </View>
          <Typography size={14} color="rgba(255,255,255,0.9)" lineHeight={22} mT={12}>
            ClayMaster reviews your digital scorecard and prepares a full analytics
            report for you. Purchase sessions below; requesting a new analytics
            review from a scorecard will be available once that flow is enabled.
          </Typography>
        </View>

        {purchaseInfoError ? (
          <TouchableOpacity onPress={refetchPurchaseInfo} style={[GLOBALSTYLE.screenCard, styles.errorCard]}>
            <Typography color={COLORS.destructive} fFamily="barlowSemiBold600">
              Unable to load purchase information. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : null}

        <View style={[GLOBALSTYLE.screenCard, styles.summaryCard]}>
          <View style={styles.summaryHeader}>
            <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.textPrimary}>
              {purchaseInfo?.packageName || 'Pro Plan Session'}
            </Typography>
            <Typography size={12} color={COLORS.textSecondary}>
              {purchaseInfo?.currency?.toUpperCase() || 'USD'} • {purchaseInfo?.minQuantity || 1}-{purchaseInfo?.maxQuantity || 10} sessions
            </Typography>
          </View>

          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Typography size={12} color={COLORS.textSecondary}>
                Remaining
              </Typography>
              <Typography fFamily="barlowSemiBold600" size={22} color={COLORS.textPrimary}>
                {purchaseInfo?.remainingSessions ?? '—'}
              </Typography>
            </View>
            <View style={styles.balanceItemRight}>
              <Typography size={12} color={COLORS.textSecondary}>
                Price per session
              </Typography>
              <Typography fFamily="barlowSemiBold600" size={22} color={COLORS.textPrimary}>
                {formatMoney(purchaseInfo?.pricePerSession || 0)}
              </Typography>
            </View>
          </View>

          <View style={styles.qtySection}>
            <Typography fFamily="barlowSemiBold600" size={15} color={COLORS.textPrimary} mB={10}>
              Quantity
            </Typography>
            <View style={styles.qtyBox}>
              <TouchableOpacity
                style={[styles.qtyButton, quantity <= (purchaseInfo?.minQuantity || 1) && styles.qtyButtonDisabled]}
                onPress={decrementQuantity}
                disabled={quantity <= (purchaseInfo?.minQuantity || 1) || processing}
              >
                <Icon name="remove" iconFamily="Ionicons" size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Typography fFamily="barlowBold700" size={18} color={COLORS.textPrimary}>
                {quantity}
              </Typography>
              <TouchableOpacity
                style={[styles.qtyButton, quantity >= (purchaseInfo?.maxQuantity || 10) && styles.qtyButtonDisabled]}
                onPress={incrementQuantity}
                disabled={quantity >= (purchaseInfo?.maxQuantity || 10) || processing}
              >
                <Icon name="add" iconFamily="Ionicons" size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.totalRow}>
            <View>
              <Typography size={12} color={COLORS.textSecondary}>
                Total
              </Typography>
              <Typography fFamily="barlowSemiBold600" size={22} color={COLORS.textPrimary}>
                {formatMoney(totalPrice)}
              </Typography>
            </View>
            <TouchableOpacity
              style={[styles.purchaseBtn, !canPurchase && styles.purchaseBtnDisabled]}
              onPress={startPurchase}
              activeOpacity={0.88}
              disabled={!canPurchase}
            >
              <Typography fFamily="barlowSemiBold600" size={15} color={COLORS.white100}>
                Purchase {quantity} Session{quantity === 1 ? '' : 's'}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[GLOBALSTYLE.screenCard, styles.featuresCard]}>
          <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.textPrimary} mB={12}>
            What’s Included
          </Typography>
          <View style={styles.featureRow}>
            <Icon name="checkmark-circle" iconFamily="Ionicons" size={18} color={COLORS.primary} />
            <Typography size={14} color={COLORS.textPrimary} mL={12}>
              Personalized coaching analytics and feedback
            </Typography>
          </View>
          <View style={styles.featureRow}>
            <Icon name="checkmark-circle" iconFamily="Ionicons" size={18} color={COLORS.primary} />
            <Typography size={14} color={COLORS.textPrimary} mL={12}>
              Dedicated managed-service sessions
            </Typography>
          </View>
          <View style={styles.featureRow}>
            <Icon name="checkmark-circle" iconFamily="Ionicons" size={18} color={COLORS.primary} />
            <Typography size={14} color={COLORS.textPrimary} mL={12}>
              Secure Stripe checkout with PaymentSheet
            </Typography>
          </View>
        </View>
      </ScrollView>

      <ScreenOverlayLoader visible={loading || processing} />
    </Container>
  );
};

export default ManagedServiceScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  heroHeader: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12) },
  heroIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCard: {
    padding: Sizer.hSize(SPACING.cardP),
    borderColor: COLORS.destructive,
    borderWidth: Sizer.hSize(1),
  },
  summaryCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  summaryHeader: {
    marginBottom: Sizer.vSize(18),
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Sizer.hSize(16),
    marginBottom: Sizer.vSize(18),
  },
  balanceItem: {
    flex: 1,
  },
  balanceItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  qtySection: {
    marginBottom: Sizer.vSize(18),
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: Sizer.hSize(1),
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(8),
    height: Sizer.hSize(52),
    backgroundColor: COLORS.surface,
  },
  qtyButton: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white100,
  },
  qtyButtonDisabled: {
    opacity: 0.32,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Sizer.hSize(12),
  },
  purchaseBtn: {
    minWidth: Sizer.hSize(160),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    height: Sizer.hSize(48),
    paddingHorizontal: Sizer.hSize(14),
  },
  purchaseBtnDisabled: {
    backgroundColor: COLORS.grey200,
  },
  featuresCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizer.vSize(14),
  },
});
