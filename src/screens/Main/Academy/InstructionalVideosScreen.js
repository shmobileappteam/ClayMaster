import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const TARGETS = [
  'CHANDELLE', 'CROSSER', 'INCOMER', 'KNUCKLEBALL (OFF-SPEED)', 'OVERHEAD', 
  'QUARTERING', 'RABBIT', 'RABBUE', 'TEAL', 'TOWER', 'TRAP SHET', 'TRAP-TEAL'
];

const InstructionalVideosScreen = () => {
    const [selectedTarget, setSelectedTarget] = useState('CHANDELLE');

    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header type="app" title="Academy" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
                <ScreenBanner 
                    title="Instructional videos"
                    subtitle="12 target presentations taught by Kevin DeMichiel, focusing on trajectory, characteristics, and shooting technique."
                    image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" // Professional Instructor Placeholder
                />

                {/* Horizontal Tab Scroll */}
                <View style={styles.tabContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                        {TARGETS.map(item => (
                            <TouchableOpacity 
                                key={item} 
                                activeOpacity={0.88}
                                style={[styles.tabItem, selectedTarget === item && styles.activeTabItem]}
                                onPress={() => setSelectedTarget(item)}
                            >
                                <Typography 
                                    size={14} 
                                    fFamily="barlowBold700" 
                                    color={selectedTarget === item ? COLORS.primary : COLORS.textMuted}
                                >
                                    {item}
                                </Typography>
                                {selectedTarget === item && <View style={styles.activeUnderline} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Active Target Content */}
                <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24) }]}>
                    <View style={styles.contentCard}>
                        <View style={styles.videoPlayerPlaceholder}>
                            <View style={styles.playBtnBadge}>
                                <Icon name="play" iconFamily="Ionicons" size={32} color={COLORS.primary} style={{ marginLeft: 4 }} />
                            </View>
                            <View style={styles.durationBadge}>
                                <Typography color={COLORS.white100} size={11} fFamily="barlowBold700">12:45</Typography>
                            </View>
                        </View>
                        <View style={styles.cardInfo}>
                            <Typography fFamily="barlowBold700" size={18} lineHeight={24} color={COLORS.textPrimary}>{selectedTarget}</Typography>
                            <Typography size={14} color={COLORS.textSecondary} mT={8} lineHeight={20}>
                                The {selectedTarget} target type is known for its unique trajectory and demanding shooting technique. 
                                Master the timing and lead methods required to consistently break this presentation.
                            </Typography>
                        </View>
                    </View>

                    {/* ClayMaster Vision Section */}
                    <View style={[styles.sectionHeader, { marginTop: Sizer.vSize(32), marginHorizontal: -Sizer.hSize(20) }]}>
                        <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary}>ClayMaster vision (Enhanced view)</Typography>
                    </View>
                    
                    <View style={[styles.contentCard, { marginTop: Sizer.vSize(16), marginBottom: Sizer.vSize(24) }]}>
                        <View style={[styles.videoPlayerPlaceholder, { height: Sizer.vSize(160) }]}>
                            <View style={[styles.playBtnBadge, { width: Sizer.hSize(48), height: Sizer.hSize(48), borderRadius: Sizer.hSize(24) }]}>
                                <Icon name="play" iconFamily="Ionicons" size={24} color={COLORS.primary} style={{ marginLeft: 4 }} />
                            </View>
                            <View style={styles.durationBadge}>
                                <Typography color={COLORS.white100} size={11} fFamily="barlowBold700">04:20</Typography>
                            </View>
                        </View>
                        <View style={styles.cardInfo}>
                            <Typography fFamily="barlowSemiBold600" size={16} lineHeight={22} color={COLORS.textPrimary}>{selectedTarget} – CLAYMASTER VISION</Typography>
                            <Typography size={14} color={COLORS.textSecondary} mT={6} lineHeight={20}>Detailed enhanced slow-motion view of the target path.</Typography>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Container>
    );
};

export default InstructionalVideosScreen;

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: COLORS.mainBg,
        paddingHorizontal: Sizer.hSize(20),
        paddingVertical: Sizer.vSize(16),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.borderSubtle,
    },
    tabContainer: {
        backgroundColor: COLORS.surface,
        ...SHADOWS.card,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.borderSubtle,
    },
    tabScroll: {
        paddingHorizontal: Sizer.hSize(18),
    },
    tabItem: {
        paddingHorizontal: Sizer.hSize(16),
        paddingVertical: Sizer.vSize(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeUnderline: {
        position: 'absolute',
        bottom: 0,
        width: '80%',
        height: 3,
        backgroundColor: 'rgba(232, 93, 4, 0.95)',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    contentCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        overflow: 'hidden',
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
    },
    videoPlayerPlaceholder: {
        height: Sizer.vSize(200),
        backgroundColor: COLORS.black300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBtnBadge: {
        width: Sizer.hSize(64),
        height: Sizer.hSize(64),
        borderRadius: Sizer.hSize(32),
        backgroundColor: 'rgba(255,255,255,0.92)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#1A2332',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    durationBadge: {
        position: 'absolute',
        bottom: Sizer.vSize(12),
        right: Sizer.hSize(12),
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: Sizer.hSize(8),
        paddingVertical: Sizer.vSize(4),
        borderRadius: Sizer.hSize(6),
    },
    cardInfo: {
        paddingVertical: Sizer.vSize(16),
        paddingHorizontal: Sizer.hSize(20),
    }
});
