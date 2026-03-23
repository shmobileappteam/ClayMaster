import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const PRODUCTS = [
    { id: 1, name: 'CLAYMASTER PERFORMANCE POLO', price: '$45.00', cat: 'APPAREL', desc: 'High-performance moisture-wicking polo designed for the range. Features the ClayMaster logo on the chest.' },
    { id: 2, name: 'CLAYMASTER RANGE BAG', price: '$85.00', cat: 'GEAR', desc: 'Durable and spacious range bag to carry all your essentials. Multiple compartments for organization.' },
    { id: 3, name: 'CLAYMASTER SNAPBACK CAP', price: '$25.00', cat: 'ACCESSORIES', desc: 'Style and comfort with our signature snapback cap. One size fits all.' },
    { id: 4, name: 'COURSES & DRILLS TRAINING BOOK', price: '$35.00', cat: 'ACCESSORIES', desc: 'Comprehensive guide to mastering the range.' },
];

const ShopScreen = ({ navigation }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeCat, setActiveCat] = useState('ALL');

    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header 
                type="app" 
                title="Shop" 
                isBackVisible={false} 
                rightSlot={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('OrdersScreen')}
                        activeOpacity={0.88}
                        style={{ padding: Sizer.hSize(8) }}
                        accessibilityRole="button"
                        accessibilityLabel="My orders"
                    >
                        <Icon name="bag-handle-outline" iconFamily="Ionicons" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                }
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                <ScreenBanner 
                    title="ClayMaster shop"
                    subtitle="Exclusive apparel, gear, and accessories. Fast shipping worldwide."
                />

                <View style={styles.catContainer}>
                   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                        {['ALL', 'APPAREL', 'GEAR', 'ACCESSORIES'].map(cat => (
                            <TouchableOpacity 
                                key={cat} 
                                style={[styles.catChip, activeCat === cat && styles.activeCatChip]}
                                onPress={() => setActiveCat(cat)}
                                activeOpacity={BASEOPACITY}
                            >
                                <Typography 
                                    size={12} 
                                    fFamily="barlowBold700" 
                                    color={activeCat === cat ? COLORS.white100 : COLORS.black300}
                                >
                                    {cat}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                   </ScrollView>
                </View>

                <View style={[styles.grid, { marginTop: Sizer.vSize(16) }]}>
                    {PRODUCTS.filter(p => activeCat === 'ALL' || p.cat === activeCat).map(product => (
                        <TouchableOpacity 
                            key={product.id} 
                            style={styles.productCard} 
                            activeOpacity={0.8}
                            onPress={() => setSelectedProduct(product)}
                        >
                            <View style={styles.imgPlaceholder}>
                                <Icon name="shirt-outline" iconFamily="Ionicons" size={48} color={COLORS.grey600} />
                            </View>
                            <View style={styles.pInfo}>
                                <Typography fFamily="barlowBold700" color={COLORS.black300} size={13} numberOfLines={2} lineHeight={16}>{product.name}</Typography>
                                <Flex direction="row" algItems="center" jusContent="space-between" mT={12}>
                                    <Typography fFamily="barlowBold700" color={COLORS.primary} size={15}>{product.price}</Typography>
                                    <TouchableOpacity style={styles.miniCartBtn}>
                                        <Icon name="cart" iconFamily="Ionicons" size={16} color={COLORS.white100} />
                                    </TouchableOpacity>
                                </Flex>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Product Detail Modal (Screen 17) */}
            <Modal
                visible={!!selectedProduct}
                animationType="slide"
                onRequestClose={() => setSelectedProduct(null)}
            >
                <Container isPadding={false} backgroundColor={COLORS.mainBg}>
                    <Header type="app" title="Product Details" isBackVisible={true} onPresBack={() => setSelectedProduct(null)} />
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                        <View style={styles.detailImgPlaceholder}>
                            <Icon name="shirt-outline" iconFamily="Ionicons" size={80} color={COLORS.grey600} />
                        </View>
                        <View style={[styles.detailContent]}>
                            <Typography fFamily="barlowBold700" color={COLORS.black300} size={22}>{selectedProduct?.name}</Typography>
                            <Typography fFamily="barlowBold700" color={COLORS.primary} size={24} mT={12}>{selectedProduct?.price}</Typography>
                            
                            <View style={styles.divider} />
                            
                            <Typography fFamily="barlowBold700" color={COLORS.black300} size={15}>DESCRIPTION:</Typography>
                            <Typography size={14} color={COLORS.black500} mT={8} lineHeight={22}>
                                {selectedProduct?.desc}
                            </Typography>

                            <View style={styles.shippingNotice}>
                                <Icon name="information-circle" iconFamily="Ionicons" size={20} color={COLORS.primary} />
                                <Typography size={13} color={COLORS.black400} mL={10} style={{ flex: 1 }} lineHeight={18}>
                                    External Shop: You will be redirected to our Printify store to complete your purchase safely.
                                </Typography>
                            </View>

                            <Button label="ADD TO CART" mt={32} btnStyle={{ width: '100%' }} icon={<Icon name="cart" iconFamily="Ionicons" size={20} color={COLORS.white100} />} iconGap={8} />
                        </View>
                    </ScrollView>
                </Container>
            </Modal>
        </Container>
    );
};

export default ShopScreen;

const styles = StyleSheet.create({
    catContainer: {
        backgroundColor: COLORS.mainBg,
        paddingVertical: Sizer.vSize(16),
        marginLeft: Sizer.hSize(6),
    },
    catScroll: {
        paddingHorizontal: Sizer.hSize(12),
    },
    catChip: {
        paddingHorizontal: Sizer.hSize(20),
        paddingVertical: Sizer.vSize(10),
        borderRadius: Sizer.hSize(30),
        backgroundColor: COLORS.white100,
        marginHorizontal: Sizer.hSize(6),
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    activeCatChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Sizer.hSize(18),
        justifyContent: 'space-between',
    },
    productCard: {
        width: '47%',
        backgroundColor: COLORS.white100,
        borderRadius: Sizer.hSize(16),
        marginBottom: Sizer.vSize(20),
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    imgPlaceholder: {
        aspectRatio: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pInfo: {
        padding: Sizer.hSize(14),
    },
    miniCartBtn: {
        backgroundColor: COLORS.primary,
        width: Sizer.hSize(28),
        height: Sizer.hSize(28),
        borderRadius: Sizer.hSize(14),
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailImgPlaceholder: {
        width: '100%',
        aspectRatio: 1.1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContent: {
        paddingHorizontal: Sizer.hSize(24),
        paddingTop: Sizer.vSize(24),
        backgroundColor: COLORS.white100,
        borderTopLeftRadius: Sizer.hSize(24),
        borderTopRightRadius: Sizer.hSize(24),
        marginTop: -Sizer.vSize(20),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginVertical: Sizer.vSize(24),
    },
    shippingNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.orange300,
        padding: Sizer.hSize(16),
        borderRadius: Sizer.hSize(12),
        marginTop: Sizer.vSize(24),
        borderWidth: 1,
        borderColor: 'rgba(235, 108, 15, 0.2)',
    }
});
