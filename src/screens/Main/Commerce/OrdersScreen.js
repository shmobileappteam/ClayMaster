import React from 'react';
import {
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
import { getOrders } from '../../../api/shopService';
import {
  ORDER_STATUS_COLORS,
  formatMoney,
  formatOrderDate,
} from '../../../constants/shop';

/** ClayMaster-App-UI `OrderHistory.tsx` → GET /api/orders */
const OrdersScreen = ({ navigation }) => {
  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const orders = data?.items || [];

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Orders"
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
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load orders. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : orders.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="cube-outline" iconFamily="Ionicons" size={40} color={COLORS.textSecondary} />
            <Typography color={COLORS.textSecondary} mT={12}>
              No orders yet.
            </Typography>
          </View>
        ) : (
          orders.map(order => {
            const statusColor =
              ORDER_STATUS_COLORS[order.order_status_label] || COLORS.textSecondary;
            return (
              <TouchableOpacity
                key={order.id}
                style={[GLOBALSTYLE.screenCard, styles.orderCard]}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate('OrderDetailScreen', { id: order.id })
                }
              >
                <View style={styles.orderIcon}>
                  <Icon name="cube-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
                </View>
                <View style={styles.orderBody}>
                  <View style={styles.orderTop}>
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={TYPE.body.size}
                      color={COLORS.textPrimary}
                      style={{ flex: 1, paddingRight: 8 }}
                      numberOfLines={1}
                    >
                      {order.order_number}
                    </Typography>
                    <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.primary}>
                      {formatMoney(order.total)}
                    </Typography>
                  </View>
                  <View style={styles.orderBottom}>
                    <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                      {formatOrderDate(order.created_at)}
                    </Typography>
                    <Typography
                      size={TYPE.caption.size}
                      color={statusColor}
                      fFamily="barlowMedium500"
                    >
                      {order.order_status_label || '—'}
                    </Typography>
                  </View>
                </View>
                <Icon name="chevron-forward" iconFamily="Ionicons" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </Container>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Sizer.vSize(48),
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.hSize(12),
    ...SHADOWS.card,
  },
  orderIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBody: { flex: 1 },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizer.vSize(4),
  },
});
