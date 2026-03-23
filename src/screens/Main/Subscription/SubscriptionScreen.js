import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
//-----
import { Typography, Flex, Container } from '../../../atomComponents';
import {
  BASEOPACITY,
  COLORS,
  FONTS,
  GLOBALSTYLE,
  SHADOWS,
  WINDOW,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { subbg } from '../../../assets/images';
import { Button, Header, ScreenBanner } from '../../../components';
import Icon from '../../../helpers/Icon';
import { SeperatorSvg, SubscribeTickSvg } from '../../../assets/svgs';
import { useCustomQuery } from '../../../query/useCustomQuery';
import {
  fetchPaymentIntent,
  getPackages,
  handlePaymentSuccess,
} from '../../../api/packageService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { formatExpiryDate, showMessage } from '../../../utils';
import { handleLogout, setUser } from '../../../redux/slices/appSlice';
import { logout } from '../../../api/userService';
import { queryClient } from '../../../api/api';
import { CommonActions } from '@react-navigation/native';
import { useKeyboard } from '../../../hooks/useKeyboard';

const PlanCard = ({ plan, onSelect, isSelected, maxHeight, onMeasure }) => {
  const { user } = useSelector(state => state.app);

  const handleLayout = e => {
    const h = e.nativeEvent.layout.height;
    onMeasure(h);
  };

  const isExpiryVisible =
    plan?.id == user?.package_id && user?.package_expires_at;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onSelect(plan?.id)}
      style={{
        width: WINDOW.width - 64,
        marginRight: Sizer.hSize(12),
      }}
      disabled
    >
      <View
        onLayout={handleLayout}
        style={{
          backgroundColor: COLORS.secondary,
          borderRadius: Sizer.hSize(18),
          padding: Sizer.hSize(24),
          borderWidth: isSelected ? 2 : StyleSheet.hairlineWidth,
          borderColor: isSelected ? COLORS.primary : COLORS.borderMuted,
          position: 'relative',
          height: maxHeight || 'auto',
          ...SHADOWS.banner,
        }}
      >
        <Flex
          direction="row"
          jusContent="space-between"
          algItems="center"
          mB={12}
        >
          <Flex direction="row" algItems="center" gap={10}>
            <View
              style={{
                width: Sizer.hSize(4),
                height: Sizer.vSize(22),
                backgroundColor: COLORS.primary,
                borderRadius: Sizer.hSize(2),
              }}
            />
            <Typography
              size={22}
              color={COLORS.white100}
              fFamily="barlowBold700"
            >
              {plan?.title}
            </Typography>
          </Flex>
        </Flex>

        {/* Price */}
        <Typography
          size={28}
          fFamily="barlowBold700"
          color={COLORS.white100}
          mB={isExpiryVisible ? 0 : 20}
        >
          ${plan?.price}{' '}
          <Typography
            size={16}
            color="rgba(255,255,255,0.7)"
            fFamily="barlowMedium500"
          >
            /{plan?.duration}
          </Typography>
        </Typography>

        {/*  Expiry Date */}
        {isExpiryVisible && (
          <Flex direction="row" algItems="center" mB={20} mT={6} gap={6}>
            <Icon
              name="time-outline"
              size={12}
              color={COLORS.primary}
              iconFamily="Ionicons"
            />
            <Typography
              size={12}
              color={COLORS.white100}
              fFamily="barlowSemiBold600"
            >
              Expires: {formatExpiryDate(user?.package_expires_at)}
            </Typography>
          </Flex>
        )}

        <View
          style={{
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.1)',
            marginBottom: 20,
          }}
        />

        <Typography
          size={16}
          color={COLORS.white100}
          fFamily="barlowBold700"
          mB={14}
        >
          {plan?.title} includes:
        </Typography>
        <RenderHtml
          contentWidth={WINDOW.width}
          source={{ html: plan?.description }}
          baseStyle={{
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'barlowMedium500',
            fontSize: Sizer.fS(13.5),
            lineHeight: 20,
          }}
          systemFonts={[...defaultSystemFonts, 'barlowMedium500']}
        />

        {isSelected && (
          <View
            style={{
              position: 'absolute',
              top: Sizer.vSize(20),
              right: Sizer.hSize(20),
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 12,
                padding: 4,
              }}
            >
              <Icon
                name="checkmark"
                size={16}
                color={COLORS.white100}
                iconFamily={'Ionicons'}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const SubscriptionPlans = ({
  onPlanSelect,
  packagesData = [],
  selectedPlanId = null,
  isLoading = false,
}) => {
  const [maxHeight, setMaxHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const cardWidth = WINDOW.width - 48 + Sizer.hSize(10);
  const paddingHorizontal = Sizer.hSize(12);

  const handleMeasure = h => {
    setMaxHeight(prev => Math.max(prev, h));
  };

  const handlePlanSelect = plan => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  };

  const handleScroll = event => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round((scrollX + paddingHorizontal) / cardWidth);

    if (index !== currentIndex && index >= 0 && index < packagesData.length) {
      setCurrentIndex(index);
      const centeredPlan = packagesData[index];
      if (centeredPlan) {
        handlePlanSelect(centeredPlan);
      }
    }
  };

  const handleMomentumScrollEnd = event => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round((scrollX + paddingHorizontal) / cardWidth);

    if (scrollViewRef.current) {
      const snapX = index * cardWidth - paddingHorizontal;
      scrollViewRef.current.scrollTo({ x: snapX, animated: true });
    }
  };

  useEffect(() => {
    if (selectedPlanId !== null) {
      const index = packagesData.findIndex(plan => plan.id == selectedPlanId);
      if (index !== -1 && index !== currentIndex) {
        setCurrentIndex(index);
        if (scrollViewRef.current) {
          const snapX = index * cardWidth - paddingHorizontal;
          scrollViewRef.current.scrollTo({ x: snapX, animated: true });
        }
      }
    }
  }, [selectedPlanId]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth}
      snapToAlignment="center"
      decelerationRate={'fast'}
      contentContainerStyle={{
        paddingHorizontal: paddingHorizontal,
      }}
      scrollEnabled={!isLoading}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      scrollEventThrottle={16}
    >
      {packagesData?.length &&
        packagesData.map(plan => {
          return (
            <PlanCard
              key={plan?.id}
              plan={plan}
              onSelect={handlePlanSelect}
              isSelected={selectedPlanId == plan?.id}
              maxHeight={maxHeight}
              onMeasure={handleMeasure}
            />
          );
        })}
    </ScrollView>
  );
};

const SubscriptionScreen = ({ navigation, route }) => {
  const fromProfile = route?.params?.fromProfile;

  const { user } = useSelector(state => state.app);

  const dispatch = useDispatch();
  const { confirmSetupIntent } = useStripe();
  const { keyboardOpen } = useKeyboard();

  const { data: packagesData } = useCustomQuery({
    queryKey: ['packages'],
    queryFn: getPackages,
  });

  //Custom Logout Query Hook
  const { refetch: triggerLogout } = useCustomQuery({
    queryKey: ['logout'],
    queryFn: logout,
    enabled: false,
  });

  function clearApp() {
    queryClient.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      }),
    );
  }

  // Request Logout:
  const logoutHandler = () => {
    clearApp();
    triggerLogout().then(() => {
      dispatch(handleLogout());
    });
  };

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  // Initialize selectedPlan when packagesData loads
  useEffect(() => {
    if (packagesData && packagesData.length > 0 && !selectedPlan) {
      // If user has a package_id, find and select that package, otherwise select first package
      if (user?.package_id) {
        const userPackage = packagesData.find(pkg => pkg.id == user.package_id);
        setSelectedPlan(userPackage || packagesData[0]);
      } else {
        setSelectedPlan(packagesData[0]);
      }
    }
  }, [packagesData, user?.package_id]);

  //Custom Mutation Hooks:
  const { mutate: handlePaySuccess, isPending: isLoadingPaymentSuccess } =
    useCustomMutation({
      mutationFn: handlePaymentSuccess,
      onSuccess: ({ data }) => {
        console.log('last stripe res: :', data);

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
          showMessage({
            message: 'Payment Failed!',
            type: 'danger',
          });
        }
      },
    });

  const { mutate: pI, isPending: isLoadingPaymentIntent } = useCustomMutation({
    mutationFn: fetchPaymentIntent,
    onSuccess: async ({ data }) => {
      console.log('pi: ', data);

      const secret = data?.client_secret;
      if (secret) {
        setClientSecret(secret);
        setModalVisible(true);
      }
    },
    onError: () => {
      Platform.OS === 'android'
        ? ToastAndroid.show(
            'Error While Payment Proceeding.',
            ToastAndroid.LONG,
          )
        : Alert.alert('Payment Status', 'Error While Payment Proceeding.');
    },
  });

  const handlePlanSelection = plan => {
    setSelectedPlan(plan);
  };

  const handleProceedPayment = async () => {
    pI();
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
        console.log('Payment confirmation error', error);
        Alert.alert('Payment Failed', error.message);
      } else if (setupIntent) {
        console.log('Payment success', setupIntent);
        setModalVisible(false);
        handlePaySuccess({
          payment_method: setupIntent.paymentMethodId,
          package_id: selectedPlan?.id,
        });
      }
    } catch (err) {
      console.log('Payment error', err);
      Alert.alert('Error', 'Something went wrong during payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const subcribtionStatus = (selectedPlan = null) => {
    if (!selectedPlan) return 'Subscribe';

    // Find current user's package
    const currentPackage = packagesData?.find(
      pkg => pkg.id == user?.package_id,
    );
    const selectedPlanPrice = parseFloat(selectedPlan?.price || 0);
    const currentPackagePrice = parseFloat(currentPackage?.price || 0);

    // Already subscribed to this plan
    if (
      user?.subscription_status == 'active' &&
      user?.package_id == selectedPlan?.id
    ) {
      return 'Already Subscribed';
    }

    // User has active subscription - check upgrade/downgrade
    if (user?.subscription_status == 'active' && currentPackage) {
      if (selectedPlanPrice > currentPackagePrice) {
        return 'Upgrade';
      } else if (selectedPlanPrice < currentPackagePrice) {
        return 'Downgrade';
      }
    }

    // Inactive subscription - resubscribe
    // if (user?.subscription_status == 'inactive') {
    //   return "Resubscribe";
    // }

    return 'Subscribe';
  };

  return (
    <Container
      backgroundImage={null}
      isPadding={false}
      backgroundColor={COLORS.mainBg}
    >
      <Header
        bgColor="transparent"
        title="Settings"
        isBackVisible={fromProfile ? true : false}
        onPressRight={fromProfile ? null : logoutHandler}
      />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <ScreenBanner
          title="Subscription & billing"
          subtitle="Manage your subscription plan, billing details, and payment methods."
        />

        {/* Plan Selection Section */}
        <View style={{ marginTop: Sizer.vSize(32) }}>
          <View style={{ paddingHorizontal: Sizer.hSize(24) }}>
            <Typography
              fFamily="barlowBold700"
              size={16}
              color={COLORS.textPrimary}
              mB={16}
            >
              CHOOSE PLAN
            </Typography>
          </View>

          <SubscriptionPlans
            onPlanSelect={handlePlanSelection}
            selectedPlanId={selectedPlan?.id}
            packagesData={packagesData || []}
            isLoading={isLoadingPaymentIntent || isLoadingPaymentSuccess}
          />
        </View>

        <View
          style={{
            paddingHorizontal: Sizer.hSize(24),
            marginTop: Sizer.vSize(32),
          }}
        >
          <Button
            label={subcribtionStatus(selectedPlan)}
            onPress={handleProceedPayment}
            disabled={subcribtionStatus(selectedPlan) == 'Already Subscribed'}
            loader={isLoadingPaymentIntent || isLoadingPaymentSuccess}
          />
        </View>

        {/* Usage Details (Screen 02 spec) */}
        <View
          style={{
            paddingHorizontal: Sizer.hSize(24),
            marginTop: Sizer.vSize(32),
          }}
        >
          <View style={styles.usageCard}>
            <Typography
              color={COLORS.white100}
              fFamily="barlowBold700"
              size={15}
              mB={24}
              textAlign="center"
            >
              COACHING SESSIONS STATUS
            </Typography>
            <Flex direction="row" jusContent="space-between" algItems="center">
              <UsageBox label="TOTAL" value="3" />
              <UsageBox label="USED" value="0" />
              <UsageBox label="REMAINING" value="3" />
            </Flex>
          </View>
        </View>

        {/* Payment History Placeholder */}
        <View
          style={{
            paddingHorizontal: Sizer.hSize(24),
            marginTop: Sizer.vSize(32),
          }}
        >
          <Typography
            fFamily="barlowBold700"
            size={16}
            color={COLORS.textPrimary}
            mB={16}
          >
            PAYMENT HISTORY
          </Typography>
          <View style={styles.historyCard}>
            <Typography
              color={COLORS.textMuted}
              size={14}
              textAlign="center"
              fFamily="barlowMedium500"
            >
              No payment history found
            </Typography>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.bottomModalOuter}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View
            style={[
              styles.bottomSheetContainer,
              keyboardOpen && { marginBottom: Sizer.vSize(20) },
              {
                paddingBottom: keyboardOpen ? Sizer.vSize(20) : Sizer.vSize(60),
              },
            ]}
          >
            {/* Handle Bar */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Typography
                size={20}
                fFamily="barlowBold700"
                color={COLORS.textPrimary}
              >
                Payment details
              </Typography>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => setModalVisible(false)}
              >
                <View style={styles.closeBtn}>
                  <Icon
                    name="close"
                    size={20}
                    color={COLORS.textPrimary}
                    iconFamily="Ionicons"
                  />
                </View>
              </TouchableOpacity>
            </View>

            <Typography size={14} color={COLORS.textSecondary} mT={4} mB={24}>
              Securely complete your subscription using Stripe
            </Typography>

            {/* Card Field */}
            <View style={styles.cardFieldContainer}>
              <CardField
                postalCodeEnabled={false}
                placeholders={{ number: '4242 4242 4242 4242' }}
                cardStyle={{
                  backgroundColor: COLORS.surfaceMuted,
                  textColor: COLORS.textPrimary,
                  placeholderColor: COLORS.textMuted,
                  cursorColor: COLORS.primary,
                }}
                style={{
                  width: '100%',
                  height: 50,
                }}
                onCardChange={cardDetails => {
                  setCardDetails(cardDetails);
                }}
              />
            </View>

            {/* Pay Button */}
            <Button
              label="Pay now"
              onPress={handleConfirmPayment}
              loader={isProcessingPayment}
              btnStyle={{ width: '100%', marginTop: Sizer.vSize(8) }}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

const UsageBox = ({ label, value }) => (
  <View style={styles.usageBoxItem}>
    <View style={styles.usageBadge}>
      <Typography color={COLORS.primary} fFamily="barlowBold700" size={18}>
        {value}
      </Typography>
    </View>
    <Typography
      color={'rgba(255,255,255,0.85)'}
      size={11}
      fFamily="barlowBold700"
      mT={10}
    >
      {label}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  usageCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: Sizer.hSize(18),
    padding: Sizer.hSize(26),
    ...SHADOWS.banner,
  },
  usageBoxItem: {
    alignItems: 'center',
    flex: 1,
  },
  usageBadge: {
    width: Sizer.hSize(52),
    height: Sizer.hSize(52),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  historyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(40),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  bottomModalOuter: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: Sizer.hSize(24),
    borderTopRightRadius: Sizer.hSize(24),
    paddingHorizontal: Sizer.hSize(24),
    paddingTop: Sizer.vSize(12),
  },
  modalHandle: {
    width: Sizer.hSize(40),
    height: Sizer.vSize(4),
    backgroundColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(2),
    alignSelf: 'center',
    marginBottom: Sizer.vSize(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    width: Sizer.hSize(34),
    height: Sizer.hSize(34),
    borderRadius: Sizer.hSize(17),
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFieldContainer: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(4),
    marginBottom: Sizer.vSize(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
  },
});

export default SubscriptionScreen;
