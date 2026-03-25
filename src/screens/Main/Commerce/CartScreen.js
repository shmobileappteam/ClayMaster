import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, Button } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import { removeFromCart, updateQuantity } from '../../../redux/slices/cartSlice';

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);

  const handleUpdateQuantity = (id, currentQty, delta) => {
    const newQty = Math.max(1, currentQty + delta);
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  if (items.length === 0) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        <Header type="app" title="My Cart" isBackVisible={true} onPresBack={() => navigation.goBack()} />
        <Flex direction="column" algItems="center" jusContent="center" style={{ flex: 1, paddingHorizontal: 40 }}>
          <Icon name="cart-outline" iconFamily="Ionicons" size={100} color={COLORS.grey100} />
          <Typography size={18} fFamily="barlowBold700" color={COLORS.black300} mT={24}>Your cart is empty</Typography>
          <Typography size={14} color={COLORS.textMuted} textAlign="center" mT={8}>Add some items to your cart to see them here.</Typography>
          <Button 
            label="GO SHOPPING" 
            mt={32} 
            onPress={() => navigation.goBack()} 
            btnStyle={{ width: '100%' }}
          />
        </Flex>
      </Container>
    );
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="My Cart" isBackVisible={true} onPresBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={[GLOBALSTYLE.paddingHor, { marginTop: 20 }]}>
          {items.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemImg}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                ) : (
                  <Icon name="shirt-outline" iconFamily="Ionicons" size={24} color={COLORS.grey600} />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Typography fFamily="barlowBold700" size={14} color={COLORS.black300}>{item.name}</Typography>
                <Typography size={13} color={COLORS.primary} fFamily="barlowBold700" mT={4}>{item.price}</Typography>
                
                <Flex direction="row" algItems="center" jusContent="space-between" mT={12}>
                  <View style={styles.qtyControl}>
                    <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)} style={styles.qtyBtn}>
                      <Icon name="remove" iconFamily="Ionicons" size={16} />
                    </TouchableOpacity>
                    <Typography size={14} fFamily="barlowBold700" style={{ marginHorizontal: 12 }}>{item.quantity}</Typography>
                    <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)} style={styles.qtyBtn}>
                      <Icon name="add" iconFamily="Ionicons" size={16} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                    <Icon name="trash-outline" iconFamily="Ionicons" size={18} color={COLORS.red300} />
                  </TouchableOpacity>
                </Flex>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <Flex direction="row" jusContent="space-between" algItems="center">
            <Typography size={16}>Subtotal</Typography>
            <Typography size={18} fFamily="barlowBold700" color={COLORS.black300}>${totalAmount.toFixed(2)}</Typography>
          </Flex>
          <Typography size={12} color={COLORS.textMuted} mT={8}>Taxes and shipping calculated at checkout</Typography>
          
          <Button 
            label="CHECKOUT NOW" 
            mt={24} 
            onPress={() => navigation.navigate('CheckoutScreen')} 
            btnStyle={{ width: '100%' }}
            icon={<Icon name="lock-closed" iconFamily="Ionicons" color={COLORS.white100} size={18} />}
            iconGap={10}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  itemImg: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white100,
    borderRadius: 6,
    ...SHADOWS.card,
  },
  summaryBox: {
    marginTop: 20,
    padding: 24,
    backgroundColor: COLORS.white100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...SHADOWS.banner,
  }
});

export default CartScreen;
