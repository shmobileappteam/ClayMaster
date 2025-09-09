import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
//-----
import { Typography, Flex, Container } from '../../../atomComponents';
import {
  BASEOPACITY,
  COLORS,
  GLOBALSTYLE,
  WINDOW,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { subbg } from '../../../assets/images';
import { Button, Header } from '../../../components';
import Icon from '../../../helpers/Icon';
import { SeperatorSvg, SubscribeTickSvg } from '../../../assets/svgs';

const subscriptionPlans = [
  {
    id: 1,
    name: 'Silver Plan',
    price: '$25',
    period: 'month',
    icon: '👑',
    features: [
      'Self-assessment tab',
      'Tips/techniques that can help improve your shooting performance.',
      'Expanded practice drills.',
      'Going beyond normal break points.',
      'Additional 30 minute online coaching sessions can be purchased for $85/session.',
    ],
    additionalCount: 5,
  },
  {
    id: 2,
    name: 'Gold Plan',
    price: '$45',
    period: 'month',
    icon: '👑',
    features: [
      'Everything in Silver Plan',
      'Advanced performance analytics',
      'Personalized training programs',
      'Priority support',
      'Monthly video analysis',
      'Competition preparation guides',
    ],
    additionalCount: 8,
  },
  {
    id: 3,
    name: 'Platinum Plan',
    price: '$75',
    period: 'month',
    icon: '💎',
    features: [
      'Everything in Gold Plan',
      'One-on-one coaching sessions',
      'Custom equipment recommendations',
      'Weekly performance reviews',
      'Access to exclusive tournaments',
      'Mobile app premium features',
    ],
    additionalCount: 10,
    isPopular: false,
    backgroundColor: '#2C5F41', // Dark green/platinum color
  },
];

const PlanCard = ({ plan, onSelect, isSelected }) => {
  return (
    <TouchableOpacity
      activeOpacity={BASEOPACITY}
      onPress={() => onSelect(plan.id)}
      style={{
        width: WINDOW.width - 48,
        marginRight: Sizer.hSize(10),
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.orange400,
          borderRadius: Sizer.hSize(16),
          padding: Sizer.hSize(20),
          borderWidth: Sizer.hSize(1.3),
          borderColor: isSelected ? COLORS.orange500 : COLORS.white100,
          position: 'relative',
          height: Sizer.vSize(370),
          // maxHeight:"90%"
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
              {plan.name}
            </Typography>
          </Flex>
          <Typography size={24}>{plan.icon}</Typography>
        </Flex>

        {/* Price */}
        <Typography
          size={25}
          color={COLORS.white100}
          fFamily="barlowBold700"
          mB={16}
        >
          {plan.price}/{plan.period}
        </Typography>
        <SeperatorSvg />

        <Typography
          size={16}
          mT={16}
          color={COLORS.white100}
          fFamily="barlowSemiBold600"
          mB={12}
        >
          {plan.name} Includes:
        </Typography>

        <View style={{ flex: 1 }}>
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
        </View>

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

const SubscriptionPlans = ({ onPlanSelect, selectedPlanId = null }) => {
  const handlePlanSelect = planId => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: Sizer.hSize(12),
      }}
    >
      {subscriptionPlans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onSelect={handlePlanSelect}
          isSelected={selectedPlanId === plan.id}
        />
      ))}
    </ScrollView>
  );
};

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = React.useState(2);
  const handlePlanSelection = planId => {
    setSelectedPlan(planId);
  };

  return (
    <Container backgroundImage={subbg} isPadding={false}>
      <Header
        logoTextColor={COLORS.white100}
        defaultHeaderStyles={{ marginTop: Sizer.hSize(60) }}
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
        />
        <View style={{ ...GLOBALSTYLE.paddingHor, marginTop: Sizer.hSize(32) }}>
          <Button label="Subscribe" />
          <Typography mT={16} color={COLORS.white100} textAlign="center">
            Restore My Subscription
          </Typography>
        </View>
      </ScrollView>
    </Container>
  );
};

export default SubscriptionScreen;
