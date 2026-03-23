import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const VIDEO_DATA = [
    { title: 'Bill shooting competition and demonstrating his shooting technique', type: 'SHOOTING FUNDAMENTALS/TECHNIQUES' },
    { title: 'Bill demonstrating his teal and trap-teal method', type: 'SHOOTING FUNDAMENTALS/TECHNIQUES' },
    { title: 'Bill demonstrating silky smooth gun swing', type: 'SHOOTING FUNDAMENTALS/TECHNIQUES' },
    { title: 'Coaching session with Kevin - Focus on incomers', type: 'COACHING' },
];

const AdditionalVideosScreen = () => {
    const [activeTab, setActiveTab] = useState('SHOOTING FUNDAMENTALS/TECHNIQUES');

    const filteredVideos = VIDEO_DATA.filter(v => v.type === activeTab);

    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header type="app" title="Academy" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <ScreenBanner 
                    title="Additional videos"
                    subtitle="Supplementary training videos from Kevin DeMichiel and Bill McGuire covering fundamentals and advanced techniques."
                />

                {/* Category Tabs */}
                <View style={styles.tabContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                        {['SHOOTING FUNDAMENTALS/TECHNIQUES', 'COACHING'].map(tab => (
                            <TouchableOpacity 
                                key={tab} 
                                activeOpacity={0.88}
                                style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Typography 
                                    size={14} 
                                    fFamily="barlowBold700" 
                                    color={activeTab === tab ? COLORS.primary : COLORS.textMuted}
                                >
                                    {tab === 'SHOOTING FUNDAMENTALS/TECHNIQUES' ? 'Fundamentals' : 'Coaching'}
                                </Typography>
                                {activeTab === tab && <View style={styles.activeUnderline} />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Video List */}
                <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24), paddingHorizontal: Sizer.hSize(20) }]}>
                    {filteredVideos.map((video, idx) => (
                        <View key={idx} style={styles.videoCard}>
                            <TouchableOpacity style={styles.videoPlayerPlaceholder} activeOpacity={0.88}>
                                <View style={styles.playBtnBadge}>
                                    <Icon name="play" iconFamily="Ionicons" size={32} color={COLORS.primary} style={{ marginLeft: 4 }} />
                                </View>
                                <View style={styles.durationBadge}>
                                    <Typography color={COLORS.white100} size={11} fFamily="barlowBold700">14:30</Typography>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.cardInfo}>
                                <Typography fFamily="barlowBold700" size={15} color={COLORS.textPrimary} lineHeight={22}>
                                    {video.title}
                                </Typography>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </Container>
    );
};

export default AdditionalVideosScreen;

const styles = StyleSheet.create({
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
    videoCard: {
        backgroundColor: COLORS.surface,
        borderRadius: Sizer.hSize(14),
        overflow: 'hidden',
        ...SHADOWS.card,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderSubtle,
        marginBottom: Sizer.vSize(20),
    },
    videoPlayerPlaceholder: {
        height: Sizer.vSize(190),
        backgroundColor: COLORS.secondary,
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
