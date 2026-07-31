import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import CartBadgeButton from '../../../components/shop/CartBadgeButton';
import Icon from '../../../helpers/Icon';
import { COLORS, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getShopProducts } from '../../../api/shopService';
import { formatMoney, mapProductCard } from '../../../constants/shop';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';

/** ClayMaster-App-UI `Shop.tsx` → GET /api/shop/products */
const ShopScreen = ({ navigation }) => {
  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['shopProducts'],
    queryFn: getShopProducts,
  });

  const products = useMemo(
    () => (data?.items || []).map(mapProductCard).filter(Boolean),
    [data?.items],
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Shop"
        rightSlot={
          <CartBadgeButton
            onPress={() => navigateFromTabToStack(navigation, 'CartScreen')}
          />
        }
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 32 }} />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load products. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : products.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="bag-outline" iconFamily="Ionicons" size={40} color={COLORS.textSecondary} />
            <Typography color={COLORS.textSecondary} mT={12}>
              No products available yet.
            </Typography>
          </View>
        ) : (
          <View style={styles.grid}>
            {products.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                activeOpacity={0.88}
                onPress={() =>
                  navigateFromTabToStack(navigation, 'ProductDetailScreen', {
                    id: product.id,
                  })
                }
              >
                <View style={styles.imageWrap}>
                  {product.image ? (
                    <Image
                      source={{ uri: product.image }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Icon name="shirt-outline" iconFamily="Ionicons" size={28} color={COLORS.textSecondary} />
                    </View>
                  )}
                </View>
                <View style={styles.productInfo}>
                  <Typography
                    fFamily="barlowMedium500"
                    size={14}
                    color={COLORS.textPrimary}
                    numberOfLines={2}
                  >
                    {product.title}
                  </Typography>
                  {product.priceFrom != null ? (
                    <Typography fFamily="barlowBold700" size={14} color={COLORS.primary} mT={4}>
                      {formatMoney(product.priceFrom)}
                    </Typography>
                  ) : null}
                </View>
                <View style={styles.cartRow}>
                  <View style={styles.viewBtn}>
                    <Typography fFamily="barlowSemiBold600" size={12} color={COLORS.white100}>
                      View Details
                    </Typography>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    paddingHorizontal: Sizer.hSize(12),
    paddingTop: Sizer.vSize(12),
  },
  cartRow: {
    padding: Sizer.hSize(12),
    paddingTop: Sizer.vSize(8),
  },
  viewBtn: {
    height: Sizer.vSize(32),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Sizer.vSize(48),
  },
});
