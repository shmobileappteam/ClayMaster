import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  View,
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
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';
import { useSelector } from 'react-redux';
import { showMessage } from '../../../utils';

const PlanCard = ({ plan, onSelect, isSelected, maxHeight, onMeasure }) => {
  const handleLayout = e => {
    const h = e.nativeEvent.layout.height;
    onMeasure(h);
  };

  return (
    <TouchableOpacity
      activeOpacity={BASEOPACITY}
      onPress={() => onSelect(plan?.id)}
      style={{
        width: WINDOW.width - 48,
        marginRight: Sizer.hSize(10),
      }}
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
          mB={16}
        >
          ${plan?.price}/{plan?.duration}
        </Typography>
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
        {/* <View style={{ flex: 1 }}>
          {plan.features.map((feature, index) => (
            <Flex
              key={index}
              direction="row"
              algItems="flex-start"
              gap={12}
              mB={8}
            >
              <SubscribeTickSvg />
              <Typography
                fFamily="barlowMedium500"
                color={COLORS.white100}
                flexShrink={1}
              >
                {feature}
              </Typography>
            </Flex>
          ))}

          <Flex direction="row" algItems="center" gap={12} mT={8}>
            <Typography
              size={14}
              color={COLORS.white100}
              fFamily="barlowSemiBold600"
            >
              +{plan.additionalCount} more
            </Typography>
          </Flex>
        </View> */}

        {isSelected && (
          <View
            style={{
              position: 'absolute',
              bottom: Sizer.vSize(16),
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
    </TouchableOpacity>
  );
};

const SubscriptionPlans = ({
  onPlanSelect,
  packagesData = [],
  selectedPlanId = null,
}) => {
  const [maxHeight, setMaxHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const cardWidth = WINDOW.width - 48 + Sizer.hSize(10);
  const paddingHorizontal = Sizer.hSize(12);

  const handleMeasure = h => {
    setMaxHeight(prev => Math.max(prev, h));
  };

  const handlePlanSelect = planId => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    }
  };

  const handleScroll = event => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round((scrollX + paddingHorizontal) / cardWidth);

    if (index !== currentIndex && index >= 0 && index < packagesData.length) {
      setCurrentIndex(index);
      const centeredPlan = packagesData[index];
      if (centeredPlan) {
        handlePlanSelect(centeredPlan.id);
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
      const index = packagesData.findIndex(plan => plan.id === selectedPlanId);
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
              isSelected={selectedPlanId === plan?.id}
              maxHeight={maxHeight}
              onMeasure={handleMeasure}
            />
          );
        })}
    </ScrollView>
  );
};

const SubscriptionScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.app);

  const [selectedPlan, setSelectedPlan] = useState(packagesData?.[0]?.id || 1);

  console.log(user?.stripe_customer_id);

  const { data: packagesData } = useCustomQuery({
    queryKey: ['packages'],
    queryFn: getPackages,
  });

  //Custom Mutation Hook:
  const { mutate: handlePaySuccess, isPending: isLoadingPaymentSuccess } =
    useCustomMutation({
      mutationFn: handlePaymentSuccess,
      onSuccess: ({ data }) => {
        console.log('subscribe api status: ', data);

        if (data.status) {
          showMessage({
            message: data?.message,
            type: 'success',
          });
          navigation.replace('PaymentSuccessScreen');
        } else {
          showMessage({
            message: data?.message,
            type: 'danger',
          });
        }
      },
    });

  const { mutate: pI, isPending: isLoadingPaymentIntent } = useCustomMutation({
    mutationFn: fetchPaymentIntent,
    onSuccess: async ({ data }) => {
      const clientSecret = data?.client_secret;
      if (clientSecret) {
        const { error: paymentSheetError } = await initPaymentSheet({
          merchantDisplayName: 'ClayMaster',
          setupIntentClientSecret: clientSecret,
          customerId: user?.stripe_customer_id,
        });

        if (paymentSheetError) {
          console.log('paymentSheetError', paymentSheetError);
          return;
        }

        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
          return;
        }

        handlePaySuccess({
          // payment_method: 'pm_123456789',
          package_id: selectedPlan,
        });
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

  const handlePlanSelection = planId => {
    setSelectedPlan(planId);
  };

  const handleProceedPayment = async () => {
    pI();
  };

  return (
    <Container backgroundImage={subbg} isPadding={false}>
      <Header
        logoTextColor={COLORS.white100}
        defaultHeaderStyles={{ marginTop: Sizer.hSize(60) }}
        bgColor={COLORS.white100}
        isBackVisible={false}
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
          selectedPlanId={selectedPlan}
          packagesData={packagesData || []}
        />
        <View style={{ ...GLOBALSTYLE.paddingHor, marginTop: Sizer.hSize(32) }}>
          <Button
            label="Subscribe"
            onPress={handleProceedPayment}
            loader={isLoadingPaymentIntent}
          />
          <Typography mT={16} color={COLORS.white100} textAlign="center">
            Restore My Subscription
          </Typography>
        </View>
      </ScrollView>
    </Container>
  );
};

export default SubscriptionScreen;
