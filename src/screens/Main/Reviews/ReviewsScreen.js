import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const REVIEWS = [
    { author: 'Marc Bravo', date: 'March 24, 2026', stars: 5, content: 'Excellent support from Kevin and the team. The analytics are a game changer for my performance.' },
    { author: 'Steve Hooper', date: 'March 20, 2026', stars: 4, content: 'Great app, very professional. I love the new practice drills section.' },
];

const ReviewsScreen = () => {
    const [rating, setRating] = useState(5);

    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header type="app" title="Reviews" isBackVisible={false} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <ScreenBanner 
                    title="Reviews & feedback"
                    subtitle="We value your feedback. Share your experience with ClayMaster and help us improve our services for you."
                />

                <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24), paddingHorizontal: Sizer.hSize(20) }]}>
                    <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary} mB={12}>YOUR FEEDBACK MATTERS</Typography>
                    
                    {/* Rating Summary */}
                    <View style={styles.ratingSummary}>
                        <View style={{ alignItems: 'center' }}>
                           <Typography fFamily="barlowBold700" size={38} color={COLORS.textPrimary}>4.9</Typography>
                           <Flex direction="row" mT={10} gap={6}>
                                {[1,2,3,4,5].map(i => <Icon key={i} name="star" iconFamily="Ionicons" size={22} color="#FFD700" />)}
                           </Flex>
                           <Typography size={12} color={COLORS.textMuted} mT={14} fFamily="barlowBold700" letterSpacing={1}>TOTAL REVIEWS: 124</Typography>
                        </View>
                    </View>

                    {/* Submit Review Form */}
                    <View style={styles.whiteCard}>
                        <Typography fFamily="barlowBold700" size={16} color={COLORS.textPrimary} mB={16}>TELL US WHAT YOU THINK</Typography>
                        
                        <Typography size={13} color={COLORS.textPrimary} fFamily="barlowSemiBold600" mB={10}>Your rating *</Typography>
                        <Flex direction="row" mB={24} gap={12}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.88}>
                                    <Icon
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        iconFamily="Ionicons"
                                        size={34}
                                        color={star <= rating ? "#FFD700" : COLORS.borderMuted}
                                    />
                                </TouchableOpacity>
                            ))}
                        </Flex>

                        <Typography size={13} color={COLORS.textPrimary} fFamily="barlowSemiBold600" mB={10}>Note / witness *</Typography>
                        <TextInput 
                            style={styles.textArea} 
                            placeholder="Share your thoughts..." 
                            multiline 
                            numberOfLines={4}
                            placeholderTextColor={COLORS.textMuted}
                        />

                        <Button label="Submit review" mt={24} btnStyle={{ width: '100%' }} />
                    </View>

                    {/* Review List */}
                    <Typography fFamily="barlowBold700" size={16} color={COLORS.textPrimary} mT={32} mB={16}>Recent reviews</Typography>
                    {REVIEWS.map((review, idx) => (
                        <View key={idx} style={styles.reviewCard}>
                            <Flex direction="row" algItems="center" jusContent="space-between">
                                <Flex direction="row" gap={4}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Icon key={i} name="star" iconFamily="Ionicons" size={16} color={i <= review.stars ? "#FFD700" : COLORS.borderMuted} />
                                    ))}
                                </Flex>
                                <Typography size={12} color={COLORS.textMuted} fFamily="barlowBold700">{review.date}</Typography>
                            </Flex>
                            <Typography fFamily="barlowBold700" size={15} color={COLORS.textPrimary} mT={14}>BY: {review.author}</Typography>
                            <Typography size={14} color={COLORS.textSecondary} mT={6} lineHeight={20}>
                                {review.content}
                            </Typography>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Container>
    );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
    ratingSummary: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(24),
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        marginBottom: Sizer.vSize(24),
        ...SHADOWS.card,
    },
    whiteCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(24),
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
    },
    textArea: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        borderRadius: Sizer.hSize(12),
        padding: Sizer.hSize(16),
        height: Sizer.vSize(120),
        textAlignVertical: 'top',
        fontFamily: 'barlowSemiBold600',
        fontSize: 14,
        color: COLORS.textPrimary,
        backgroundColor: COLORS.surfaceMuted,
    },
    reviewCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(20),
        marginBottom: Sizer.vSize(16),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    }
});
