import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const CoachingScreen = () => {
    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header type="app" title="Coaching" isBackVisible={false} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <ScreenBanner 
                    title="On-line coaching sessions"
                    subtitle="Schedule your 1-on-1 on-line coaching sessions with our world-class instructors using our integrated scheduling tool."
                />

                <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24), paddingHorizontal: Sizer.hSize(20) }]}>
                    {/* Scheduling Card */}
                    <View style={styles.whiteCard}>
                        <Typography fFamily="barlowBold700" size={16} color={COLORS.textPrimary} mB={16}>CALENDLY SCHEDULER</Typography>
                        
                        <Typography size={13} color={COLORS.textPrimary} fFamily="barlowSemiBold600" mB={10}>Select coach</Typography>
                        <TouchableOpacity style={styles.dropdownBox} activeOpacity={0.88}>
                            <Typography size={15} color={COLORS.textPrimary} fFamily="barlowMedium500">Kevin DeMichiel</Typography>
                            <Icon name="chevron-down" iconFamily="Ionicons" size={20} color={COLORS.textMuted} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.calendlyPlaceholder} activeOpacity={0.88}>
                            <Icon name="calendar-outline" iconFamily="Ionicons" size={32} color={COLORS.primary} />
                            <Typography color={COLORS.textSecondary} fFamily="barlowBold700" size={14} mT={12}>Launch scheduler integration</Typography>
                            <Typography color={COLORS.textMuted} size={12} mT={4} textAlign="center">Choose a date and time that works for you</Typography>
                        </TouchableOpacity>

                        <Button label="Book session" mt={24} btnStyle={{ width: '100%' }} />
                    </View>

                    {/* Session Requests */}
                    <Typography fFamily="barlowBold700" size={16} color={COLORS.textPrimary} mT={32} mB={16}>Your session requests</Typography>
                    <View style={styles.sessionRow}>
                        <View style={styles.dateCircle}>
                            <Typography color={COLORS.white100} fFamily="barlowBold700" size={17}>24</Typography>
                            <Typography color={COLORS.white100} size={10} fFamily="barlowBold700">MAR</Typography>
                        </View>
                        <View style={{ flex: 1, marginLeft: Sizer.hSize(16), marginRight: Sizer.hSize(12) }}>
                            <Typography fFamily="barlowBold700" size={15} color={COLORS.textPrimary}>Kevin DeMichiel – 10:00 AM</Typography>
                            <Typography size={12} color={COLORS.textMuted} mT={4}>Zoom Meeting ID: 892 122 1334</Typography>
                        </View>
                        <View style={styles.statusBadge}>
                           <Typography color={COLORS.white100} size={9} fFamily="barlowBold700">UPCOMING</Typography>
                        </View>
                    </View>

                    {/* Usage Details */}
                    <View style={[styles.usageCard, { marginTop: Sizer.vSize(32) }]}>
                        <Typography color={COLORS.white100} fFamily="barlowBold700" size={15} mB={24} textAlign="center">
                            COACHING SESSIONS STATUS
                        </Typography>
                        <Flex direction="row" jusContent="space-between" algItems="center">
                            <StatBox label="TOTAL" value="3" />
                            <StatBox label="USED" value="0" />
                            <StatBox label="REMAINING" value="3" />
                        </Flex>
                    </View>

                    {/* Buy More Sessions */}
                    <Typography fFamily="barlowBold700" size={16} color={COLORS.textPrimary} mT={32} mB={16}>Buy more sessions</Typography>
                    <View style={styles.bundleCard}>
                        <View style={styles.saveBadge}>
                            <Typography color={COLORS.white100} size={11} fFamily="barlowBold700">SAVE $50</Typography>
                        </View>
                        <Flex direction="row" algItems="center" jusContent="space-between" mT={8}>
                            <View>
                                <Typography fFamily="barlowBold700" size={18} color={COLORS.textPrimary}>10 SESSION BUNDLE</Typography>
                                <Typography size={13} color={COLORS.textMuted} mT={6}>Standard high-impact sessions</Typography>
                            </View>
                            <Typography fFamily="barlowBold700" color={COLORS.primary} size={28}>$700</Typography>
                        </Flex>
                        <Button label="Buy bundle" mt={24} btnStyle={{ width: '100%' }} />
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
};

const StatBox = ({ label, value }) => (
    <View style={{ alignItems: 'center', flex: 1 }}>
        <View style={styles.statCircle}>
            <Typography color={COLORS.primary} fFamily="barlowBold700" size={18}>{value}</Typography>
        </View>
        <Typography color={'rgba(255,255,255,0.85)'} size={11} fFamily="barlowBold700" mT={10}>{label}</Typography>
    </View>
);

export default CoachingScreen;

const styles = StyleSheet.create({
    whiteCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(24),
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
    },
    dropdownBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Sizer.vSize(52),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        borderRadius: Sizer.hSize(12),
        paddingHorizontal: Sizer.hSize(16),
        marginBottom: Sizer.vSize(24),
        backgroundColor: COLORS.surfaceMuted,
    },
    calendlyPlaceholder: {
        height: Sizer.vSize(220),
        backgroundColor: COLORS.surfaceMuted,
        borderRadius: Sizer.hSize(12),
        borderWidth: 1.5,
        borderColor: COLORS.borderSubtle,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Sizer.hSize(20),
    },
    sessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(16),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        ...SHADOWS.card,
    },
    dateCircle: {
        width: Sizer.hSize(56),
        height: Sizer.hSize(56),
        backgroundColor: COLORS.secondary,
        borderRadius: Sizer.hSize(12),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#1A2332',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    statusBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: Sizer.hSize(8),
        paddingVertical: Sizer.vSize(6),
        borderRadius: Sizer.hSize(6),
    },
    usageCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: Sizer.hSize(16),
        padding: Sizer.hSize(24),
        ...SHADOWS.banner,
    },
    statCircle: {
        width: Sizer.hSize(48),
        height: Sizer.hSize(48),
        borderRadius: Sizer.hSize(12),
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bundleCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(24),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        position: 'relative',
        overflow: 'hidden',
        ...SHADOWS.card,
    },
    saveBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        paddingHorizontal: Sizer.hSize(16),
        paddingVertical: Sizer.vSize(8),
        borderBottomLeftRadius: Sizer.hSize(14),
    }
});
