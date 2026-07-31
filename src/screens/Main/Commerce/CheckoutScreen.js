import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
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
} from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import ProfileField from '../../../components/profile/ProfileField';
import ProfileSelect from '../../../components/profile/ProfileSelect';
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
import { getCart, placeOrder } from '../../../api/shopService';
import {
  getCountries,
  getCountryStates,
  getStateCities,
} from '../../../api/cscService';
import { fetchPaymentIntent } from '../../../api/packageService';
import { centsToDollars, formatMoney } from '../../../constants/shop';
import { maskPhoneNumber, showMessage } from '../../../utils';
import { useKeyboard } from '../../../hooks/useKeyboard';

const digitsOnly = value => String(value || '').replace(/\D/g, '').slice(0, 10);

const billingSchema = Yup.object().shape({
  first_name: Yup.string().trim().required('First name is required'),
  last_name: Yup.string().trim().required('Last name is required'),
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
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

/** Billing form — CSC country → state → city + cart summary */
const CheckoutBillingForm = ({
  values,
  errors,
  formErrors,
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  items,
  cart,
  loadingCart,
  countriesData,
  loadingCountries,
  paying,
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

      <View style={styles.section}>
        <Typography
          fFamily={TYPE.h2.fFamily}
          size={TYPE.h2.size}
          color={COLORS.textPrimary}
          mB={SPACING.component}
        >
          Order Items ({items.length})
        </Typography>
        {loadingCart ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : items.length === 0 ? (
          <Typography color={COLORS.textSecondary}>Your cart is empty.</Typography>
        ) : (
          <View style={styles.itemsGroup}>
            {items.map(item => (
              <View key={item.id} style={[GLOBALSTYLE.screenCard, styles.orderLine]}>
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
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                    {[item.color, item.size].filter(Boolean).join(' · ')}
                    {item.color || item.size ? ' · ' : ''}
                    Qty: {item.quantity}
                  </Typography>
                </View>
                <Typography fFamily="barlowBold700" size={TYPE.body.size} color={COLORS.primary}>
                  {formatMoney(centsToDollars(item.price) * (Number(item.quantity) || 1))}
                </Typography>
              </View>
            ))}
          </View>
        )}
      </View>

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
          <Typography fFamily={TYPE.h2.fFamily} size={TYPE.h2.size} color={COLORS.textPrimary}>
            Total
          </Typography>
          <Typography fFamily={TYPE.h2.fFamily} size={TYPE.h2.size} color={COLORS.primary}>
            {formatMoney(cart?.total)}
          </Typography>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.placeBtn, (paying || items.length === 0) && styles.placeBtnDisabled]}
        onPress={handleSubmit}
        disabled={paying || items.length === 0}
        activeOpacity={0.88}
      >
        {paying ? (
          <ActivityIndicator color={COLORS.white100} />
        ) : (
          <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.white100}>
            Place Order · {formatMoney(cart?.total)}
          </Typography>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

/** ClayMaster-App-UI `Checkout.tsx` → POST /api/checkout/place-order (Stripe payment_method) */
const CheckoutScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.app);
  const { confirmSetupIntent } = useStripe();
  const { keyboardOpen } = useKeyboard();
  const queryClient = useQueryClient();

  const { data: cart, isLoading: loadingCart } = useCustomQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });
  const items = cart?.items || [];

  const { data: countriesData = [], isLoading: loadingCountries } = useCustomQuery({
    queryKey: ['cscCountries'],
    queryFn: getCountries,
  });

  const [billing, setBilling] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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
      const ok = data?.status === 'success' || data?.status === true;
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
    on422Error: errors => setFormErrors(errors),
    onError: err => {
      showMessage({
        type: 'danger',
        message: err?.data?.message || 'Could not place order. Please try again.',
      });
    },
  });

  const { mutate: requestPaymentIntent, isPending: loadingIntent } =
    useCustomMutation({
      mutationFn: fetchPaymentIntent,
      onSuccess: data => {
        const secret = data?.client_secret;
        if (secret) {
          setClientSecret(secret);
          setModalVisible(true);
        } else {
          showMessage({
            type: 'danger',
            message: 'Unable to start payment. Please try again.',
          });
        }
      },
      onError: () => {
        showMessage({ type: 'danger', message: 'Error while starting payment.' });
      },
    });

  const startCheckout = values => {
    setFormErrors(null);
    setBilling(values);
    requestPaymentIntent();
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
      } else if (setupIntent?.paymentMethodId) {
        setModalVisible(false);
        submitOrder({
          ...billing,
          payment_method: setupIntent.paymentMethodId,
          stripe_customer_id: user?.stripe_customer_id,
        });
      }
    } catch {
      Alert.alert('Error', 'Something went wrong during payment');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const paying = loadingIntent || isProcessingPayment || placing;

  if (placedOrder) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Icon name="checkmark-circle" iconFamily="Ionicons" size={40} color="#16A34A" />
          </View>
          <Typography fFamily="barlowBold700" size={TYPE.h1.size} color={COLORS.textPrimary} mT={24}>
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
          <Typography size={TYPE.caption.size} color={COLORS.textSecondary} textAlign="center" mT={4} mB={32}>
            You'll receive a confirmation email shortly.
          </Typography>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.replace('OrdersScreen')}
            activeOpacity={0.88}
          >
            <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.white100}>
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
            <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.primary}>
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
        onBack={() => navigation.goBack()}
        showModeIndicator={false}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FormController
          initialValues={initialValues}
          validationSchema={billingSchema}
          enableReinitialize
          onSubmit={startCheckout}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <CheckoutBillingForm
              values={values}
              errors={errors}
              formErrors={formErrors}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
              setFieldValue={setFieldValue}
              items={items}
              cart={cart}
              loadingCart={loadingCart}
              countriesData={countriesData}
              loadingCountries={loadingCountries}
              paying={paying}
            />
          )}
        </FormController>
      </KeyboardAvoidingView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => !paying && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, keyboardOpen && styles.modalCardKeyboard]}>
            <Typography fFamily="barlowBold700" size={20} color={COLORS.textPrimary} mB={8}>
              Payment details
            </Typography>
            <Typography size={13} color={COLORS.textSecondary} mB={16}>
              Securely complete your order using Stripe
            </Typography>
            <CardField
              postalCodeEnabled={false}
              style={styles.cardField}
              onCardChange={setCardDetails}
            />
            <Button
              label="Pay & Place Order"
              onPress={handleConfirmPayment}
              loader={paying}
              btnStyle={{ width: '100%', marginTop: Sizer.vSize(16) }}
            />
            <TouchableOpacity
              style={styles.cancelPay}
              disabled={paying}
              onPress={() => {
                setModalVisible(false);
                setClientSecret(null);
              }}
            >
              <Typography color={COLORS.textSecondary} fFamily="barlowSemiBold600">
                Cancel
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  section: {},
  fieldRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
  },
  half: { flex: 1 },
  itemsGroup: { gap: Sizer.vSize(SPACING.component) },
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
});
