import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { CommonActions } from '@react-navigation/native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { Button } from '../../../components';
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
  fetchPaymentIntent,
  getPackages,
  handlePaymentSuccess,
} from '../../../api/packageService';
import { queryClient } from '../../../api/api';
import { formatExpiryDate, showMessage } from '../../../utils';
import { setUser } from '../../../redux/slices/appSlice';
import { useKeyboard } from '../../../hooks/useKeyboard';

/** Web `MembershipPlan.tsx` feature lists when API HTML is empty */
const WEB_FEATURES = {
  classic: [
    'Classic Workbook access',
    'Community forum',
    'Basic analytics',
    '5 training videos/month',
    'Score tracking',
  ],
  pro: [
    'All Classic features',
    'Pro Workbook access',
    'Advanced analytics',
    'Unlimited training videos',
    'Priority coaching booking',
    'Tournament entry included',
    'Shop discounts (10%)',
  ],
};

const parseFeatures = (html, planTitle = '') => {
  if (html) {
    const items = [];
    const liRegex = /<li[^>]*>(.*?)<\/li>/gis;
    let match = liRegex.exec(html);
    while (match) {
      const text = match[1].replace(/<[^>]+>/g, '').trim();
      if (text) items.push(text);
      match = liRegex.exec(html);
    }
    if (items.length) return items;
    const plain = html.replace(/<[^>]+>/g, '\n').split('\n').map(s => s.trim()).filter(Boolean);
    if (plain.length) return plain;
  }
  const key = String(planTitle).toLowerCase();
  if (key.includes('pro')) return WEB_FEATURES.pro;
  if (key.includes('classic')) return WEB_FEATURES.classic;
  return WEB_FEATURES.pro;
};

const formatPlanPrice = price => {
  const n = parseFloat(price);
  if (Number.isNaN(n)) return String(price ?? '');
  return `$${n.toFixed(2)}`;
};

const formatPeriod = duration => {
  if (!duration) return '/month';
  const d = String(duration).toLowerCase();
  if (d.includes('month')) return '/month';
  if (d.includes('year')) return '/year';
  return `/${duration}`;
};

/**
 * ClayMaster-App-UI `MembershipPlan.tsx` — Stripe/payment API unchanged.
 */
const SubscriptionScreen = ({ navigation, route }) => {
  const canGoBack = navigation.canGoBack?.() ?? false;
  const { user } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const { confirmSetupIntent } = useStripe();
  const { keyboardOpen } = useKeyboard();

  const { data: packagesData = [] } = useCustomQuery({
    queryKey: ['packages'],
    queryFn: getPackages,
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const currentPackage = packagesData.find(pkg => pkg.id == user?.package_id);
  const isActive = user?.subscription_status === 'active';

  useEffect(() => {
    if (packagesData.length && !selectedPlan) {
      const userPkg = packagesData.find(p => p.id == user?.package_id);
      setSelectedPlan(userPkg || packagesData[0]);
    }
  }, [packagesData, user?.package_id, selectedPlan]);

  const { mutate: handlePaySuccess, isPending: isLoadingPaymentSuccess } =
    useCustomMutation({
      mutationFn: handlePaymentSuccess,
      onSuccess: ({ data }) => {
        if (data?.success) {
          dispatch(
            setUser({
              ...user,
              package_id: selectedPlan?.id,
              subscription_status: 'active',
              package_expires_at:
                data?.package_expires_at || user?.package_expires_at,
            }),
          );
          showMessage({
            message: 'Payment Successfull!',
            type: 'success',
            bgColor: COLORS.primary,
          });
          navigation.replace('SubscribtionSuccessScreen');
        } else {
          showMessage({ message: 'Payment Failed!', type: 'danger' });
        }
      },
    });

  const { mutate: requestPaymentIntent, isPending: isLoadingPaymentIntent } =
    useCustomMutation({
      mutationFn: fetchPaymentIntent,
      onSuccess: async ({ data }) => {
        const secret = data?.client_secret;
        if (secret) {
          setClientSecret(secret);
          setModalVisible(true);
        }
      },
      onError: () => {
        const msg = 'Error While Payment Proceeding.';
        if (Platform.OS === 'android') {
          ToastAndroid.show(msg, ToastAndroid.LONG);
        } else {
          Alert.alert('Payment Status', msg);
        }
      },
    });

  const isCurrentPlan = plan =>
    isActive && plan?.id != null && plan.id == user?.package_id;

  const planActionLabel = plan => {
    if (isCurrentPlan(plan)) return 'Current Plan';
    return `Switch to ${plan?.title || 'Plan'}`;
  };

  const startCheckout = plan => {
    setSelectedPlan(plan);
    requestPaymentIntent();
  };

  const handleConfirmPayment = async () => {
    if (!clientSecret) return;
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
      } else if (setupIntent) {
        setModalVisible(false);
        handlePaySuccess({
          payment_method: setupIntent.paymentMethodId,
          package_id: selectedPlan?.id,
        });
      }
    } catch {
      Alert.alert('Error', 'Something went wrong during payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const bannerTitle = currentPackage?.title
    ? `${currentPackage.title} Member`
    : 'Pro Member';
  const renewLabel = user?.package_expires_at
    ? `Renews on ${formatExpiryDate(user.package_expires_at)}`
    : 'Renews on May 1, 2026';

  const sortedPlans = [...packagesData].sort(
    (a, b) => parseFloat(a?.price || 0) - parseFloat(b?.price || 0),
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Membership Plan"
        showBack={canGoBack}
        showNotification={false}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.currentBanner}>
          <Typography
            size={TYPE.body.size}
            color={COLORS.white100}
            style={styles.bannerMuted}
          >
            Your current plan
          </Typography>
          <Typography
            fFamily="barlowBold700"
            size={TYPE.h1.size}
            color={COLORS.white100}
            mT={4}
          >
            {bannerTitle}
          </Typography>
          <Typography
            size={TYPE.caption.size}
            color={COLORS.white100}
            mT={4}
            style={styles.bannerCaption}
          >
            {renewLabel}
          </Typography>
        </View>

        <View style={styles.plansList}>
          {sortedPlans.map(plan => {
            const current = isCurrentPlan(plan);
            const features = parseFeatures(plan?.description, plan?.title);
            const loading =
              isLoadingPaymentIntent || isLoadingPaymentSuccess;

            return (
              <View
                key={plan.id}
                style={[
                  GLOBALSTYLE.screenCard,
                  styles.planCard,
                  current ? styles.planCardCurrent : styles.planCardDefault,
                ]}
              >
                {current ? (
                  <View style={styles.currentBadge}>
                    <Icon
                      name="star"
                      iconFamily="Ionicons"
                      size={12}
                      color={COLORS.white100}
                    />
                    <Typography
                      size={TYPE.caption.size}
                      color={COLORS.white100}
                      fFamily="barlowSemiBold600"
                      mL={4}
                    >
                      Current
                    </Typography>
                  </View>
                ) : null}

                <View style={[styles.planHeader, current && styles.planHeaderBadge]}>
                  <Typography
                    fFamily={TYPE.h2.fFamily}
                    size={TYPE.h2.size}
                    color={COLORS.textPrimary}
                  >
                    {plan.title}
                  </Typography>
                  <View style={styles.priceRow}>
                    <Typography
                      fFamily="barlowBold700"
                      size={TYPE.h1.size}
                      color={COLORS.primary}
                    >
                      {formatPlanPrice(plan.price)}
                    </Typography>
                    <Typography
                      size={TYPE.caption.size}
                      color={COLORS.textSecondary}
                      mL={4}
                    >
                      {formatPeriod(plan.duration)}
                    </Typography>
                  </View>
                </View>

                <View style={styles.features}>
                  {features.map(feature => (
                    <View key={feature} style={styles.featureRow}>
                      <Icon
                        name="checkmark"
                        iconFamily="Ionicons"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Typography
                        size={TYPE.body.size}
                        color={COLORS.textPrimary}
                        style={styles.featureText}
                      >
                        {feature}
                      </Typography>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.planBtn,
                    current ? styles.planBtnCurrent : styles.planBtnSwitch,
                  ]}
                  activeOpacity={0.88}
                  disabled={current || loading}
                  onPress={() => startCheckout(plan)}
                >
                  {loading && selectedPlan?.id === plan.id ? (
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={TYPE.body.size}
                      color={current ? COLORS.textSecondary : COLORS.white100}
                    >
                      Processing...
                    </Typography>
                  ) : (
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={TYPE.body.size}
                      color={current ? COLORS.textSecondary : COLORS.white100}
                    >
                      {planActionLabel(plan)}
                    </Typography>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.cancelLink} activeOpacity={0.88}>
          <Typography
            size={TYPE.caption.size}
            color={COLORS.destructive}
            fFamily="barlowMedium500"
          >
            Cancel Subscription
          </Typography>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOuter}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View
            style={[
              styles.modalSheet,
              keyboardOpen && { marginBottom: Sizer.vSize(20) },
            ]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Typography
                size={TYPE.h3.size}
                fFamily="barlowBold700"
                color={COLORS.textPrimary}
              >
                Payment details
              </Typography>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={12}
              >
                <View style={styles.closeBtn}>
                  <Icon
                    name="close"
                    iconFamily="Ionicons"
                    size={20}
                    color={COLORS.textPrimary}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary} mB={24}>
              Securely complete your subscription using Stripe
            </Typography>
            <View style={styles.cardFieldWrap}>
              <CardField
                postalCodeEnabled={false}
                placeholders={{ number: '4242 4242 4242 4242' }}
                cardStyle={{
                  backgroundColor: COLORS.surfaceMuted,
                  textColor: COLORS.textPrimary,
                  placeholderColor: COLORS.textMuted,
                  cursorColor: COLORS.primary,
                }}
                style={{ width: '100%', height: 50 }}
                onCardChange={setCardDetails}
              />
            </View>
            <Button
              label="Pay now"
              onPress={handleConfirmPayment}
              loader={isProcessingPayment}
              btnStyle={{ width: '100%' }}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.section),
  },
  currentBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    alignItems: 'center',
  },
  bannerMuted: { opacity: 0.8 },
  bannerCaption: { opacity: 0.7 },
  plansList: {
    gap: Sizer.vSize(SPACING.component),
  },
  planCard: {
    padding: Sizer.hSize(SPACING.cardP),
    position: 'relative',
    overflow: 'visible',
    ...SHADOWS.card,
  },
  planCardDefault: {
    borderWidth: 2,
    borderColor: COLORS.borderMuted,
  },
  planCardCurrent: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  currentBadge: {
    position: 'absolute',
    top: -Sizer.vSize(12),
    left: Sizer.hSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(999),
    zIndex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(16),
  },
  planHeaderBadge: {
    marginTop: Sizer.vSize(4),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  features: {
    gap: Sizer.vSize(10),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(10),
  },
  featureText: {
    flex: 1,
  },
  planBtn: {
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(16),
  },
  planBtnCurrent: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.surface,
  },
  planBtnSwitch: {
    backgroundColor: COLORS.primary,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: Sizer.vSize(8),
  },
  modalOuter: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: Sizer.hSize(24),
    borderTopRightRadius: Sizer.hSize(24),
    paddingHorizontal: Sizer.hSize(24),
    paddingTop: Sizer.vSize(12),
    paddingBottom: Sizer.vSize(48),
  },
  modalHandle: {
    width: Sizer.hSize(40),
    height: Sizer.vSize(4),
    backgroundColor: COLORS.borderMuted,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Sizer.vSize(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizer.vSize(4),
  },
  closeBtn: {
    width: Sizer.hSize(34),
    height: Sizer.hSize(34),
    borderRadius: 17,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFieldWrap: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(4),
    marginBottom: Sizer.vSize(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    overflow: 'hidden',
  },
});
