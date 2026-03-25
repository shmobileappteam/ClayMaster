import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, Button, TextField } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import { clearCart } from '../../../redux/slices/cartSlice';

const CheckoutScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.app);

  const [shippingInfo, setShippingInfo] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    address: user?.address_1 || '',
    city: '',
    zip: '',
    phone: user?.contact || '',
  });

  const [successVisible, setSuccessVisible] = useState(false);

  const handlePlaceOrder = () => {
    // Logic for placing order (simulated)
    setSuccessVisible(true);
    setTimeout(() => {
        setSuccessVisible(false);
        dispatch(clearCart());
        navigation.navigate('OrdersScreen');
    }, 2500);
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="Checkout" isBackVisible={true} onPresBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[GLOBALSTYLE.paddingHor, { marginTop: 20 }]}>
          <Typography fFamily="barlowBold700" size={16} mB={16}>SHIPPING INFORMATION</Typography>
          <View style={styles.sectionCard}>
            <TextField label="Full Name" placeholder="John Doe" value={shippingInfo.name} />
            <TextField label="Shipping Address" placeholder="123 Street Ave" value={shippingInfo.address} mT={12} />
            <Flex direction="row" gap={12} mT={12}>
                <View style={{ flex: 1.5 }}><TextField label="City" placeholder="City" /></View>
                <View style={{ flex: 1 }}><TextField label="ZIP Code" placeholder="00000" /></View>
            </Flex>
          </View>

          <Typography fFamily="barlowBold700" size={16} mT={32} mB={16}>ORDER SUMMARY</Typography>
          <View style={styles.sectionCard}>
            {items.map(item => (
                <Flex key={item.id} direction="row" algItems="center" jusContent="space-between" mB={12}>
                    <Typography size={14} color={COLORS.black400}>{item.name} x {item.quantity}</Typography>
                    <Typography size={14} fFamily="barlowBold700" color={COLORS.black300}>${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</Typography>
                </Flex>
            ))}
            <View style={styles.divider} />
            <Flex direction="row" jusContent="space-between" algItems="center">
                <Typography size={16} fFamily="barlowBold700">TOTAL AMOUNT</Typography>
                <Typography size={22} fFamily="barlowBold700" color={COLORS.primary}>${totalAmount.toFixed(2)}</Typography>
            </Flex>
          </View>

          <View style={styles.shippingNotice}>
                <Icon name="logo-paypal" iconFamily="Ionicons" size={24} color="#003087" />
                <Typography size={13} color={COLORS.black400} mL={10} style={{ flex: 1 }} lineHeight={18}>
                    Payment powered by PayPal. Secure and encrypted transaction.
                </Typography>
          </View>

          <Button 
            label="PLACE ORDER" 
            mt={40} 
            onPress={handlePlaceOrder} 
            btnStyle={{ width: '100%' }}
          />
        </View>
      </ScrollView>

      {/* Order Success Modal */}
      <Modal visible={successVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <View style={styles.successBox}>
                  <View style={styles.checkIcon}>
                    <Icon name="checkmark" iconFamily="Ionicons" size={48} color={COLORS.white100} />
                  </View>
                  <Typography size={22} fFamily="barlowBold700" color={COLORS.black300} mT={24}>Order Successful!</Typography>
                  <Typography size={14} color={COLORS.textMuted} textAlign="center" mT={10}>Your ClayMaster gear is on its way. You'll receive a confirmation email shortly.</Typography>
              </View>
          </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
    sectionCard: {
        backgroundColor: COLORS.white100,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        ...SHADOWS.card,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 16,
    },
    shippingNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F9FC',
        padding: Sizer.hSize(16),
        borderRadius: Sizer.hSize(12),
        marginTop: Sizer.vSize(24),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successBox: {
        width: '85%',
        backgroundColor: COLORS.white100,
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
    },
    checkIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default CheckoutScreen;
