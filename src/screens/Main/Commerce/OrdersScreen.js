import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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

/** ClayMaster-App-UI `OrderHistory.tsx` */
const ORDERS = [
  { id: '#CM-2061', date: 'Apr 3, 2026', total: '$25.00', status: 'Shipped', items: 'ClayMaster Cap' },
  { id: '#CM-2058', date: 'Mar 20, 2026', total: '$45.00', status: 'Delivered', items: 'Shooting Glasses' },
  { id: '#CM-2045', date: 'Mar 5, 2026', total: '$35.00', status: 'Delivered', items: 'Training Manual' },
  { id: '#CM-2032', date: 'Feb 18, 2026', total: '$30.00', status: 'Delivered', items: 'Shell Pouch' },
];

const OrdersScreen = ({ navigation }) => (
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
    >
      {ORDERS.map(order => (
        <TouchableOpacity
          key={order.id}
          style={[GLOBALSTYLE.screenCard, styles.orderCard]}
          activeOpacity={0.88}
        >
          <View style={styles.orderIcon}>
            <Icon name="cube-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.orderBody}>
            <View style={styles.orderTop}>
              <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                {order.items}
              </Typography>
              <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.primary}>
                {order.total}
              </Typography>
            </View>
            <View style={styles.orderBottom}>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                {order.id} · {order.date}
              </Typography>
              <Typography
                size={TYPE.caption.size}
                color={order.status === 'Shipped' ? COLORS.primary : COLORS.textSecondary}
                fFamily="barlowMedium500"
              >
                {order.status}
              </Typography>
            </View>
          </View>
          <Icon name="chevron-forward" iconFamily="Ionicons" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  </Container>
);

export default OrdersScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
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
