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
  WINDOW,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { subbg } from '../../../assets/images';
import { Button, Header } from '../../../components';
import Icon from '../../../helpers/Icon';
import { SeperatorSvg, SubscribeTickSvg } from '../../../assets/svgs';
import { useCustomQuery } from '../../../query/useCustomQuery';
import {
  fetchPaymentIntent,
  getPackages,
  handlePaymentSuccess,
} from '../../../api/packageService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import {
  CardField,
  useStripe,
} from '@stripe/stripe-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { formatExpiryDate, showMessage } from '../../../utils';
import { handleLogout, setUser } from '../../../redux/slices/appSlice';
import { logout } from '../../../api/userService';
import { queryClient } from '../../../api/api';
import { CommonActions } from '@react-navigation/native';

const PlanCard = ({ plan, onSelect, isSelected, maxHeight, onMeasure }) => {
  const { user } = useSelector(state => state.app);

  const handleLayout = e => {
    const h = e.nativeEvent.layout.height;
    onMeasure(h);
  };

  const isExpiryVisible = plan?.id == user?.package_id && user?.package_expires_at;

  return (
    <TouchableOpacity
      activeOpacity={BASEOPACITY}
      onPress={() => onSelect(plan?.id)}
      style={{
        width: WINDOW.width - 48,
        marginRight: Sizer.hSize(10),
      }}
      disabled
    >
      <View
        onLayout={handleLayout}
        style={{
          backgroundColor: COLORS.orange400,
          borderRadius: Sizer.hSize(16),
          padding: Sizer.hSize(20),
          borderWidth: Sizer.hSize(1.3),
          borderColor: isSelected ? COLORS.orange500 : COLORS.white100,
          position: 'relative',
          height: maxHeight || 'auto',
        }}
      >
        <Flex
          direction="row"
          jusContent="space-between"
          algItems="center"
          mB={8}
        >
          <Flex direction="row" algItems="center" gap={8}>
            <View
              style={{
                width: Sizer.hSize(4),
                height: Sizer.vSize(20),
                backgroundColor: COLORS.primary,
                borderRadius: Sizer.hSize(3),
              }}
            />
            <Typography size={20} color={COLORS.white100}>
              {plan?.title}
            </Typography>
          </Flex>
          {/* <Typography size={24}>{plan.icon}</Typography> */}
        </Flex>

        {/* Price */}
        <Typography
          size={25}
          fFamily="barlowBold700"
          color={COLORS.white100}
          mB={isExpiryVisible ? 0 : 16}
        >
          ${plan?.price}/{plan?.duration}

        </Typography>

        {/*  Expiry Date */}
        {isExpiryVisible && (
          <Flex direction="row" algItems="center"
            mB={16}
            mT={4}
            gap={3}
          >
            <Icon
              name="time-outline"
              size={10}
              color={COLORS.yellow}
              iconFamily="Ionicons"
            />
            <Typography size={10} color={COLORS.yellow} fFamily="barlowSemiBold600">
              Expires: {formatExpiryDate(user?.package_expires_at)}
            </Typography>
          </Flex>
        )}
        <SeperatorSvg />

        <Typography
          size={16}
          mT={16}
          color={COLORS.white100}
          fFamily="barlowSemiBold600"
          mB={12}
        >
          {plan?.title} Includes:
        </Typography>
        <RenderHtml
          contentWidth={WINDOW.width}
          source={{ html: plan?.description }}
          baseStyle={{
            color: COLORS.white100,
            fontFamily: FONTS.barlowMedium500,
            textTransform: 'capitalize',
            fontSize: Sizer.fS(11),
          }}
          systemFonts={[...defaultSystemFonts, FONTS.barlowMedium500]}
        />

        {isSelected && (
          <View
            style={{
              position: 'absolute',
              top: Sizer.vSize(16),
              right: Sizer.hSize(16),
            }}
          >
            <Icon
              name="check-circle-fill"
              size={Sizer.hSize(12)}
              color={COLORS.orange500}
              iconFamily={'Octicons'}
            />
          </View>
        )}
      </View>
    </TouchableOpacity >
  );
};

const SubscriptionPlans = ({
  onPlanSelect,
  packagesData = [],
  selectedPlanId = null,
  isLoading = false
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

  const dispatch = useDispatch()
  const { confirmSetupIntent } = useStripe();

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
        console.log("last stripe res: :", data);

        if (data?.success) {
          dispatch(setUser({ ...user, package_id: selectedPlan?.id, subscription_status: "active", package_expires_at: data?.package_expires_at || user?.package_expires_at }));
          showMessage({
            message: "Payment Successfull!",
            type: 'success',
            bgColor: COLORS.primary
          });
          navigation.replace('SubscribtionSuccessScreen');
        } else {
          showMessage({
            message: "Payment Failed!",
            type: 'danger',
          });
        }
      },
    });

  const { mutate: pI, isPending: isLoadingPaymentIntent } = useCustomMutation({
    mutationFn: fetchPaymentIntent,
    onSuccess: async ({ data }) => {
      console.log("pi: ", data);

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
    if (!selectedPlan) return "Subscribe";

    // Find current user's package
    const currentPackage = packagesData?.find(pkg => pkg.id == user?.package_id);
    const selectedPlanPrice = parseFloat(selectedPlan?.price || 0);
    const currentPackagePrice = parseFloat(currentPackage?.price || 0);

    // Already subscribed to this plan
    if (user?.subscription_status == 'active' && user?.package_id == selectedPlan?.id) {
      return "Already Subscribed";
    }

    // User has active subscription - check upgrade/downgrade
    if (user?.subscription_status == 'active' && currentPackage) {
      if (selectedPlanPrice > currentPackagePrice) {
        return "Upgrade";
      } else if (selectedPlanPrice < currentPackagePrice) {
        return "Downgrade";
      }
    }

    // Inactive subscription - resubscribe
    // if (user?.subscription_status == 'inactive') {
    //   return "Resubscribe";
    // }

    return "Subscribe";
  }

  return (
    <Container backgroundImage={subbg} isPadding={false}>
      <Header
        logoTextColor={COLORS.white100}
        defaultHeaderStyles={{ marginTop: Sizer.hSize(60) }}
        bgColor={COLORS.white100}
        isBackVisible={fromProfile ? true : false}
        onPressRight={fromProfile ? null : logoutHandler}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: Sizer.vSize(26),
          paddingBottom: 60,
        }}
      >
        <SubscriptionPlans
          onPlanSelect={handlePlanSelection}
          selectedPlanId={selectedPlan?.id}
          packagesData={packagesData || []}
          isLoading={isLoadingPaymentIntent || isLoadingPaymentSuccess}
        />

        <View style={{ ...GLOBALSTYLE.paddingHor, marginTop: Sizer.hSize(32) }}>
          <Button
            label={subcribtionStatus(selectedPlan,)}
            onPress={handleProceedPayment}
            disabled={subcribtionStatus(selectedPlan) == "Already Subscribed"}
            loader={isLoadingPaymentIntent || isLoadingPaymentSuccess}
          />
          {/* <Typography mT={16} color={COLORS.white100} textAlign="center">
            Restore My Subscription
          </Typography> */}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.bottomModalOuter}>
          <View style={styles.bottomSheetContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Typography size={18} fFamily="barlowBold700" color={COLORS.black100}>
                Enter Card Details
              </Typography>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={COLORS.black100}
                  iconFamily="Ionicons"
                />
              </TouchableOpacity>
            </View>

            {/* Card Field */}
            <CardField
              postalCodeEnabled={false}
              placeholders={{ number: '4242 4242 4242 4242' }}
              cardStyle={{
                backgroundColor: COLORS.grey700,
                textColor: '#000000',
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 20,
              }}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
              }}
            />

            {/* Pay Button */}
            <Button
              label="Pay Now"
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomModalOuter: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
});

export default SubscriptionScreen;
