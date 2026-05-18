import React from 'react';
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
import { Button } from '../../../components';
import Icon from '../../../helpers/Icon';
import { shopCap, shopGlasses } from '../../../assets/images';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { addToCart } from '../../../redux/slices/cartSlice';
import { showMessage } from '../../../utils';

const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'ClayMaster Cap',
    price: 25,
    image: shopCap,
    desc: 'Premium quality cap with embroidered ClayMaster logo. Adjustable strap, breathable mesh back. Perfect for range days and competitions.',
  },
  {
    id: 2,
    name: 'Shooting Glasses',
    price: 45,
    image: shopGlasses,
    desc: 'High-contrast polycarbonate lenses with UV400 protection. Lightweight frame with anti-slip nose pads for all-day comfort.',
  },
  {
    id: 3,
    name: 'Training Manual',
    price: 35,
    image: shopCap,
    desc: 'Comprehensive 120-page training guide covering stance, mount, lead methods, and competition strategy by Kevin DeMichiel.',
  },
  {
    id: 4,
    name: 'Shell Pouch',
    price: 30,
    image: shopGlasses,
    desc: 'Durable canvas shell pouch with belt clip. Holds 50+ shells. Water-resistant lining.',
  },
];

const ProductDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { totalItems } = useSelector(state => state.cart || { totalItems: 0 });
  const productId = route?.params?.id ?? 1;
  const product =
    ALL_PRODUCTS.find(p => p.id === Number(productId)) || ALL_PRODUCTS[0];

  const cartBadge = (
    <TouchableOpacity
      onPress={() => navigation.navigate('CartScreen')}
      style={styles.cartBtn}
    >
      <Icon
        name="cart-outline"
        iconFamily="Ionicons"
        size={22}
        color={COLORS.textPrimary}
      />
      {totalItems > 0 ? (
        <View style={styles.badge}>
          <Typography size={10} color={COLORS.white100} fFamily="barlowBold700">
            {totalItems}
          </Typography>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  const addItem = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: `$${product.price.toFixed(2)}`,
        image: product.image,
      }),
    );
    showMessage({
      type: 'success',
      message: 'Added to cart',
      bgColor: COLORS.primary,
      color: COLORS.white100,
    });
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Product"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
        rightSlot={cartBadge}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={product.image} style={styles.hero} resizeMode="cover" />
        <View style={[GLOBALSTYLE.paddingHor, styles.body]}>
          <Typography fFamily="barlowBold700" size={24} color={COLORS.textPrimary}>
            {product.name}
          </Typography>
          <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.primary} mT={8}>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography size={14} color={COLORS.textSecondary} lineHeight={22} mT={16}>
            {product.desc}
          </Typography>
          <View style={styles.actions}>
            <Button
              label="Add to Cart"
              onPress={addItem}
              icon={
                <Icon
                  name="cart-outline"
                  iconFamily="Ionicons"
                  size={18}
                  color={COLORS.white100}
                />
              }
              btnStyle={{ flex: 1, height: Sizer.vSize(48) }}
            />
            <Button
              label="Buy Now"
              type="secondary"
              onPress={() => {
                addItem();
                navigation.navigate('CheckoutScreen');
              }}
              textColor={COLORS.primary}
              bgColor={COLORS.surface}
              btnStyle={{
                flex: 1,
                height: Sizer.vSize(48),
                borderWidth: 1,
                borderColor: COLORS.primary,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceMuted,
  },
  body: {
    paddingVertical: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  actions: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
    marginTop: Sizer.vSize(24),
  },
  cartBtn: {
    position: 'relative',
    padding: Sizer.hSize(4),
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
