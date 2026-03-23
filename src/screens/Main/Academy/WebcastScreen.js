import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const WEBCASTS = [
    { title: "Kevin's live webcast – March 2026", date: "MARCH 25, 2026", time: "6:00 PM EST" },
    { title: "Kevin's live webcast – April 2026", date: "APRIL 22, 2026", time: "6:00 PM EST" },
];

const WebcastScreen = () => {
    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header type="app" title="Academy" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                <ScreenBanner 
                    title="Kevin's Live Webcasts"
                    subtitle="Monthly high-impact live webcast group sessions with World Champion Kevin DeMichiel."
                    image="https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=400&q=80"
                />

                <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24) }]}>
                    <View style={styles.sectionHeader}>
                        <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary}>Live sessions</Typography>
                    </View>

                    {WEBCASTS.length > 0 ? WEBCASTS.map((item, idx) => (
                        <View key={idx} style={styles.webcastCard}>
                            <Flex direction="row" algItems="center" jusContent="space-between">
                                <View style={{ flex: 1, paddingRight: 16 }}>
                                    <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary}>{item.title}</Typography>
                                    <Typography size={13} color={COLORS.textMuted} mT={6}>{item.date} • {item.time}</Typography>
                                </View>
                                <Button label="Join now" btnStyle={styles.joinBtn} textStyle={{ fontSize: 13, textTransform: 'none' }} />
                            </Flex>
                        </View>
                    )) : (
                        <View style={styles.emptyState}>
                            <Icon name="videocam-off" iconFamily="Ionicons" size={48} color={COLORS.grey400} />
                            <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.textSecondary} mT={12}>No Upcoming Webcasts</Typography>
                            <Typography fFamily="barlowRegular400" size={14} color={COLORS.textMuted} mT={6} textAlign="center">
                                We will notify you when the next live session is scheduled.
                            </Typography>
                        </View>
                    )}

                    <View style={[styles.sectionHeader, { marginTop: Sizer.vSize(32) }]}>
                        <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary}>Online Coaching</Typography>
                    </View>

                    <View style={[styles.infoCard, { marginTop: Sizer.vSize(16) }]}>
                        <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary} mB={8}>Private 1-on-1 coaching</Typography>
                        <Typography size={15} color={COLORS.textSecondary} lineHeight={22} mB={20}>
                            Individual technical sessions using our integrated scheduling tools. 
                            Select your coach and book your high-impact session today.
                        </Typography>
                        <Button label="Go to coaching" btnStyle={{ width: '100%' }} textStyle={{ textTransform: 'none' }} />
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
};

export default WebcastScreen;

const styles = StyleSheet.create({
    sectionHeader: {
        marginBottom: Sizer.vSize(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.borderSubtle,
        paddingBottom: Sizer.vSize(8),
    },
    webcastCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(16),
        marginBottom: Sizer.vSize(12),
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
    },
    joinBtn: {
        paddingHorizontal: Sizer.hSize(16),
        height: Sizer.vSize(40),
        borderRadius: Sizer.hSize(10),
    },
    infoCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(20),
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
    },
    emptyState: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        padding: Sizer.hSize(32),
        alignItems: 'center',
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        marginTop: Sizer.vSize(8),
    }
});
