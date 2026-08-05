import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import {
  Container,
  FormController,
  Typography,
  AppLoader,
} from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import ProfileField from '../../../components/profile/ProfileField';
import ProfileSelect from '../../../components/profile/ProfileSelect';
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
  getCart,
  placeOrder,
  createCheckoutSetupIntent,
} from '../../../api/shopService';
import {
  getCountries,
  getCountryStates,
  getStateCities,
} from '../../../api/cscService';
import { centsToDollars, formatMoney } from '../../../constants/shop';
import { maskPhoneNumber, showMessage } from '../../../utils';

const STEPS = [
  { key: 1, label: 'Billing' },
  { key: 2, label: 'Review' },
  { key: 3, label: 'Payment' },
];

const digitsOnly = value => String(value || '').replace(/\D/g, '').slice(0, 10);

const billingSchema = Yup.object().shape({
  first_name: Yup.string().trim().required('First name is required'),
  last_name: Yup.string().trim().required('Last name is required'),
  email: Yup.string()
    .trim()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: Yup.string()
    .required('Phone is required')
    .test('phone', 'Enter a valid 10-digit phone number', value => {
      const digits = String(value || '').replace(/\D/g, '');
      return digits.length === 10;
    }),
  country: Yup.string().trim().required('Country is required'),
  state: Yup.string().trim().required('State is required'),
  city: Yup.string().trim().required('City is required'),
  address1: Yup.string().trim().required('Address is required'),
  zip: Yup.string().trim().required('ZIP is required'),
  companyname: Yup.string().trim(),
});

const CheckoutSteps = ({ step }) => (
  <View style={styles.stepsRow}>
    {STEPS.map((s, i) => {
      const active = step === s.key;
      const done = step > s.key;
      return (
        <React.Fragment key={s.key}>
          {i > 0 ? (
            <View
              style={[styles.stepLine, (active || done) && styles.stepLineOn]}
            />
          ) : null}
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                active && styles.stepDotActive,
                done && styles.stepDotDone,
              ]}
            >
              {done ? (
                <Icon
                  name="checkmark"
                  iconFamily="Ionicons"
                  size={14}
                  color={COLORS.white100}
                />
              ) : (
                <Typography
                  fFamily="barlowSemiBold600"
                  size={12}
                  color={active ? COLORS.white100 : COLORS.textSecondary}
                >
                  {s.key}
                </Typography>
              )}
            </View>
            <Typography
              fFamily={active || done ? 'barlowSemiBold600' : 'barlowMedium500'}
              size={11}
              color={active || done ? COLORS.primary : COLORS.textSecondary}
              mT={4}
            >
              {s.label}
            </Typography>
          </View>
        </React.Fragment>
      );
    })}
  </View>
);

const OrderSummaryCard = ({ cart }) => (
  <View style={[GLOBALSTYLE.screenCard, styles.summary]}>
    <View style={styles.summaryRow}>
      <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
        Subtotal
      </Typography>
      <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
        {formatMoney(cart?.subtotal)}
      </Typography>
    </View>
    {cart?.discount ? (
      <View style={styles.summaryRow}>
        <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
          Annual Subscriber Credit
        </Typography>
        <Typography size={TYPE.body.size} color={COLORS.primary}>
          -{formatMoney(cart.discount)}
        </Typography>
      </View>
    ) : null}
    <View style={styles.summaryTotal}>
      <Typography
        fFamily={TYPE.h2.fFamily}
        size={TYPE.h2.size}
        color={COLORS.textPrimary}
      >
        Total
      </Typography>
      <Typography
        fFamily={TYPE.h2.fFamily}
        size={TYPE.h2.size}
        color={COLORS.primary}
      >
        {formatMoney(cart?.total)}
      </Typography>
    </View>
  </View>
);

/** Step 1 — same billing fields / gaps as before */
const BillingStep = ({
  values,
  errors,
  formErrors,
  handleChange,
  handleBlur,
  setFieldValue,
  countriesData,
  loadingCountries,
  onContinue,
}) => {
  const fieldError = name => errors[name] || formErrors?.[name];

  const { data: statesData = [], isLoading: loadingStates } = useCustomQuery({
    queryKey: ['cscStates', values.country],
    queryFn: () => getCountryStates(values.country),
    enabled: Boolean(values.country),
  });

  const { data: citiesData = [], isLoading: loadingCities } = useCustomQuery({
    queryKey: ['cscCities', values.country, values.state],
    queryFn: () => getStateCities(values.country, values.state),
    enabled: Boolean(values.country && values.state),
  });

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <Typography
          fFamily={TYPE.h2.fFamily}
          size={TYPE.h2.size}
          color={COLORS.textPrimary}
          mB={SPACING.component}
        >
          Billing Details
        </Typography>
        <View style={styles.fieldRow}>
          <View style={styles.half}>
            <ProfileField
              label="First name"
              value={values.first_name}
              onChangeText={handleChange('first_name')}
              onBlur={handleBlur('first_name')}
              placeholder="John"
              error={fieldError('first_name')}
            />
          </View>
          <View style={styles.half}>
            <ProfileField
              label="Last name"
              value={values.last_name}
              onChangeText={handleChange('last_name')}
              onBlur={handleBlur('last_name')}
              placeholder="Smith"
              error={fieldError('last_name')}
            />
          </View>
        </View>
        <ProfileField
          label="Email"
          value={values.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          placeholder="you@email.com"
          keyboardType="email-address"
          error={fieldError('email')}
        />
        <ProfileField
          label="Phone"
          value={maskPhoneNumber(values.phone)}
          onChangeText={t => handleChange('phone')(digitsOnly(t))}
          onBlur={handleBlur('phone')}
          placeholder="555-123-4567"
          keyboardType="phone-pad"
          maxLength={12}
          error={fieldError('phone')}
          leftAddon={
            <Typography
              fFamily="barlowMedium500"
              size={TYPE.body.size}
              color={COLORS.textPrimary}
            >
              +1
            </Typography>
          }
        />
        <ProfileField
          label="Address"
          value={values.address1}
          onChangeText={handleChange('address1')}
          onBlur={handleBlur('address1')}
          placeholder="123 Shooting Range Rd"
          error={fieldError('address1')}
        />
        <View style={styles.fieldRow}>
          <View style={styles.half}>
            <ProfileSelect
              label="Country"
              value={values.country}
              data={countriesData}
              placeholder={loadingCountries ? 'Loading…' : 'Select country'}
              disabled={loadingCountries}
              error={fieldError('country')}
              onChange={item => {
                setFieldValue('country', item?.value || '');
                setFieldValue('state', '');
                setFieldValue('city', '');
              }}
            />
          </View>
          <View style={styles.half}>
            <ProfileSelect
              label="State"
              value={values.state}
              data={statesData}
              placeholder={
                !values.country
                  ? 'Select country first'
                  : loadingStates
                    ? 'Loading…'
                    : 'Select state'
              }
              disabled={!values.country || loadingStates}
              error={fieldError('state')}
              onChange={item => {
                setFieldValue('state', item?.value || '');
                setFieldValue('city', '');
              }}
            />
          </View>
        </View>
        <View style={styles.fieldRow}>
          <View style={styles.half}>
            <ProfileSelect
              label="City"
              value={values.city}
              data={citiesData}
              placeholder={
                !values.state
                  ? 'Select state first'
                  : loadingCities
                    ? 'Loading…'
                    : 'Select city'
              }
              disabled={!values.state || loadingCities}
              error={fieldError('city')}
              onChange={item => setFieldValue('city', item?.value || '')}
            />
          </View>
          <View style={styles.half}>
            <ProfileField
              label="ZIP"
              value={values.zip}
              onChangeText={handleChange('zip')}
              onBlur={handleBlur('zip')}
              placeholder="75201"
              error={fieldError('zip')}
            />
          </View>
        </View>
        <ProfileField
          label="Company (optional)"
          value={values.companyname}
          onChangeText={handleChange('companyname')}
          onBlur={handleBlur('companyname')}
          placeholder="Company name"
          error={fieldError('companyname')}
        />
      </View>

      <TouchableOpacity
        style={styles.placeBtn}
        onPress={onContinue}
        activeOpacity={0.88}
      >
        <Typography
          fFamily="barlowSemiBold600"
          size={TYPE.h3.size}
          color={COLORS.white100}
        >
          Continue to Review
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  );
};

/** Step 2 — products scroll in middle; subtotal + CTA stay pinned below */
const ReviewStep = ({ items, cart, loadingCart, paying, onContinue }) => (
  <View style={styles.reviewRoot}>
    <Typography
      fFamily={TYPE.h2.fFamily}
      size={TYPE.h2.size}
      color={COLORS.textPrimary}
      mB={SPACING.component}
    >
      Order Items ({items.length})
    </Typography>

    <View style={styles.itemsListBox}>
      {loadingCart ? (
        <AppLoader />
      ) : items.length === 0 ? (
        <Typography color={COLORS.textSecondary}>Your cart is empty.</Typography>
      ) : (
        <ScrollView
          style={styles.itemsScroll}
          contentContainerStyle={styles.itemsGroup}
          showsVerticalScrollIndicator
          nestedScrollEnabled
          bounces
        >
          {items.map(item => (
            <View
              key={item.id}
              style={[GLOBALSTYLE.screenCard, styles.orderLine]}
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.orderThumb}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.orderThumb, styles.thumbPlaceholder]} />
              )}
              <View style={{ flex: 1 }}>
                <Typography
                  fFamily="barlowMedium500"
                  size={TYPE.body.size}
                  color={COLORS.textPrimary}
                  numberOfLines={2}
                >
                  {item.title}
                </Typography>
                <Typography
                  size={TYPE.caption.size}
                  color={COLORS.textSecondary}
                  mT={2}
                >
                  {[item.color, item.size].filter(Boolean).join(' · ')}
                  {item.color || item.size ? ' · ' : ''}
                  Qty: {item.quantity}
                </Typography>
              </View>
              <Typography
                fFamily="barlowBold700"
                size={TYPE.body.size}
                color={COLORS.primary}
              >
                {formatMoney(
                  centsToDollars(item.price) * (Number(item.quantity) || 1),
                )}
              </Typography>
            </View>
          ))}
        </ScrollView>
      )}
    </View>

    <View style={styles.reviewFooter}>
      <OrderSummaryCard cart={cart} />
      <TouchableOpacity
        style={[
          styles.placeBtn,
          (paying || items.length === 0) && styles.placeBtnDisabled,
        ]}
        onPress={onContinue}
        disabled={paying || items.length === 0}
        activeOpacity={0.88}
      >
        <Typography
          fFamily="barlowSemiBold600"
          size={TYPE.h3.size}
          color={COLORS.white100}
        >
          Continue to Payment · {formatMoney(cart?.total)}
        </Typography>
      </TouchableOpacity>
    </View>
  </View>
);

/** Step 3 — Stripe card (same CardField UI as previous modal) */
const PaymentStep = ({ cart, paying, onPay, onCardChange }) => (
  <ScrollView
    contentContainerStyle={styles.scroll}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.section}>
      <Typography
        fFamily={TYPE.h2.fFamily}
        size={TYPE.h2.size}
        color={COLORS.textPrimary}
        mB={8}
      >
        Payment details
      </Typography>
      <Typography size={TYPE.body.size} color={COLORS.textSecondary} mB={SPACING.component}>
        Securely complete your order using Stripe
      </Typography>
      <CardField
        postalCodeEnabled={false}
        style={styles.cardField}
        onCardChange={onCardChange}
      />
    </View>

    <OrderSummaryCard cart={cart} />

    <Button
      label={`Pay & Place Order · ${formatMoney(cart?.total)}`}
      onPress={onPay}
      disabled={paying}
      btnStyle={{ width: '100%' }}
    />
  </ScrollView>
);

/** ClayMaster checkout — 3 steps with indicator; billing gaps unchanged */
const CheckoutScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.app);
  const { confirmSetupIntent } = useStripe();
  const queryClient = useQueryClient();
  const billingRef = React.useRef(null);

  const { data: cart, isLoading: loadingCart } = useCustomQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });
  const items = cart?.items || [];

  const { data: countriesData = [], isLoading: loadingCountries } =
    useCustomQuery({
      queryKey: ['cscCountries'],
      queryFn: getCountries,
    });

  const [step, setStep] = useState(1);
  const [billing, setBilling] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [formErrors, setFormErrors] = useState(null);

  const initialValues = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: digitsOnly(user?.phone || user?.contact),
    country: '',
    state: '',
    city: '',
    address1: '',
    zip: '',
    companyname: '',
  };

  const { mutate: submitOrder, isPending: placing } = useCustomMutation({
    mutationFn: placeOrder,
    onSuccess: data => {
      const paymentStatus = data?.data?.payment_status;
      const ok =
        (data?.status === 'success' || data?.status === true) &&
        (!paymentStatus || paymentStatus === 'succeeded');

      if (!ok) {
        showMessage({
          type: 'danger',
          message: data?.message || 'Could not place order.',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setClientSecret(null);
      setPlacedOrder({
        orderId: data?.data?.order_id,
        orderNumber: data?.data?.order_number,
        message: data?.message,
      });
    },
    on422Error: errors => {
      setFormErrors(errors);
      setStep(1);
    },
    onError: err => {
      showMessage({
        type: 'danger',
        message:
          err?.data?.message || 'Could not place order. Please try again.',
      });
    },
  });

  const { mutate: requestCheckoutSetupIntent, isPending: loadingIntent } =
    useCustomMutation({
      mutationFn: createCheckoutSetupIntent,
      onSuccess: data => {
        const billingValues = billingRef.current;
        if (!billingValues) {
          showMessage({
            type: 'danger',
            message: 'Billing details missing. Please try again.',
          });
          return;
        }

        if (data?.payment_required === false) {
          submitOrder({ ...billingValues });
          return;
        }

        const secret = data?.client_secret;
        if (secret) {
          setClientSecret(secret);
          setStep(3);
        } else {
          showMessage({
            type: 'danger',
            message:
              data?.message || 'Unable to start payment. Please try again.',
          });
        }
      },
      onError: err => {
        showMessage({
          type: 'danger',
          message: err?.data?.message || 'Error while starting payment.',
        });
      },
    });

  const goToReview = async (validateForm, setTouched, values) => {
    setFormErrors(null);
    const errs = await validateForm();
    if (errs && Object.keys(errs).length) {
      const touched = Object.keys(values || {}).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      );
      setTouched(touched);
      return;
    }
    setStep(2);
  };

  const startPayment = values => {
    setFormErrors(null);
    setBilling(values);
    billingRef.current = values;
    requestCheckoutSetupIntent();
  };

  const handleConfirmPayment = async () => {
    if (!clientSecret || !billing) return;
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
        return;
      }
      if (setupIntent?.paymentMethodId) {
        submitOrder({
          ...billing,
          payment_method: setupIntent.paymentMethodId,
        });
      }
    } catch {
      Alert.alert('Error', 'Something went wrong during payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const paying = loadingIntent || isProcessingPayment || placing;
  const payOverlay = loadingIntent || placing || isProcessingPayment;

  const onHeaderBack = () => {
    if (paying) return;
    if (step === 3) {
      setClientSecret(null);
      setCardDetails(null);
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(1);
      return;
    }
    navigation.goBack();
  };

  if (placedOrder) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Icon
              name="checkmark-circle"
              iconFamily="Ionicons"
              size={40}
              color="#16A34A"
            />
          </View>
          <Typography
            fFamily="barlowBold700"
            size={TYPE.h1.size}
            color={COLORS.textPrimary}
            mT={24}
          >
            Order Placed!
          </Typography>
          <Typography
            size={TYPE.body.size}
            color={COLORS.textSecondary}
            textAlign="center"
            mT={8}
            lineHeight={22}
          >
            Your order {placedOrder.orderNumber || ''} has been placed
            successfully.
          </Typography>
          <Typography
            size={TYPE.caption.size}
            color={COLORS.textSecondary}
            textAlign="center"
            mT={4}
            mB={32}
          >
            You'll receive a confirmation email shortly.
          </Typography>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.replace('OrdersScreen')}
            activeOpacity={0.88}
          >
            <Typography
              fFamily="barlowSemiBold600"
              size={TYPE.h3.size}
              color={COLORS.white100}
            >
              View Orders
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => {
              navigation.navigate('BottomTabs', {
                screen: 'MainTabs',
                params: { screen: 'Home' },
              });
            }}
            activeOpacity={0.88}
          >
            <Typography
              fFamily="barlowSemiBold600"
              size={TYPE.h3.size}
              color={COLORS.primary}
            >
              Back to Home
            </Typography>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Checkout"
        showBack
        showNotification={false}
        onBack={onHeaderBack}
        showModeIndicator={false}
      />
      <CheckoutSteps step={step} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FormController
          initialValues={initialValues}
          validationSchema={billingSchema}
          enableReinitialize
          onSubmit={startPayment}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            validateForm,
            setTouched,
          }) => {
            if (step === 1) {
              return (
                <BillingStep
                  values={values}
                  errors={errors}
                  formErrors={formErrors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  countriesData={countriesData}
                  loadingCountries={loadingCountries}
                  onContinue={() =>
                    goToReview(validateForm, setTouched, values)
                  }
                />
              );
            }
            if (step === 2) {
              return (
                <ReviewStep
                  items={items}
                  cart={cart}
                  loadingCart={loadingCart}
                  paying={paying}
                  onContinue={handleSubmit}
                />
              );
            }
            return (
              <PaymentStep
                cart={cart}
                paying={paying}
                onPay={handleConfirmPayment}
                onCardChange={setCardDetails}
              />
            );
          }}
        </FormController>
      </KeyboardAvoidingView>

      <ScreenOverlayLoader visible={payOverlay} />
    </Container>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(12),
    paddingBottom: Sizer.vSize(4),
  },
  stepItem: {
    alignItems: 'center',
    minWidth: Sizer.hSize(56),
  },
  stepDot: {
    width: Sizer.hSize(28),
    height: Sizer.hSize(28),
    borderRadius: Sizer.hSize(14),
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepDotDone: {
    backgroundColor: COLORS.primary,
  },
  stepLine: {
    flex: 1,
    height: 2,
    maxWidth: Sizer.hSize(40),
    backgroundColor: COLORS.borderMuted,
    marginBottom: Sizer.vSize(16),
  },
  stepLineOn: {
    backgroundColor: COLORS.primary,
  },
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  reviewRoot: {
    flex: 1,
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(24),
  },
  /** Fills space above pinned subtotal; only this area scrolls */
  itemsListBox: {
    flex: 1,
    minHeight: 0,
    marginBottom: Sizer.vSize(SPACING.section),
  },
  itemsScroll: {
    flex: 1,
  },
  reviewFooter: {
    flexShrink: 0,
    gap: Sizer.vSize(SPACING.section),
  },
  section: {},
  fieldRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
  },
  half: { flex: 1 },
  itemsGroup: {
    gap: Sizer.vSize(SPACING.component),
    paddingBottom: Sizer.vSize(4),
  },
  orderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    padding: Sizer.hSize(12),
    ...SHADOWS.card,
  },
  orderThumb: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: Sizer.hSize(12),
  },
  thumbPlaceholder: {
    backgroundColor: COLORS.surfaceMuted,
  },
  summary: {
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.vSize(8),
    ...SHADOWS.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
    paddingTop: Sizer.vSize(8),
    marginTop: Sizer.vSize(4),
  },
  placeBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeBtnDisabled: {
    opacity: 0.6,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 8,
  },
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(40),
  },
  successIcon: {
    width: Sizer.hSize(80),
    height: Sizer.hSize(80),
    borderRadius: Sizer.hSize(40),
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    width: '100%',
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(12),
  },
  outlineBtn: {
    width: '100%',
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
