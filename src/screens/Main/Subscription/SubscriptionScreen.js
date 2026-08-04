import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
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
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { Button, ConfirmModal } from '../../../components';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
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
import { getProfile } from '../../../api/userService';
import { formatExpiryDate, showMessage } from '../../../utils';
import { setUser } from '../../../redux/slices/appSlice';
import { useKeyboard } from '../../../hooks/useKeyboard';
import { performLogout } from '../../../navigation/navigationHelpers';

const SCREEN_W = Dimensions.get('window').width;
const PLAN_GAP = Sizer.hSize(14);
const PLAN_SIDE = Sizer.hSize(SPACING.screenPx);
/** Wider card, light peek of next plan */
const PLAN_CARD_W = SCREEN_W - PLAN_SIDE * 2 - Sizer.hSize(20);
const PLAN_SNAP = PLAN_CARD_W + PLAN_GAP;
const PLAN_INNER_W = PLAN_CARD_W - Sizer.hSize(36);

const decodeHtmlEntities = text =>
  String(text || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

const capitalizeFeature = text => {
  const t = decodeHtmlEntities(text);
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Parse feature bullets from package description / front_description HTML */
const parseFeatures = html => {
  if (!html) return [];

  const items = [];
  const liRegex = /<li[^>]*>(.*?)<\/li>/gis;
  let match = liRegex.exec(html);
  while (match) {
    const text = capitalizeFeature(match[1].replace(/<[^>]+>/g, ''));
    if (text) items.push(text);
    match = liRegex.exec(html);
  }
  if (items.length) return items;

  let plain = String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '\n');

  let lines = plain
    .split(/\n+/)
    .map(capitalizeFeature)
    .filter(Boolean);

  // If API returns one long blob, split after closing parens before next feature
  if (lines.length === 1 && lines[0].length > 90) {
    lines = lines[0]
      .split(/(?<=\))\s+(?=[a-zA-Z$])/g)
      .map(capitalizeFeature)
      .filter(Boolean);
  }

  return lines;
};

const formatPlanPrice = price => {
  const n = parseFloat(price);
  if (Number.isNaN(n)) return String(price ?? '');
  return `$${n.toFixed(2)}`;
};

const formatPeriod = duration => {
  if (!duration) return '';
  const d = String(duration).toLowerCase();
  if (d.includes('month')) return '/month';
  if (d.includes('year')) return '/year';
  return `/${duration}`;
};

const formatRenewLabel = expiryString => {
  if (!expiryString) return 'Active subscription';
  const label = formatExpiryDate(expiryString);
  if (!label || label === 'Invalid date') return 'Active subscription';
  if (/left$/i.test(label)) {
    return label.replace(/left$/i, 'remaining').trim();
  }
  return `Renews on ${label}`;
};

const PlanFeaturesList = ({ features }) => {
  if (!features.length) {
    return (
      <Typography size={13} color={COLORS.textSecondary}>
        Plan details coming soon.
      </Typography>
    );
  }
  return (
    <View style={styles.featuresContent}>
      {features.map((feature, index) => (
        <View key={`f-${index}`} style={styles.featureRow}>
          <View style={styles.checkCircle}>
            <Icon
              name="checkmark"
              iconFamily="Ionicons"
              size={12}
              color={COLORS.primary}
            />
          </View>
          <Typography
            size={13}
            lineHeight={18}
            color={COLORS.textPrimary}
            style={styles.featureText}
          >
            {feature}
          </Typography>
        </View>
      ))}
    </View>
  );
};

const PlanCard = ({
  plan,
  current,
  isPopular,
  loading,
  selected,
  onPress,
  actionLabel,
  featuresHeight,
}) => {
  const features = useMemo(
    () => parseFeatures(plan?.description || plan?.front_description),
    [plan?.description, plan?.front_description],
  );

  return (
    <View
      style={[
        styles.planCard,
        current ? styles.planCardCurrent : styles.planCardDefault,
        selected && styles.planCardFocused,
      ]}
    >
      <View style={styles.planTop}>
        <View style={styles.planTitleRow}>
          <Typography
            fFamily="barlowBold700"
            size={22}
            color={COLORS.textPrimary}
            numberOfLines={1}
            style={styles.planTitle}
          >
            {plan.title}
          </Typography>
          {current ? (
            <View style={styles.inlineBadge}>
              <Icon
                name="checkmark-circle"
                iconFamily="Ionicons"
                size={12}
                color={COLORS.white100}
              />
              <Typography
                size={10}
                color={COLORS.white100}
                fFamily="barlowBold700"
                mL={4}
              >
                CURRENT
              </Typography>
            </View>
          ) : isPopular ? (
            <View style={[styles.inlineBadge, styles.inlineBadgePopular]}>
              <Typography
                size={10}
                color={COLORS.white100}
                fFamily="barlowBold700"
              >
                POPULAR
              </Typography>
            </View>
          ) : null}
        </View>

        <View style={styles.priceBlock}>
          <Typography
            fFamily="barlowBold700"
            size={34}
            lineHeight={38}
            color={COLORS.primary}
          >
            {formatPlanPrice(plan.price)}
          </Typography>
          <Typography
            size={14}
            color={COLORS.textSecondary}
            fFamily="barlowMedium500"
            mL={6}
            style={styles.periodLabel}
          >
            {formatPeriod(plan.duration)}
          </Typography>
        </View>
      </View>

      <View style={styles.divider} />

      <Typography
        size={11}
        color={COLORS.textSecondary}
        fFamily="barlowBold700"
        style={styles.includesLabel}
        mB={8}
      >
        WHAT'S INCLUDED
      </Typography>

      <View
        style={[
          styles.featuresArea,
          featuresHeight != null ? { height: featuresHeight } : null,
        ]}
      >
        <ScrollView
          style={styles.featuresScroll}
          contentContainerStyle={styles.featuresScrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          bounces={false}
        >
          <PlanFeaturesList features={features} />
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[
          styles.planBtn,
          current ? styles.planBtnCurrent : styles.planBtnSwitch,
        ]}
        activeOpacity={0.88}
        disabled={current || loading}
        onPress={onPress}
      >
        {loading ? (
          <ActivityIndicator
            color={current ? COLORS.textSecondary : COLORS.white100}
          />
        ) : (
          <Typography
            fFamily="barlowBold700"
            size={15}
            color={current ? COLORS.textSecondary : COLORS.white100}
            numberOfLines={1}
          >
            {actionLabel}
          </Typography>
        )}
      </TouchableOpacity>
    </View>
  );
};

/**
 * ClayMaster-App-UI `MembershipPlan.tsx` — Stripe/payment API unchanged.
 */
const SubscriptionScreen = ({ navigation, route }) => {
  const fromAuth = Boolean(route?.params?.fromAuth);
  const canGoBack = !fromAuth && (navigation.canGoBack?.() ?? false);
  const { user } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const { confirmSetupIntent } = useStripe();
  const { keyboardOpen } = useKeyboard();
  const plansListRef = useRef(null);
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  /** Measured natural height of each plan's feature list — keyed by plan id */
  const [featureHeights, setFeatureHeights] = useState({});

  const {
    data: packagesData = [],
    isLoading: isLoadingPackages,
    isError: isPackagesError,
    refetch: refetchPackages,
  } = useCustomQuery({
    queryKey: ['packages'],
    queryFn: getPackages,
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const currentPackage = packagesData.find(pkg => pkg.id == user?.package_id);
  const isActive = user?.subscription_status === 'active';

  const sortedPlans = useMemo(
    () =>
      [...packagesData].sort(
        (a, b) => parseFloat(a?.price || 0) - parseFloat(b?.price || 0),
      ),
    [packagesData],
  );

  const plansWithFeatures = useMemo(
    () =>
      sortedPlans.map(plan => ({
        plan,
        features: parseFeatures(
          plan?.description || plan?.front_description,
        ),
      })),
    [sortedPlans],
  );

  /** Tallest description block — applied to every plan for equal card heights */
  const maxFeaturesHeight = useMemo(() => {
    if (!sortedPlans.length) return null;
    const measured = sortedPlans
      .map(p => featureHeights[String(p.id)])
      .filter(h => typeof h === 'number' && h > 0);
    if (measured.length < sortedPlans.length) return null;
    return Math.ceil(Math.max(...measured));
  }, [featureHeights, sortedPlans]);

  const onMeasureFeatures = useCallback((planId, height) => {
    if (!planId || !(height > 0)) return;
    const key = String(planId);
    setFeatureHeights(prev => {
      if (prev[key] === height) return prev;
      // Keep the larger measurement if re-layout reports slightly different values
      if (typeof prev[key] === 'number' && prev[key] >= height) return prev;
      return { ...prev, [key]: height };
    });
  }, []);

  useEffect(() => {
    setFeatureHeights({});
  }, [sortedPlans]);

  useEffect(() => {
    if (!sortedPlans.length || selectedPlan) return;
    const userPkg = sortedPlans.find(p => p.id == user?.package_id);
    const popular = sortedPlans.find(p => p.is_popular);
    const initial = userPkg || popular || sortedPlans[0];
    const idx = Math.max(
      0,
      sortedPlans.findIndex(p => p.id === initial?.id),
    );
    setSelectedPlan(initial);
    setActivePlanIndex(idx);
    const t = setTimeout(() => {
      plansListRef.current?.scrollToIndex({
        index: idx,
        animated: false,
      });
    }, 80);
    return () => clearTimeout(t);
  }, [sortedPlans, user?.package_id, selectedPlan]);

  const { mutate: handlePaySuccess, isPending: isLoadingPaymentSuccess } =
    useCustomMutation({
      mutationFn: handlePaymentSuccess,
      onSuccess: async data => {
        if (data?.success) {
          let nextUser = {
            ...user,
            package_id: String(data?.package_id ?? selectedPlan?.id ?? ''),
            subscription_status: data?.subscription_status || 'active',
            package_expires_at:
              data?.package_expires_at || user?.package_expires_at,
            remaining_sessions:
              data?.remaining_sessions ?? user?.remaining_sessions,
            remaining_service_sessions:
              data?.remaining_service_sessions ??
              user?.remaining_service_sessions,
            discount_type: data?.discount_type ?? user?.discount_type,
          };

          try {
            const profile = await getProfile();
            if (profile?.status && profile?.user) {
              nextUser = { ...nextUser, ...profile.user };
            }
          } catch {
            /* keep subscribe response fields */
          }

          dispatch(setUser(nextUser));
          showMessage({
            message: 'Payment Successful!',
            type: 'success',
            bgColor: COLORS.primary,
          });
          setClientSecret(null);
          navigation.replace('SubscribtionSuccessScreen', {
            fromAuth,
          });
        } else {
          showMessage({ message: 'Payment Failed!', type: 'danger' });
        }
      },
      onError: () => {
        showMessage({ message: 'Payment Failed!', type: 'danger' });
      },
    });

  const { mutate: requestPaymentIntent, isPending: isLoadingPaymentIntent } =
    useCustomMutation({
      mutationFn: fetchPaymentIntent,
      onSuccess: data => {
        const secret = data?.client_secret;
        if (secret) {
          setClientSecret(secret);
          setModalVisible(true);
        } else {
          showMessage({
            message: 'Unable to start payment. Please try again.',
            type: 'danger',
          });
        }
      },
      onError: () => {
        const msg = 'Error while starting payment.';
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
    if (!isActive) return `Get ${plan?.title || 'Plan'}`;
    return `Switch to ${plan?.title || 'Plan'}`;
  };

  const startCheckout = plan => {
    setSelectedPlan(plan);
    requestPaymentIntent();
  };

  const onPlanMomentumEnd = useCallback(
    e => {
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / PLAN_SNAP);
      const clamped = Math.max(0, Math.min(index, sortedPlans.length - 1));
      setActivePlanIndex(clamped);
      const plan = sortedPlans[clamped];
      if (plan) setSelectedPlan(plan);
    },
    [sortedPlans],
  );

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

  const bannerTitle = isActive
    ? currentPackage?.title
      ? `${currentPackage.title} Member`
      : 'Member'
    : 'No active plan';
  const renewLabel = isActive
    ? formatRenewLabel(user?.package_expires_at)
    : 'Choose a plan to get started';

  const checkoutLoading = isLoadingPaymentIntent || isLoadingPaymentSuccess;

  const renderPlan = useCallback(
    ({ item: plan, index }) => {
      const current = isCurrentPlan(plan);
      return (
        <View
          style={[
            styles.planSlide,
            index === sortedPlans.length - 1 && styles.planSlideLast,
          ]}
        >
          <PlanCard
            plan={plan}
            current={current}
            isPopular={Boolean(plan?.is_popular)}
            loading={checkoutLoading && selectedPlan?.id === plan.id}
            selected={activePlanIndex === index}
            actionLabel={planActionLabel(plan)}
            onPress={() => startCheckout(plan)}
            featuresHeight={maxFeaturesHeight}
          />
        </View>
      );
    },
    [
      activePlanIndex,
      checkoutLoading,
      selectedPlan?.id,
      sortedPlans.length,
      isActive,
      user?.package_id,
      maxFeaturesHeight,
    ],
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Membership Plan"
        showBack={canGoBack}
        showNotification={false}
        onBack={() => navigation.goBack()}
        rightSlot={
          fromAuth ? (
            <TouchableOpacity
              onPress={() => setLogoutVisible(true)}
              hitSlop={12}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.body.size}
                color={COLORS.primary}
              >
                Logout
              </Typography>
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        nestedScrollEnabled
      >
        <View style={styles.currentBanner}>
          <View style={styles.bannerGlow} />
          <Typography
            size={12}
            color={COLORS.white100}
            fFamily="barlowBold700"
            style={styles.bannerEyebrow}
          >
            YOUR CURRENT PLAN
          </Typography>
          <Typography
            fFamily="barlowBold700"
            size={28}
            lineHeight={32}
            color={COLORS.white100}
            mT={6}
            textAlign="center"
          >
            {bannerTitle}
          </Typography>
          <View style={styles.bannerMetaPill}>
            <Icon
              name={isActive ? 'time-outline' : 'sparkles-outline'}
              iconFamily="Ionicons"
              size={14}
              color={COLORS.white100}
            />
            <Typography
              size={12}
              color={COLORS.white100}
              fFamily="barlowMedium500"
              mL={6}
            >
              {renewLabel}
            </Typography>
          </View>
        </View>

        {isLoadingPackages ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={COLORS.primary} size="large" />
            <Typography
              size={TYPE.body.size}
              color={COLORS.textSecondary}
              mT={12}
            >
              Loading plans...
            </Typography>
          </View>
        ) : null}

        {isPackagesError ? (
          <View style={styles.centerState}>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
              Could not load membership plans.
            </Typography>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => refetchPackages()}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.body.size}
                color={COLORS.primary}
              >
                Retry
              </Typography>
            </TouchableOpacity>
          </View>
        ) : null}

        {!isLoadingPackages && !isPackagesError && sortedPlans.length === 0 ? (
          <View style={styles.centerState}>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
              No plans available right now.
            </Typography>
          </View>
        ) : null}

        {sortedPlans.length > 0 ? (
          <View style={styles.plansSection}>
            {/* Off-screen measure pass — natural height of every plan description */}
            <View style={styles.measureLayer} pointerEvents="none">
              {plansWithFeatures.map(({ plan, features }) => (
                <View
                  key={`measure-${plan.id}`}
                  style={styles.measureItem}
                  onLayout={e =>
                    onMeasureFeatures(plan.id, e.nativeEvent.layout.height)
                  }
                >
                  <PlanFeaturesList features={features} />
                </View>
              ))}
            </View>

            <View style={styles.plansHeaderRow}>
              <View>
                <Typography
                  fFamily="barlowBold700"
                  size={18}
                  color={COLORS.textPrimary}
                >
                  Choose a plan
                </Typography>
                <Typography size={12} color={COLORS.textSecondary} mT={2}>
                  Swipe to compare · {sortedPlans.length} options
                </Typography>
              </View>
            </View>

            <FlatList
              ref={plansListRef}
              data={sortedPlans}
              keyExtractor={item => String(item.id)}
              renderItem={renderPlan}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={PLAN_SNAP}
              snapToAlignment="start"
              disableIntervalMomentum
              bounces
              overScrollMode="never"
              nestedScrollEnabled
              contentContainerStyle={styles.plansCarousel}
              getItemLayout={(_, index) => ({
                length: PLAN_SNAP,
                offset: PLAN_SNAP * index,
                index,
              })}
              onMomentumScrollEnd={onPlanMomentumEnd}
              onScrollToIndexFailed={info => {
                setTimeout(() => {
                  plansListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: false,
                  });
                }, 80);
              }}
            />

            {sortedPlans.length > 1 ? (
              <View style={styles.dotsRow}>
                {sortedPlans.map((plan, index) => (
                  <View
                    key={String(plan.id)}
                    style={[
                      styles.dot,
                      index === activePlanIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {isActive ? (
          <TouchableOpacity
            style={styles.cancelLink}
            activeOpacity={0.88}
            onPress={() =>
              Alert.alert(
                'Cancel Subscription',
                'To cancel your subscription, please contact support at support@claymaster.net.',
              )
            }
          >
            <Typography
              size={TYPE.caption.size}
              color={COLORS.destructive}
              fFamily="barlowMedium500"
            >
              Cancel Subscription
            </Typography>
          </TouchableOpacity>
        ) : null}
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

      <ConfirmModal
        visible={logoutVisible}
        setVisibility={setLogoutVisible}
        title="Log out?"
        confirmText="Log out"
        cancelText="Cancel"
        handleComplete={() => performLogout(navigation, dispatch)}
      />
    </Container>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.section),
  },
  currentBanner: {
    marginHorizontal: PLAN_SIDE,
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(22),
    paddingHorizontal: Sizer.hSize(20),
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  bannerGlow: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bannerEyebrow: {
    letterSpacing: 1.2,
    opacity: 0.85,
  },
  bannerMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(12),
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(999),
  },
  plansSection: {
    marginTop: Sizer.vSize(4),
  },
  measureLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0,
    zIndex: -1,
  },
  measureItem: {
    width: PLAN_INNER_W,
  },
  plansHeaderRow: {
    paddingHorizontal: PLAN_SIDE,
    marginBottom: Sizer.vSize(10),
  },
  plansCarousel: {
    paddingHorizontal: PLAN_SIDE,
    paddingTop: Sizer.vSize(4),
    paddingBottom: Sizer.vSize(4),
  },
  planSlide: {
    width: PLAN_CARD_W,
    marginRight: PLAN_GAP,
  },
  planSlideLast: {
    marginRight: 0,
  },
  planCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(16),
    padding: Sizer.hSize(18),
    borderWidth: 1.5,
    ...SHADOWS.card,
  },
  planCardDefault: {
    borderColor: COLORS.borderMuted,
  },
  planCardCurrent: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  planCardFocused: {
    borderColor: 'rgba(235, 108, 15, 0.55)',
  },
  planTop: {
    marginBottom: Sizer.vSize(4),
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Sizer.hSize(8),
  },
  planTitle: {
    flex: 1,
  },
  inlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(999),
  },
  inlineBadgePopular: {
    backgroundColor: COLORS.textPrimary,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: Sizer.vSize(10),
  },
  periodLabel: {
    marginBottom: Sizer.vSize(4),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.borderMuted,
    marginVertical: Sizer.vSize(12),
  },
  includesLabel: {
    letterSpacing: 1,
  },
  featuresArea: {
    minHeight: Sizer.vSize(80),
  },
  featuresScroll: {
    flexGrow: 0,
  },
  featuresScrollContent: {
    flexGrow: 1,
  },
  featuresContent: {
    gap: Sizer.vSize(8),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(10),
  },
  checkCircle: {
    width: Sizer.hSize(20),
    height: Sizer.hSize(20),
    borderRadius: Sizer.hSize(10),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  featureText: {
    flex: 1,
  },
  planBtn: {
    height: Sizer.vSize(50),
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(10),
    paddingHorizontal: Sizer.hSize(8),
  },
  planBtnCurrent: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.surfaceMuted,
  },
  planBtnSwitch: {
    backgroundColor: COLORS.primary,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizer.hSize(6),
    marginTop: Sizer.vSize(16),
  },
  dot: {
    width: Sizer.hSize(7),
    height: Sizer.hSize(7),
    borderRadius: Sizer.hSize(4),
    backgroundColor: COLORS.borderMuted,
  },
  dotActive: {
    width: Sizer.hSize(20),
    backgroundColor: COLORS.primary,
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: Sizer.vSize(8),
    marginHorizontal: PLAN_SIDE,
  },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizer.vSize(24),
    paddingHorizontal: PLAN_SIDE,
  },
  retryBtn: {
    marginTop: Sizer.vSize(12),
    paddingHorizontal: Sizer.hSize(16),
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
