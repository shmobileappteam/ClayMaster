import React from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
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
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import {
  getCart,
  removeCartItem,
  updateCartItem,
} from '../../../api/shopService';
import { centsToDollars, formatMoney } from '../../../constants/shop';
import { navigateFromTabToTab } from '../../../navigation/navigationHelpers';
import { showMessage } from '../../../utils';

/** ClayMaster-App-UI `Cart.tsx` → GET /api/cart + cart/update + cart/{variant_id} */
const CartScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const items = data?.items || [];

  const refreshCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const { mutate: mutateQuantity, isPending: updating } = useCustomMutation({
    mutationFn: updateCartItem,
    onSuccess: res => {
      if (res?.status === false) {
        showMessage({ type: 'danger', message: res?.message || 'Could not update cart.' });
      }
      refreshCart();
    },
    onError: err => {
      showMessage({
        type: 'danger',
        message: err?.data?.message || 'Could not update cart.',
      });
    },
  });

  const { mutate: mutateRemove, isPending: removing } = useCustomMutation({
    mutationFn: removeCartItem,
    onSuccess: res => {
      if (res?.status === false) {
        showMessage({ type: 'danger', message: res?.message || 'Could not remove item.' });
      }
      refreshCart();
    },
    onError: err => {
      showMessage({
        type: 'danger',
        message: err?.data?.message || 'Could not remove item.',
      });
    },
  });

  const busy = updating || removing;

  const changeQty = (item, qty) => {
    if (busy) return;
    if (qty <= 0) {
      mutateRemove(item.variant_id);
      return;
    }
    mutateQuantity({ variant_id: item.variant_id, quantity: qty });
  };

  const header = (
    <LibraryHeader
      title="My Cart"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
  );

  if (isLoading) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        {header}
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 48 }} />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        {header}
        <TouchableOpacity onPress={refetch} style={styles.centerPad}>
          <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
            Could not load cart. Tap to retry.
          </Typography>
        </TouchableOpacity>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        {header}
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Icon name="bag-outline" iconFamily="Ionicons" size={28} color={COLORS.primary} />
          </View>
          <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.textPrimary}>
            Your cart is empty
          </Typography>
          <Typography size={TYPE.body.size} color={COLORS.textSecondary} mT={4} mB={24}>
            Browse the shop and add items
          </Typography>
          <TouchableOpacity
            style={styles.goShopBtn}
            onPress={() => navigateFromTabToTab(navigation, 'Shop')}
            activeOpacity={0.88}
          >
            <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.white100}>
              Go to Shop
            </Typography>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      {header}
      <View style={styles.flex}>
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
          {items.map(item => (
            <View key={item.id} style={[GLOBALSTYLE.screenCard, styles.lineItem]}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="cover" />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Icon name="shirt-outline" iconFamily="Ionicons" size={24} color={COLORS.textSecondary} />
                </View>
              )}
              <View style={styles.lineBody}>
                <View style={styles.lineTop}>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                    style={{ flex: 1, paddingRight: 8 }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Typography>
                  <TouchableOpacity
                    onPress={() => !busy && mutateRemove(item.variant_id)}
                    hitSlop={8}
                  >
                    <Icon name="trash-outline" iconFamily="Ionicons" size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>
                {item.size || item.color ? (
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                    {[item.color, item.size].filter(Boolean).join(' · ')}
                  </Typography>
                ) : null}
                <Typography fFamily="barlowBold700" size={TYPE.body.size} color={COLORS.primary} mT={4}>
                  {formatMoney(centsToDollars(item.price))}
                </Typography>
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtnOutline}
                    onPress={() => changeQty(item, Number(item.quantity) - 1)}
                  >
                    <Icon name="remove" iconFamily="Ionicons" size={14} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                    style={styles.qtyValue}
                  >
                    {item.quantity}
                  </Typography>
                  <TouchableOpacity
                    style={styles.qtyBtnFill}
                    onPress={() => changeQty(item, Number(item.quantity) + 1)}
                  >
                    <Icon name="add" iconFamily="Ionicons" size={14} color={COLORS.white100} />
                  </TouchableOpacity>
                  {busy ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={[GLOBALSTYLE.screenCard, styles.summary]}>
            <View style={styles.summaryRow}>
              <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
                Subtotal
              </Typography>
              <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
                {formatMoney(data?.subtotal)}
              </Typography>
            </View>
            {data?.discount ? (
              <View style={styles.summaryRow}>
                <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
                  Annual Subscriber Credit
                </Typography>
                <Typography size={TYPE.body.size} color={COLORS.primary}>
                  -{formatMoney(data.discount)}
                </Typography>
              </View>
            ) : null}
            <View style={styles.summaryTotal}>
              <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.textPrimary}>
                Total
              </Typography>
              <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.textPrimary}>
                {formatMoney(data?.total)}
              </Typography>
            </View>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('CheckoutScreen')}
            activeOpacity={0.88}
          >
            <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.white100}>
              Proceed to Checkout
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(16),
    gap: Sizer.vSize(SPACING.component),
  },
  centerPad: {
    padding: Sizer.hSize(24),
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(80),
  },
  emptyIcon: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(16),
  },
  goShopBtn: {
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(32),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineItem: {
    flexDirection: 'row',
    padding: Sizer.hSize(12),
    gap: Sizer.hSize(12),
    ...SHADOWS.card,
  },
  thumb: {
    width: Sizer.hSize(80),
    height: Sizer.hSize(80),
    borderRadius: Sizer.hSize(12),
  },
  thumbPlaceholder: {
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineBody: { flex: 1 },
  lineTop: { flexDirection: 'row', alignItems: 'flex-start' },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginTop: Sizer.vSize(8),
  },
  qtyBtnOutline: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  qtyBtnFill: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    minWidth: Sizer.hSize(24),
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(24),
    gap: Sizer.vSize(12),
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
  checkoutBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
