import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Container, Typography, AppLoader } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { Button, ScreenOverlayLoader } from '../../../components';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import {
  getSessionPurchaseInfo,
  getSessions,
  purchaseSessions,
  createSessionSetupIntent,
} from '../../../api/coachingService';
import { formatMoney } from '../../../constants/coaching';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';
import { setUser } from '../../../redux/slices/appSlice';
import { useKeyboard } from '../../../hooks/useKeyboard';
import { showMessage } from '../../../utils';

/** ClayMaster-App-UI `Coaching.tsx` → sessions/setup-intent + sessions/purchase */
const CoachingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector(state => state.app);
  const { confirmSetupIntent, handleNextAction } = useStripe();
  const { keyboardOpen } = useKeyboard();

  const {
    data: sessions,
    isLoading: loadingSessions,
    isError: sessionsError,
    refetch: refetchSessions,
  } = useCustomQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  const {
    data: purchaseInfo,
    isLoading: loadingPurchase,
    isError: purchaseError,
    refetch: refetchPurchase,
  } = useCustomQuery({
    queryKey: ['sessionPurchaseInfo'],
    queryFn: getSessionPurchaseInfo,
  });

  const [bundleType, setBundleType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const summary = sessions?.summary;
  const stats = useMemo(
    () => [
      {
        icon: 'calendar-outline',
        label: 'Total',
        value: String(summary?.totalSessions ?? 0),
      },
      {
        icon: 'checkmark-circle-outline',
        label: 'Used',
        value: String(summary?.usedSessions ?? 0),
      },
      {
        icon: 'time-outline',
        label: 'Remaining',
        value: String(summary?.remainingSessions ?? 0),
      },
    ],
    [summary],
  );

  const packages = useMemo(() => {
    if (!purchaseInfo) return [];
    return [
      {
        bundleType: 'single',
        title: '1 Session',
        desc: purchaseInfo.packageName || 'One-on-one coaching',
        priceLabel: formatMoney(purchaseInfo.singlePrice),
        price: purchaseInfo.singlePrice,
      },
      {
        bundleType: 'bundle',
        title: `${purchaseInfo.bundleQty || 10} Sessions`,
        desc: purchaseInfo.bundleSavings
          ? `Save ${formatMoney(purchaseInfo.bundleSavings)} – Best value`
          : purchaseInfo.packageName || 'Session bundle',
        priceLabel: formatMoney(purchaseInfo.bundlePrice),
        price: purchaseInfo.bundlePrice,
      },
    ];
  }, [purchaseInfo]);

  const applyPurchaseSuccess = data => {
    const payload = data?.data || {};
    const sessionsAdded = Number(payload.sessions_added) || 0;
    const remaining =
      payload.remaining_sessions != null
        ? Number(payload.remaining_sessions)
        : null;

    // Purchase API already returns updated counts — patch cache, no GET /sessions
    queryClient.setQueryData(['sessions'], prev => {
      if (!prev) return prev;
      const prevSummary = prev.summary || {};
      const used = Number(prevSummary.usedSessions) || 0;
      const nextRemaining =
        remaining != null
          ? remaining
          : (Number(prevSummary.remainingSessions) || 0) + sessionsAdded;
      const nextTotal =
        remaining != null
          ? used + remaining
          : (Number(prevSummary.totalSessions) || 0) + sessionsAdded;
      const percentageUsed =
        nextTotal > 0 ? Math.round((used / nextTotal) * 100) : 0;

      return {
        ...prev,
        summary: {
          ...prevSummary,
          totalSessions: nextTotal,
          remainingSessions: nextRemaining,
          outstandingSessions: nextRemaining,
          percentageUsed,
        },
      };
    });

    if (remaining != null) {
      dispatch(
        setUser({
          ...user,
          remaining_sessions: remaining,
        }),
      );
    }

    setClientSecret(null);
    setBundleType(null);
    showMessage({
      type: 'success',
      message:
        data?.message ||
        `${sessionsAdded || 1} session(s) purchased.`,
    });
  };

  const resolveRequiresAction = async data => {
    const piSecret = data?.data?.payment_intent_client_secret;
    if (!piSecret) {
      showMessage({
        type: 'danger',
        message: data?.message || 'Additional authentication required.',
      });
      return;
    }

    setIsProcessingPayment(true);
    try {
      const { error, paymentIntent } = await handleNextAction(piSecret);
      if (error) {
        Alert.alert('Payment Failed', error.message);
        return;
      }
      const status = String(paymentIntent?.status || '').toLowerCase();
      if (status === 'succeeded') {
        applyPurchaseSuccess({
          ...data,
          message: data?.message || 'Session(s) purchased successfully.',
          data: {
            ...data?.data,
            payment_status: 'succeeded',
          },
        });
        return;
      }
      showMessage({
        type: 'danger',
        message: 'Payment was not completed. Please try again.',
      });
    } catch {
      Alert.alert('Error', 'Something went wrong during authentication');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const { mutate: completePurchase, isPending: purchasing } = useCustomMutation({
    mutationFn: purchaseSessions,
    onSuccess: data => {
      if (data?.requires_action || data?.data?.payment_status === 'requires_action') {
        resolveRequiresAction(data);
        return;
      }

      const paymentStatus = data?.data?.payment_status;
      const ok =
        paymentStatus === 'succeeded' ||
        ((data?.status === true || data?.success === true) &&
          paymentStatus !== 'requires_action' &&
          !data?.requires_action);

      if (!ok) {
        showMessage({
          type: 'danger',
          message: data?.message || 'Purchase failed.',
        });
        return;
      }

      applyPurchaseSuccess(data);
    },
    onError: err => {
      const body = err?.data;
      if (body?.requires_action || body?.data?.payment_status === 'requires_action') {
        resolveRequiresAction(body);
        return;
      }
      const msg =
        body?.message ||
        body?.error ||
        'Purchase failed. Please try again.';
      showMessage({ type: 'danger', message: msg });
    },
  });

  const { mutate: requestSessionSetupIntent, isPending: loadingIntent } =
    useCustomMutation({
      mutationFn: createSessionSetupIntent,
      onSuccess: data => {
        const secret = data?.client_secret;
        if (secret) {
          setClientSecret(secret);
          setModalVisible(true);
        } else {
          showMessage({
            type: 'danger',
            message: data?.message || 'Unable to start payment. Please try again.',
          });
        }
      },
      onError: err => {
        const msg =
          err?.data?.message || 'Error while starting payment.';
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.LONG);
        } else {
          Alert.alert('Payment Status', msg);
        }
      },
    });

  const startPurchase = type => {
    setBundleType(type);
    requestSessionSetupIntent();
  };

  const handleConfirmPayment = async () => {
    if (!clientSecret || !bundleType) return;
    if (!cardDetails?.complete) {
      Alert.alert('Please enter complete card details');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const { setupIntent, error } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment Failed', error.message);
      } else if (setupIntent?.paymentMethodId) {
        setModalVisible(false);
        completePurchase({
          bundle_type: bundleType,
          payment_method: setupIntent.paymentMethodId,
        });
      }
    } catch {
      Alert.alert('Error', 'Something went wrong during payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const canBook = sessions?.canBookSession !== false;
  const loading = loadingSessions || loadingPurchase;
  const paying = loadingIntent || isProcessingPayment || purchasing;
  const payOverlay =
    loadingIntent || purchasing || (isProcessingPayment && !modalVisible);

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Coaching"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <AppLoader />
        ) : (
          <>
            {sessionsError ? (
              <TouchableOpacity onPress={refetchSessions}>
                <Typography color={COLORS.primary} fFamily="barlowSemiBold600" mB={12}>
                  Could not load session balance. Tap to retry.
                </Typography>
              </TouchableOpacity>
            ) : null}

            <View style={styles.statsRow}>
              {stats.map(stat => (
                <View key={stat.label} style={[GLOBALSTYLE.screenCard, styles.statCard]}>
                  <View style={styles.statIcon}>
                    <Icon
                      name={stat.icon}
                      iconFamily="Ionicons"
                      size={18}
                      color={COLORS.primary}
                    />
                  </View>
                  <Typography
                    fFamily="barlowBold700"
                    size={TYPE.h2.size}
                    color={COLORS.textPrimary}
                    mT={8}
                  >
                    {stat.value}
                  </Typography>
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                    {stat.label}
                  </Typography>
                </View>
              ))}
            </View>

            {sessions?.hasReachedLimit ? (
              <Typography size={13} color={COLORS.destructive} mT={12}>
                You’ve reached your booking limit for this period.
              </Typography>
            ) : null}

            <TouchableOpacity
              style={[styles.bookBtn, !canBook && styles.bookBtnDisabled]}
              activeOpacity={0.88}
              disabled={!canBook}
              onPress={() =>
                navigateFromTabToStack(navigation, 'AnalyticsScheduleScreen', {
                  tab: 'book',
                })
              }
            >
              <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.white100}>
                {canBook ? 'Book Session' : 'Booking Unavailable'}
              </Typography>
            </TouchableOpacity>

            <Typography
              fFamily={TYPE.h2.fFamily}
              size={TYPE.h2.size}
              color={COLORS.textPrimary}
              mT={SPACING.section}
              mB={SPACING.component}
            >
              Buy Sessions
            </Typography>

            {purchaseError ? (
              <TouchableOpacity onPress={refetchPurchase}>
                <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
                  Could not load packages. Tap to retry.
                </Typography>
              </TouchableOpacity>
            ) : (
              <View style={styles.packages}>
                {packages.map(pkg => (
                  <View key={pkg.bundleType} style={[GLOBALSTYLE.screenCard, styles.packageCard]}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Typography
                        fFamily="barlowSemiBold600"
                        size={TYPE.body.size}
                        color={COLORS.textPrimary}
                      >
                        {pkg.title}
                      </Typography>
                      <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                        {pkg.desc}
                      </Typography>
                    </View>
                    <TouchableOpacity
                      style={styles.priceBtn}
                      activeOpacity={0.88}
                      disabled={paying}
                      onPress={() => startPurchase(pkg.bundleType)}
                    >
                      {loadingIntent && bundleType === pkg.bundleType ? (
                        <AppLoader compact size="small" color={COLORS.white100} />
                      ) : (
                        <Typography
                          fFamily="barlowSemiBold600"
                          size={TYPE.body.size}
                          color={COLORS.white100}
                        >
                          {pkg.priceLabel}
                        </Typography>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => !paying && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, keyboardOpen && styles.modalCardKeyboard]}>
            <Typography fFamily="barlowBold700" size={20} color={COLORS.textPrimary} mB={8}>
              Pay for sessions
            </Typography>
            <Typography size={13} color={COLORS.textSecondary} mB={16}>
              Securely complete your purchase using Stripe
            </Typography>
            <CardField
              postalCodeEnabled={false}
              style={styles.cardField}
              onCardChange={setCardDetails}
            />
            <Button
              label="Confirm payment"
              onPress={handleConfirmPayment}
              disabled={paying}
              btnStyle={{ width: '100%', marginTop: Sizer.vSize(16) }}
            />
            <TouchableOpacity
              style={styles.cancelPay}
              disabled={paying}
              onPress={() => {
                setModalVisible(false);
                setClientSecret(null);
                setBundleType(null);
              }}
            >
              <Typography color={COLORS.textSecondary} fFamily="barlowSemiBold600">
                Cancel
              </Typography>
            </TouchableOpacity>
          </View>

          {isProcessingPayment ? (
            <View style={styles.sheetLoader} pointerEvents="auto">
              <View style={styles.sheetLoaderCard}>
                <AppLoader compact size="large" color={COLORS.primary} />
              </View>
            </View>
          ) : null}
        </View>
      </Modal>

      <ScreenOverlayLoader visible={payOverlay} />
    </Container>
  );
};

export default CoachingScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  statsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(SPACING.component),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  statIcon: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(SPACING.section),
  },
  bookBtnDisabled: {
    opacity: 0.5,
  },
  packages: {
    gap: Sizer.vSize(SPACING.component),
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  priceBtn: {
    minWidth: Sizer.hSize(88),
    height: Sizer.vSize(40),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.mainBg,
    borderTopLeftRadius: Sizer.hSize(20),
    borderTopRightRadius: Sizer.hSize(20),
    padding: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(40),
  },
  modalCardKeyboard: {
    paddingBottom: Sizer.vSize(16),
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 8,
  },
  cancelPay: {
    alignItems: 'center',
    marginTop: Sizer.vSize(16),
    padding: Sizer.vSize(8),
  },
  sheetLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetLoaderCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
});
