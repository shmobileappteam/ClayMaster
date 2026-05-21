import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { clearCart } from '../../../redux/slices/cartSlice';
import {
  formatPrice,
  resolveProductImage,
} from '../../../utils/shopHelpers';
const SHIPPING = 5;

/**
 * ClayMaster-App-UI `Checkout.tsx`
 */
const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const [placed, setPlaced] = useState(false);

  const tax = 0;
  const total = totalAmount + SHIPPING + tax;

  const handlePlaceOrder = () => {
    dispatch(clearCart());
    setPlaced(true);
  };

  if (placed) {
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
            Your order #CM-2075 has been placed successfully.
          </Typography>
          <Typography size={TYPE.caption.size} color={COLORS.textSecondary} textAlign="center" mT={4} mB={32}>
            You'll receive a confirmation email shortly.
          </Typography>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('OrdersScreen')}
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
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Typography
            fFamily={TYPE.h2.fFamily}
            size={TYPE.h2.size}
            color={COLORS.textPrimary}
            mB={SPACING.component}
          >
            Shipping Address
          </Typography>
          <View style={[GLOBALSTYLE.screenCard, styles.addressCard]}>
            <View style={styles.iconCircle}>
              <Icon name="location-outline" iconFamily="Ionicons" size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                John Smith
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                123 Shooting Range Rd
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                Dallas, TX 75201
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                +1 (555) 123-4567
              </Typography>
            </View>
            <TouchableOpacity>
              <Typography size={TYPE.caption.size} color={COLORS.primary} fFamily="barlowMedium500">
                Edit
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Typography
            fFamily={TYPE.h2.fFamily}
            size={TYPE.h2.size}
            color={COLORS.textPrimary}
            mB={SPACING.component}
          >
            Payment Method
          </Typography>
          <View style={[GLOBALSTYLE.screenCard, styles.addressCard]}>
            <View style={styles.iconCircle}>
              <Icon name="card-outline" iconFamily="Ionicons" size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                •••• •••• •••• 4242
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                Visa · Expires 08/28
              </Typography>
            </View>
            <TouchableOpacity>
              <Typography size={TYPE.caption.size} color={COLORS.primary} fFamily="barlowMedium500">
                Edit
              </Typography>
            </TouchableOpacity>
          </View>
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
          <View style={styles.itemsGroup}>
            {items.map(item => (
              <View key={item.id} style={[GLOBALSTYLE.screenCard, styles.orderLine]}>
                {resolveProductImage(item.image) ? (
                  <Image
                    source={resolveProductImage(item.image)}
                    style={styles.orderThumb}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.orderThumb, styles.thumbPlaceholder]} />
                )}
                <View style={{ flex: 1 }}>
                  <Typography fFamily="barlowMedium500" size={TYPE.body.size} color={COLORS.textPrimary}>
                    {item.name}
                  </Typography>
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                    Qty: {item.quantity}
                  </Typography>
                </View>
                <Typography fFamily="barlowBold700" size={TYPE.body.size} color={COLORS.primary}>
                  {formatPrice(item.price * item.quantity)}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <View style={[GLOBALSTYLE.screenCard, styles.summary]}>
          <View style={styles.summaryRow}>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary}>Subtotal</Typography>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
              {formatPrice(totalAmount)}
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary}>Shipping</Typography>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
              {formatPrice(SHIPPING)}
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary}>Tax</Typography>
            <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
              {formatPrice(tax)}
            </Typography>
          </View>
          <View style={styles.summaryTotal}>
            <Typography fFamily={TYPE.h2.fFamily} size={TYPE.h2.size} color={COLORS.textPrimary}>
              Total
            </Typography>
            <Typography fFamily={TYPE.h2.fFamily} size={TYPE.h2.size} color={COLORS.primary}>
              {formatPrice(total)}
            </Typography>
          </View>
        </View>

        <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder} activeOpacity={0.88}>
          <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.white100}>
            Place Order · {formatPrice(total)}
          </Typography>
        </TouchableOpacity>
      </ScrollView>
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
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  iconCircle: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
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
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
