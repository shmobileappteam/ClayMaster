import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { useCustomQuery } from '../../query/useCustomQuery';
import { getCart } from '../../api/shopService';

/** Cart icon + server cart quantity badge (query ['cart']). */
const CartBadgeButton = ({ onPress }) => {
  const { data } = useCustomQuery({ queryKey: ['cart'], queryFn: getCart });
  const count = (data?.items || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.cartBtn} activeOpacity={0.88}>
      <Icon name="cart-outline" iconFamily="Ionicons" size={22} color={COLORS.textPrimary} />
      {count > 0 ? (
        <View style={styles.badge}>
          <Typography size={10} color={COLORS.white100} fFamily="barlowBold700">
            {count}
          </Typography>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default CartBadgeButton;

const styles = StyleSheet.create({
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
