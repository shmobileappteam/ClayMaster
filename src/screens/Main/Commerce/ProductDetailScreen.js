import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import CartBadgeButton from '../../../components/shop/CartBadgeButton';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import {
  addToCart,
  getShopProduct,
} from '../../../api/shopService';
import {
  buildCartPayload,
  centsToDollars,
  findVariantBySizeColor,
  formatMoney,
  galleryImagesForVariant,
  getAvailableColorsForSize,
  getAvailableSizes,
  parseProductDescription,
} from '../../../constants/shop';
import { showMessage, showToast } from '../../../utils';

const SCREEN_W = Dimensions.get('window').width;

/**
 * Product detail flow:
 * 1) Choose in-stock size
 * 2) Choose in-stock color for that size
 * 3) Variant price + gallery
 * 4) Local qty (+/−) then Add to cart (API only on Add)
 * 5) Description above cart controls
 */
const ProductDetailScreen = ({ navigation, route }) => {
  const productId = route?.params?.id;
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useCustomQuery({
    queryKey: ['shopProduct', productId],
    queryFn: () => getShopProduct(productId),
    enabled: Boolean(productId),
  });

  const [sizeId, setSizeId] = useState(null);
  const [colorId, setColorId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  const availableSizes = useMemo(
    () => getAvailableSizes(product),
    [product],
  );

  const availableColors = useMemo(
    () => getAvailableColorsForSize(product, sizeId),
    [product, sizeId],
  );

  // Init / reset size when product loads
  useEffect(() => {
    if (!product) return;
    const sizes = getAvailableSizes(product);
    const nextSize = sizes[0]?.id ?? null;
    setSizeId(nextSize);
    const colors = getAvailableColorsForSize(product, nextSize);
    setColorId(colors[0]?.id ?? null);
    setQuantity(1);
    setImageIndex(0);
  }, [product?.id]);

  // When size changes, pick first available color for that size
  const selectSize = nextSizeId => {
    setSizeId(nextSizeId);
    const colors = getAvailableColorsForSize(product, nextSizeId);
    setColorId(prev =>
      colors.some(c => c.id === prev) ? prev : colors[0]?.id ?? null,
    );
    setQuantity(1);
    setImageIndex(0);
  };

  const selectColor = nextColorId => {
    setColorId(nextColorId);
    setQuantity(1);
    setImageIndex(0);
  };

  const variant = useMemo(
    () => findVariantBySizeColor(product, sizeId, colorId),
    [product, sizeId, colorId],
  );

  const gallery = useMemo(
    () => galleryImagesForVariant(product, variant?.id),
    [product, variant?.id],
  );

  useEffect(() => {
    setImageIndex(0);
  }, [variant?.id]);

  const description = useMemo(
    () => parseProductDescription(product?.description),
    [product?.description],
  );

  const { mutate: mutateAdd, isPending: adding } = useCustomMutation({
    mutationFn: addToCart,
    onSuccess: data => {
      if (data?.status === false) {
        showMessage({
          type: 'danger',
          message: data?.message || 'Could not add to cart.',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showToast({ title: data?.message || 'Added to cart' });
      setQuantity(1);
    },
    onError: err => {
      showMessage({
        type: 'danger',
        message: err?.data?.message || 'Could not add to cart.',
      });
    },
  });

  const handleAddToCart = () => {
    if (!variant || adding) return;
    mutateAdd(buildCartPayload(product, variant, quantity));
  };

  const goImage = dir => {
    if (!gallery.length) return;
    setImageIndex(i => (i + dir + gallery.length) % gallery.length);
  };

  const renderGallery = () => (
    <View style={styles.gallery}>
      {gallery.length ? (
        <Image
          source={{ uri: gallery[imageIndex] || gallery[0] }}
          style={styles.hero}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]}>
          <Icon
            name="shirt-outline"
            iconFamily="Ionicons"
            size={44}
            color={COLORS.textSecondary}
          />
        </View>
      )}

      {gallery.length > 1 ? (
        <>
          <TouchableOpacity
            style={[styles.navArrow, styles.navLeft]}
            onPress={() => goImage(-1)}
            activeOpacity={0.85}
          >
            <Icon name="chevron-back" iconFamily="Ionicons" size={20} color={COLORS.white100} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navArrow, styles.navRight]}
            onPress={() => goImage(1)}
            activeOpacity={0.85}
          >
            <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color={COLORS.white100} />
          </TouchableOpacity>
          <View style={styles.dots}>
            {gallery.map((_, i) => (
              <TouchableOpacity
                key={`dot-${i}`}
                onPress={() => setImageIndex(i)}
                hitSlop={6}
                style={[styles.dot, i === imageIndex && styles.dotActive]}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );

  const renderBulletSection = (title, items) => {
    if (!items?.length) return null;
    return (
      <View style={styles.descBlock}>
        <Typography fFamily="barlowSemiBold600" size={15} color={COLORS.textPrimary} mB={8}>
          {title}
        </Typography>
        {items.map((item, idx) => (
          <View key={`${title}-${idx}`} style={styles.bulletRow}>
            <Typography size={14} color={COLORS.textSecondary} style={styles.bullet}>
              •
            </Typography>
            <Typography
              size={14}
              color={COLORS.textSecondary}
              lineHeight={21}
              style={{ flex: 1 }}
            >
              {item}
            </Typography>
          </View>
        ))}
      </View>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return <ActivityIndicator color={COLORS.primary} style={{ marginTop: 48 }} />;
    }
    if (isError || !product) {
      return (
        <TouchableOpacity onPress={refetch} style={styles.centerPad}>
          <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
            Could not load product. Tap to retry.
          </Typography>
        </TouchableOpacity>
      );
    }

    const title = (product.title || '').trim();
    const canPurchase = Boolean(variant);

    return (
      <>
        {renderGallery()}

        <View style={[GLOBALSTYLE.paddingHor, styles.body]}>
          <Typography
            fFamily="barlowBold700"
            size={22}
            color={COLORS.textPrimary}
            style={styles.title}
          >
            {title.toUpperCase()}
          </Typography>

          {variant ? (
            <Typography fFamily="barlowBold700" size={26} color={COLORS.textPrimary} mT={10}>
              {formatMoney(centsToDollars(variant.price))}
            </Typography>
          ) : sizeId && colorId ? (
            <Typography size={14} color={COLORS.destructive} mT={10}>
              This combination is unavailable.
            </Typography>
          ) : (
            <Typography size={14} color={COLORS.textSecondary} mT={10}>
              Select a size and color to see price
            </Typography>
          )}

          <View style={styles.availabilityRow}>
            <Typography size={14} color={COLORS.textSecondary}>
              Availability:{' '}
            </Typography>
            <Typography
              size={14}
              fFamily="barlowSemiBold600"
              color={canPurchase ? '#16A34A' : COLORS.destructive}
            >
              {canPurchase
                ? 'In stock'
                : availableSizes.length
                  ? 'Select options'
                  : 'Out of stock'}
            </Typography>
          </View>

          <Typography
            fFamily="barlowBold700"
            size={20}
            color={COLORS.textPrimary}
            mT={22}
            mB={4}
          >
            Select options
          </Typography>

          {/* 1) Size — in-stock only, app-centric chips */}
          <View style={styles.optionBlock}>
            <Typography fFamily="barlowSemiBold600" size={15} color={COLORS.textPrimary} mB={10}>
              Size
            </Typography>
            {availableSizes.length === 0 ? (
              <Typography size={13} color={COLORS.textSecondary}>
                No sizes in stock right now.
              </Typography>
            ) : (
              <View style={styles.chipRow}>
                {availableSizes.map(value => {
                  const selected = value.id === sizeId;
                  return (
                    <TouchableOpacity
                      key={value.id}
                      style={[styles.sizeChip, selected && styles.sizeChipSelected]}
                      onPress={() => selectSize(value.id)}
                      activeOpacity={0.88}
                    >
                      <Typography
                        size={12}
                        color={selected ? COLORS.primary : COLORS.textPrimary}
                        fFamily={selected ? 'barlowSemiBold600' : 'barlowMedium500'}
                      >
                        {value.title}
                      </Typography>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* 2) Color — in-stock for selected size */}
          {sizeId ? (
            <View style={styles.optionBlock}>
              <Typography fFamily="barlowSemiBold600" size={15} color={COLORS.textPrimary} mB={10}>
                Color
              </Typography>
              {availableColors.length === 0 ? (
                <Typography size={13} color={COLORS.textSecondary}>
                  No colors in stock for this size.
                </Typography>
              ) : (
                <View style={styles.swatchRow}>
                  {availableColors.map(value => {
                    const selected = value.id === colorId;
                    const hex = value.colors?.[0] || COLORS.surfaceMuted;
                    return (
                      <TouchableOpacity
                        key={value.id}
                        style={[styles.swatchOuter, selected && styles.swatchOuterSelected]}
                        onPress={() => selectColor(value.id)}
                        activeOpacity={0.88}
                        accessibilityLabel={value.title}
                      >
                        <View style={[styles.swatchInner, { backgroundColor: hex }]} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              {colorId && availableColors.find(c => c.id === colorId)?.title ? (
                <Typography size={12} color={COLORS.textSecondary} mT={8}>
                  {availableColors.find(c => c.id === colorId).title}
                </Typography>
              ) : null}
            </View>
          ) : null}

          {/* 3) Description */}
          <View style={styles.descSection}>
            <Typography
              fFamily="barlowBold700"
              size={18}
              color={COLORS.textPrimary}
              mB={10}
            >
              Description
            </Typography>
            {description.intro ? (
              <Typography size={14} color={COLORS.textSecondary} lineHeight={22} mB={12}>
                {description.intro}
              </Typography>
            ) : null}
            {renderBulletSection('Product Features', description.features)}
            {renderBulletSection('Care Instructions', description.care)}
            {!description.intro &&
            !description.features.length &&
            !description.care.length ? (
              <Typography size={14} color={COLORS.textSecondary}>
                No description available.
              </Typography>
            ) : null}
          </View>

          {/* 4) Local qty + Add to cart (API only on button) */}
          <View style={styles.cartSection}>
            <View style={styles.purchaseRow}>
              <View style={[styles.qtyBox, !canPurchase && styles.qtyBoxDisabled]}>
                <TouchableOpacity
                  style={styles.qtyHit}
                  onPress={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={!canPurchase || quantity <= 1}
                  hitSlop={8}
                >
                  <Icon
                    name="remove"
                    iconFamily="Ionicons"
                    size={18}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={16}
                  color={COLORS.textPrimary}
                  style={styles.qtyValue}
                >
                  {quantity}
                </Typography>
                <TouchableOpacity
                  style={[styles.qtyHit, styles.qtyHitFill]}
                  onPress={() => setQuantity(q => q + 1)}
                  disabled={!canPurchase}
                  hitSlop={8}
                >
                  <Icon name="add" iconFamily="Ionicons" size={18} color={COLORS.white100} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.addBtn,
                  (!canPurchase || adding) && styles.addBtnDisabled,
                ]}
                onPress={handleAddToCart}
                disabled={!canPurchase || adding}
                activeOpacity={0.88}
              >
                {adding ? (
                  <ActivityIndicator color={COLORS.white100} />
                ) : (
                  <Typography fFamily="barlowSemiBold600" size={15} color={COLORS.white100}>
                    Add to cart
                  </Typography>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Product"
        showBack
        showNotification={false}
        showModeIndicator={false}
        onBack={() => navigation.goBack()}
        rightSlot={
          <CartBadgeButton onPress={() => navigation.navigate('CartScreen')} />
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>{renderBody()}</ScrollView>
    </Container>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  gallery: {
    width: SCREEN_W,
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceMuted,
    position: 'relative',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLeft: { left: 12 },
  navRight: { right: 12 },
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  dot: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  body: {
    paddingTop: Sizer.vSize(18),
    paddingBottom: Sizer.vSize(48),
  },
  title: {
    letterSpacing: 0.3,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(10),
  },
  centerPad: {
    padding: Sizer.hSize(24),
    alignItems: 'center',
  },
  optionBlock: {
    marginTop: Sizer.vSize(18),
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(6),
  },
  sizeChip: {
    minWidth: Sizer.hSize(36),
    height: Sizer.vSize(32),
    paddingHorizontal: Sizer.hSize(10),
    borderRadius: Sizer.hSize(8),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(12),
    alignItems: 'center',
  },
  swatchOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchOuterSelected: {
    borderColor: COLORS.primary,
  },
  swatchInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
  },
  descSection: {
    marginTop: Sizer.vSize(24),
    paddingTop: Sizer.vSize(20),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
  },
  cartSection: {
    marginTop: Sizer.vSize(24),
  },
  purchaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Sizer.vSize(48),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.surface,
    paddingHorizontal: Sizer.hSize(4),
    gap: Sizer.hSize(4),
  },
  qtyBoxDisabled: {
    opacity: 0.5,
  },
  qtyHit: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.surface,
  },
  qtyHitFill: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  qtyValue: {
    minWidth: Sizer.hSize(28),
    textAlign: 'center',
  },
  addBtn: {
    flex: 1,
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    opacity: 0.55,
  },
  descBlock: {
    marginBottom: Sizer.vSize(14),
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Sizer.vSize(4),
    paddingRight: 4,
  },
  bullet: {
    width: 14,
    marginTop: 1,
  },
});
