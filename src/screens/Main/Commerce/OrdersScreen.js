import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const ORDERS = [
    { id: '10024', vendor: 'PRINTIFY', date: '03/15/26', status: 'SHIPPED' },
    { id: '09842', vendor: 'PRINTIFY', date: '02/10/26', status: 'DELIVERED' },
    { id: '09711', vendor: 'PRINTIFY', date: '01/12/26', status: 'PROCESSING' },
];

const OrdersScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <Header type="app" title="Shop" isBackVisible={true} onPresBack={() => navigation.goBack()} />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <ScreenBanner 
            title="ORDERS & SHIPMENTS"
            subtitle="Track the status of your ClayMaster gear orders and review your shipment history."
        />

        <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24) }]}>
            <Typography fFamily="barlowBold700" size={16} color={COLORS.black300} mB={16}>ORDER STATUS / SHIPMENT HISTORY:</Typography>
            
            <View style={styles.orderTable}>
                <View style={styles.tableHead}>
                    <Typography size={11} fFamily="barlowBold700" flex={1.5} color={COLORS.black400}>ORDER #</Typography>
                    <Typography size={11} fFamily="barlowBold700" flex={2} color={COLORS.black400}>VENDOR</Typography>
                    <Typography size={11} fFamily="barlowBold700" flex={2} color={COLORS.black400}>DATE</Typography>
                    <Typography size={11} fFamily="barlowBold700" flex={2} color={COLORS.black400}>STATUS</Typography>
                </View>
                {ORDERS.map((item, idx) => (
                    <View key={idx} style={[styles.tableRow, idx === ORDERS.length - 1 && { borderBottomWidth: 0 }]}>
                        <Typography size={12} fFamily="barlowBold700" flex={1.5} color={COLORS.black300}>#{item.id}</Typography>
                        <Typography size={12} flex={2} color={COLORS.black400}>{item.vendor}</Typography>
                        <Typography size={12} flex={2} color={COLORS.black500}>{item.date}</Typography>
                        <View style={{ flex: 2 }}>
                            <View style={[
                                styles.statusBadge, 
                                { backgroundColor: item.status === 'SHIPPED' ? '#2E7D32' : item.status === 'PROCESSING' ? '#F9A825' : '#757575' }
                            ]}>
                                <Typography color={COLORS.white100} size={10} fFamily="barlowBold700">{item.status}</Typography>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    </ScrollView>
  </Container>
);

export default OrdersScreen;

const styles = StyleSheet.create({
    orderTable: {
        backgroundColor: COLORS.white100,
        borderRadius: Sizer.hSize(12),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    tableHead: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        padding: Sizer.hSize(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tableRow: {
        flexDirection: 'row',
        padding: Sizer.hSize(16),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: Sizer.hSize(8),
        paddingVertical: Sizer.vSize(4),
        borderRadius: Sizer.hSize(4),
    }
});
