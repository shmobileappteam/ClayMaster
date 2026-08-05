import React from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography, AppLoader } from '../../../atomComponents';
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
import { getOrder } from '../../../api/shopService';
import {
  ORDER_STATUS_COLORS,
  formatMoney,
  formatOrderDate,
} from '../../../constants/shop';

/** GET /api/orders/{id} — billing + items */
const OrderDetailScreen = ({ navigation, route }) => {
  const orderId = route?.params?.id;

  const { data: order, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId),
  });

  const billing = order?.billing;
  const items = order?.items || [];
  const statusColor =
    ORDER_STATUS_COLORS[order?.order_status_label] || COLORS.textSecondary;

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Order Details"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
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
          <AppLoader />
        ) : isError || !order ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load order. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : (
          <>
            <View style={[GLOBALSTYLE.screenCard, styles.headerCard]}>
              <View style={styles.headerTop}>
                <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                  {order.order_number}
                </Typography>
                <View style={[styles.statusBadge, { backgroundColor: `${statusColor}18` }]}>
                  <Typography size={TYPE.caption.size} color={statusColor} fFamily="barlowMedium500">
                    {order.order_status_label || '—'}
                  </Typography>
                </View>
              </View>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={4}>
                Placed {formatOrderDate(order.created_at)}
              </Typography>
              {order.transaction_id ? (
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                  Transaction: {order.transaction_id}
                </Typography>
              ) : null}
            </View>

            <View style={styles.section}>
              <Typography
                fFamily={TYPE.h2.fFamily}
                size={TYPE.h2.size}
                color={COLORS.textPrimary}
                mB={SPACING.component}
              >
                Items ({items.length})
              </Typography>
              <View style={styles.itemsGroup}>
                {items.map(item => (
                  <View key={item.id} style={[GLOBALSTYLE.screenCard, styles.orderLine]}>
                    {item.image ? (
                      <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="cover" />
                    ) : (
                      <View style={[styles.thumb, styles.thumbPlaceholder]}>
                        <Icon name="shirt-outline" iconFamily="Ionicons" size={22} color={COLORS.textSecondary} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Typography
                        fFamily="barlowMedium500"
                        size={TYPE.body.size}
                        color={COLORS.textPrimary}
                        numberOfLines={2}
                      >
                        {item.name}
                      </Typography>
                      <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                        {[item.color, item.size].filter(Boolean).join(' · ')}
                        {item.color || item.size ? ' · ' : ''}
                        Qty: {item.quantity}
                      </Typography>
                    </View>
                    <Typography fFamily="barlowBold700" size={TYPE.body.size} color={COLORS.primary}>
                      {formatMoney(Number(item.price) * (Number(item.quantity) || 1))}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>

            {billing ? (
              <View style={styles.section}>
                <Typography
                  fFamily={TYPE.h2.fFamily}
                  size={TYPE.h2.size}
                  color={COLORS.textPrimary}
                  mB={SPACING.component}
                >
                  Billing
                </Typography>
                <View style={[GLOBALSTYLE.screenCard, styles.billingCard]}>
                  <View style={styles.iconCircle}>
                    <Icon name="location-outline" iconFamily="Ionicons" size={18} color={COLORS.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                      {[billing.first_name, billing.last_name].filter(Boolean).join(' ')}
                    </Typography>
                    <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                      {[billing.address1, billing.address2].filter(Boolean).join(', ')}
                    </Typography>
                    <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                      {[billing.city, billing.state, billing.zip, billing.country]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                    {billing.contact ? (
                      <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                        {billing.contact}
                      </Typography>
                    ) : null}
                    {billing.email ? (
                      <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                        {billing.email}
                      </Typography>
                    ) : null}
                  </View>
                </View>
              </View>
            ) : null}

            <View style={[GLOBALSTYLE.screenCard, styles.summary]}>
              <View style={styles.summaryRow}>
                <Typography size={TYPE.body.size} color={COLORS.textSecondary}>Subtotal</Typography>
                <Typography size={TYPE.body.size} color={COLORS.textSecondary}>
                  {formatMoney(order.subtotal)}
                </Typography>
              </View>
              <View style={styles.summaryTotal}>
                <Typography fFamily={TYPE.h2.fFamily} size={TYPE.h2.size} color={COLORS.textPrimary}>
                  Total
                </Typography>
                <Typography fFamily={TYPE.h2.fFamily} size={TYPE.h2.size} color={COLORS.primary}>
                  {formatMoney(order.total)}
                </Typography>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  headerCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(20),
  },
  section: {},
  itemsGroup: { gap: Sizer.vSize(SPACING.component) },
  orderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    padding: Sizer.hSize(12),
    ...SHADOWS.card,
  },
  thumb: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: Sizer.hSize(12),
  },
  thumbPlaceholder: {
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingCard: {
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
});
