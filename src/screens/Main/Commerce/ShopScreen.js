import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { SHOP_PRODUCTS } from '../../../constants/shopProducts';
import { COLORS, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { addToCart } from '../../../redux/slices/cartSlice';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';
import { showToast } from '../../../utils';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `Shop.tsx`
 * Header + cart badge, 2-col product grid (4 products), Add to Cart per item
 */
const ShopScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { totalItems } = useSelector(state => state.cart || { totalItems: 0 });

  const cartBadge = (
    <TouchableOpacity
      onPress={() => navigateFromTabToStack(navigation, 'CartScreen')}
      style={styles.cartBtn}
      activeOpacity={0.88}
    >
      <Icon name="cart-outline" iconFamily="Ionicons" size={22} color={COLORS.textPrimary} />
      {totalItems > 0 ? (
        <View style={styles.badge}>
          <Typography size={10} color={COLORS.white100} fFamily="barlowBold700">
            {totalItems}
          </Typography>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Shop" rightSlot={cartBadge} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {SHOP_PRODUCTS.map(product => (
            <View key={product.id} style={styles.productCard}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() =>
                  navigateFromTabToStack(navigation, 'ProductDetailScreen', {
                    id: product.id,
                  })
                }
              >
                <View style={styles.imageWrap}>
                  <Image source={product.image} style={styles.image} resizeMode="cover" />
                </View>
                <View style={styles.productInfo}>
                  <Typography fFamily="barlowMedium500" size={14} color={COLORS.textPrimary}>
                    {product.name}
                  </Typography>
                  <Typography fFamily="barlowBold700" size={14} color={COLORS.primary} mT={4}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </View>
              </TouchableOpacity>
              <View style={styles.cartRow}>
                <TouchableOpacity
                  style={styles.addBtn}
                  activeOpacity={0.88}
                  onPress={() => {
                    dispatch(
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      }),
                    );
                    showToast({ title: 'Added to cart' });
                  }}
                >
                  <Typography fFamily="barlowSemiBold600" size={12} color={COLORS.white100}>
                    Add to Cart
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(SPACING.component),
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    paddingHorizontal: Sizer.hSize(12),
    paddingTop: Sizer.vSize(12),
  },
  cartRow: {
    padding: Sizer.hSize(12),
    paddingTop: Sizer.vSize(8),
  },
  addBtn: {
    height: Sizer.vSize(32),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
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
