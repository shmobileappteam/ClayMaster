import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import { addToCart } from '../../../redux/slices/cartSlice';
import { showMessage } from '../../../utils';

const PRODUCTS = [
    { 
        id: 1, 
        name: 'CLAYMASTER PERFORMANCE POLO', 
        price: '$45.00', 
        cat: 'APPAREL', 
        desc: 'High-performance moisture-wicking polo designed for the range. Features the ClayMaster logo on the chest.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    },
    { 
        id: 2, 
        name: 'CLAYMASTER RANGE BAG', 
        price: '$85.00', 
        cat: 'GEAR', 
        desc: 'Durable and spacious range bag to carry all your essentials. Multiple compartments for organization.',
        image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80'
    },
    { 
        id: 3, 
        name: 'CLAYMASTER SNAPBACK CAP', 
        price: '$25.00', 
        cat: 'ACCESSORIES', 
        desc: 'Style and comfort with our signature snapback cap. One size fits all.',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80'
    },
    { 
        id: 4, 
        name: 'COURSES & DRILLS TRAINING BOOK', 
        price: '$35.00', 
        cat: 'ACCESSORIES', 
        desc: 'Comprehensive guide to mastering the range.',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80'
    },
];

const ShopScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { totalItems } = useSelector(state => state.cart || { totalItems: 0 });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeCat, setActiveCat] = useState('ALL');

    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header 
                type="app" 
                title="Shop" 
                isBackVisible={true} 
                rightSlot={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CartScreen')}
                        activeOpacity={0.88}
                        style={{ padding: Sizer.hSize(8) }}
                    >
                        <View>
                            <Icon name="cart-outline" iconFamily="Ionicons" size={24} color={COLORS.textPrimary} />
                            {totalItems > 0 && (
                                <View style={styles.badge}>
                                    <Typography size={8} color={COLORS.white100} fFamily="barlowBold700">{totalItems}</Typography>
                                </View>
                            )}
                        </View>
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
                        <View key={product.id} style={styles.productCard}>
                            <TouchableOpacity 
                                activeOpacity={0.8}
                                onPress={() =>
                                  navigation.navigate('ProductDetailScreen', {
                                    id: product.id,
                                  })
                                }
                                onLongPress={() => setSelectedProduct(product)}
                                style={{ flex: 1 }}
                            >
                                <View style={styles.imgPlaceholder}>
                                    {product.image ? (
                                        <Image source={{ uri: product.image }} style={styles.productImage} />
                                    ) : (
                                        <Icon name="shirt-outline" iconFamily="Ionicons" size={48} color={COLORS.grey600} />
                                    )}
                                </View>
                                <View style={styles.pInfo}>
                                    <Typography fFamily="barlowBold700" color={COLORS.black300} size={13} numberOfLines={2} lineHeight={16}>{product.name}</Typography>
                                    <Typography fFamily="barlowBold700" color={COLORS.primary} size={15} mT={12}>{product.price}</Typography>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.miniCartBtnPosition}
                                onPress={() => {
                                    dispatch(addToCart(product));
                                    showMessage({
                                        message: 'Added to cart',
                                        type: 'success',
                                        bgColor: COLORS.primary,
                                        color: COLORS.white100,
                                    });
                                }}
                            >
                                <Icon name="cart-outline" iconFamily="Ionicons" size={16} color={COLORS.white100} />
                            </TouchableOpacity>
                        </View>
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
                            {selectedProduct?.image ? (
                                <Image source={{ uri: selectedProduct.image }} style={styles.detailProductImage} />
                            ) : (
                                <Icon name="shirt-outline" iconFamily="Ionicons" size={80} color={COLORS.grey600} />
                            )}
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

                            <Button 
                                label="ADD TO CART" 
                                mt={32} 
                                btnStyle={{ width: '100%' }} 
                                icon={<Icon name="cart-outline" iconFamily="Ionicons" size={20} color={COLORS.white100} />} 
                                iconGap={8} 
                                onPress={() => {
                                    dispatch(addToCart(selectedProduct));
                                    showMessage({
                                        message: 'Added to cart',
                                        type: 'success',
                                        bgColor: COLORS.primary,
                                        color: COLORS.white100,
                                    });
                                    setSelectedProduct(null);
                                    navigation.navigate('CartScreen');
                                }}
                            />
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
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
    miniCartBtnPosition: {
        position: 'absolute',
        bottom: Sizer.vSize(12),
        right: Sizer.hSize(12),
        backgroundColor: COLORS.primary,
        width: Sizer.hSize(32),
        height: Sizer.hSize(32),
        borderRadius: Sizer.hSize(16),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    detailImgPlaceholder: {
        width: '100%',
        aspectRatio: 1.1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailProductImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
    },
    badge: {
        position: 'absolute',
        top: -Sizer.vSize(4),
        right: -Sizer.hSize(4),
        backgroundColor: COLORS.red200,
        width: Sizer.hSize(14),
        height: Sizer.hSize(14),
        borderRadius: Sizer.hSize(7),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.white100,
    }
});
