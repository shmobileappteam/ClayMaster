import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner, Button } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const FORUM_TABS = ['Kevin', 'Bill', 'Ladies', 'Technicals', 'Community'];
const FORUM_POSTS = [
    { author: 'MARC BRAVO', date: 'March 24, 2026', title: 'Improving my quartering target accuracy', content: 'Kevin, your recent video on quartering targets helped me realize I was over-leading the bird. After applying your "silky smooth" swing technique during my session yesterday, my hit rate increased by 20%...' },
    { author: 'STEVE HOOPER', date: 'March 22, 2026', title: 'Best lead method for fast crossers?', content: 'I am struggling with high-speed crossing targets at Station 4. Which lead method would you recommend for consistent results...?' },
];

const LEADERBOARD_DATA = [
    { rank: 1, name: 'John Anderson', score: 99, division: 'Competitor' },
    { rank: 2, name: 'Sarah Mitchell', score: 97, division: 'Hunter' },
    { rank: 3, name: 'Cody Davis', score: 95, division: 'Competitor' },
    { rank: 4, name: 'Emma White', score: 92, division: 'Hunter' },
    { rank: 5, name: 'Brad Collins', score: 90, division: 'Competitor' },
];

const CommunityScreen = ({ navigation }) => {
    const [activeMainTab, setActiveMainTab] = useState('FORUM');
    const [activeForumTab, setActiveForumTab] = useState('Kevin');

    const renderForum = () => (
        <View>
            <ScreenBanner 
                title="Community forum"
                subtitle="Join the conversation with Kevin DeMichiel, Bill McGuire, and the entire ClayMaster community."
            />
            <View style={styles.sectionHeader}>
                <Typography fFamily="barlowBold700" size={15} color={COLORS.textPrimary}>Join the conversation:</Typography>
            </View>
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                    {FORUM_TABS.map(tab => (
                        <TouchableOpacity 
                            key={tab} 
                            activeOpacity={0.88}
                            style={[styles.tabItem, activeForumTab === tab && styles.activeTabItem]}
                            onPress={() => setActiveForumTab(tab)}
                        >
                            <Typography 
                                size={14} 
                                fFamily="barlowBold700" 
                                color={activeForumTab === tab ? COLORS.primary : COLORS.textMuted}
                            >
                                {tab}
                            </Typography>
                            {activeForumTab === tab && <View style={styles.activeUnderline} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={[GLOBALSTYLE.paddingHor, { paddingHorizontal: Sizer.hSize(20) }]}>
                <Button label="Create new post" mt={24} btnStyle={{ width: '100%' }} textStyle={{ textTransform: 'none' }} />
                
                {FORUM_POSTS.map((post, idx) => (
                    <TouchableOpacity key={idx} activeOpacity={0.88} style={styles.postCard}>
                        <Flex direction="row" algItems="center" jusContent="space-between">
                            <Typography fFamily="barlowBold700" size={12} color={COLORS.primary}>BY: {post.author}</Typography>
                            <Typography size={11} color={COLORS.textMuted}>{post.date}</Typography>
                        </Flex>
                        <Typography fFamily="barlowBold700" size={16} lineHeight={22} mT={10} color={COLORS.textPrimary}>{post.title}</Typography>
                        <Typography size={14} color={COLORS.textSecondary} mT={8} lineHeight={20} numberOfLines={3}>
                            {post.content}
                        </Typography>
                        <TouchableOpacity style={{ marginTop: Sizer.vSize(12) }} activeOpacity={0.88}>
                            <Typography color={COLORS.primary} fFamily="barlowBold700" size={13}>Read more...</Typography>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderTournament = () => (
        <View>
            <ScreenBanner 
                title="Virtual tournament"
                subtitle="Participate in our monthly virtual competitions. Submit your scores and see how you rank against the community."
            />
            
            <View style={[GLOBALSTYLE.paddingHor, { paddingHorizontal: Sizer.hSize(20) }]}>
               <View style={styles.tournamentStatus}>
                    <Typography color={COLORS.white100} fFamily="barlowBold700" size={13}>LIVE: MARCH 2026 VIRTUAL TOURNAMENT</Typography>
               </View>

               <View style={styles.stepsCard}>
                   <Typography fFamily="barlowBold700" size={16} lineHeight={22} color={COLORS.textPrimary} mB={20}>How to participate:</Typography>
                   <TournamentStep num={1} title="Review rules" sub="Understand the scoring and submission guidelines." />
                   <TournamentStep num={2} title="Submit score" sub="Enter your scorecard details and upload photo proof." />
                   <TournamentStep num={3} title="Review leaderboard" sub="See your rank in the hunter or competitor division." />
               </View>

               <Button 
                label="Submit my score" 
                mt={24} 
                btnStyle={{ width: '100%' }} 
                textStyle={{ textTransform: 'none' }}
                onPress={() => navigation.navigate('VirtualTournamentScreen')}
               />

               <Typography fFamily="barlowBold700" size={16} lineHeight={22} mT={32} mB={16} color={COLORS.textPrimary}>Current leaderboard</Typography>
               
               <View style={styles.leaderboardTable}>
                   <View style={styles.tableHead}>
                       <Typography size={12} fFamily="barlowBold700" flex={1} color={COLORS.textMuted}>RANK</Typography>
                       <Typography size={12} fFamily="barlowBold700" flex={3} color={COLORS.textMuted}>NAME</Typography>
                       <Typography size={12} fFamily="barlowBold700" flex={1.5} color={COLORS.textMuted}>SCORE</Typography>
                       <Typography size={12} fFamily="barlowBold700" flex={2} color={COLORS.textMuted}>DIVISION</Typography>
                   </View>
                   {LEADERBOARD_DATA.map((item, idx) => {
                       const isTop3 = item.rank <= 3;
                       return (
                           <View key={idx} style={[
                               styles.tableRow, 
                               isTop3 && styles.topPerformerRow,
                               idx === LEADERBOARD_DATA.length - 1 && { borderBottomWidth: 0 }
                           ]}>
                               <Flex flex={1} direction="row" algItems="center">
                                   <View style={isTop3 ? styles.rankBadge : null}>
                                       <Typography size={13} fFamily="barlowBold700" color={isTop3 ? COLORS.white100 : COLORS.textPrimary}>#{item.rank}</Typography>
                                   </View>
                               </Flex>
                               <Typography size={14} fFamily={isTop3 ? "barlowBold700" : "barlowSemiBold600"} flex={3} color={COLORS.textPrimary}>{item.name}</Typography>
                               <Typography size={15} fFamily="barlowBold700" flex={1.5} color={isTop3 ? COLORS.primary : COLORS.textPrimary}>{item.score}/100</Typography>
                               <Typography size={12} color={COLORS.textSecondary} flex={2}>{item.division}</Typography>
                           </View>
                       );
                   })}
               </View>
            </View>
        </View>
    );

    return (
        <Container isPadding={false} backgroundColor={COLORS.mainBg}>
            <Header type="app" title="Community" isBackVisible={false} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Main Tab Switcher */}
                <Flex direction="row" style={styles.mainTabs}>
                    <TouchableOpacity 
                        style={[styles.mainTabItem, activeMainTab === 'FORUM' && styles.activeMainTab]}
                        onPress={() => setActiveMainTab('FORUM')}
                        activeOpacity={0.88}
                    >
                        <Typography size={14} fFamily="barlowBold700" color={activeMainTab === 'FORUM' ? COLORS.primary : COLORS.textMuted}>PRIVATE FORUM</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.mainTabItem, activeMainTab === 'TOURNAMENT' && styles.activeMainTab]}
                        onPress={() => setActiveMainTab('TOURNAMENT')}
                        activeOpacity={0.88}
                    >
                        <Typography size={14} fFamily="barlowBold700" color={activeMainTab === 'TOURNAMENT' ? COLORS.primary : COLORS.textMuted}>VIRTUAL TOURNAMENT</Typography>
                    </TouchableOpacity>
                </Flex>

                {activeMainTab === 'FORUM' ? renderForum() : renderTournament()}
            </ScrollView>
        </Container>
    );
};

const TournamentStep = ({ num, title, sub }) => (
    <View style={styles.stepRow}>
        <View style={styles.stepNum}>
            <Typography color={COLORS.white100} fFamily="barlowBold700" size={14}>{num}</Typography>
        </View>
        <View style={{ flex: 1, marginLeft: Sizer.hSize(16) }}>
            <Typography fFamily="barlowBold700" size={16} color={COLORS.textPrimary}>{title}</Typography>
            <Typography size={14} color={COLORS.textSecondary} mT={4} lineHeight={20}>{sub}</Typography>
        </View>
    </View>
);

export default CommunityScreen;

const styles = StyleSheet.create({
    mainTabs: {
        backgroundColor: COLORS.white100,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        marginBottom: Sizer.vSize(8),
    },
    mainTabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizer.vSize(16),
    },
    activeMainTab: {
        borderBottomWidth: 3,
        borderBottomColor: COLORS.primary,
    },
    sectionHeader: {
        backgroundColor: COLORS.mainBg,
        paddingHorizontal: Sizer.hSize(24),
        paddingVertical: Sizer.vSize(16),
    },
    tabContainer: {
        backgroundColor: COLORS.white100,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
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
        width: '100%',
        height: 3,
        backgroundColor: COLORS.primary,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    postCard: {
        backgroundColor: COLORS.white100,
        borderRadius: Sizer.hSize(12),
        padding: Sizer.hSize(20),
        marginTop: Sizer.vSize(16),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    tournamentStatus: {
        backgroundColor: COLORS.primary,
        borderRadius: Sizer.hSize(8),
        paddingVertical: Sizer.vSize(12),
        alignItems: 'center',
        marginTop: Sizer.vSize(24),
    },
    stepsCard: {
        backgroundColor: COLORS.white100,
        borderRadius: Sizer.hSize(12),
        padding: Sizer.hSize(24),
        marginTop: Sizer.vSize(24),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizer.vSize(16),
    },
    stepNum: {
        width: Sizer.hSize(32),
        height: Sizer.hSize(32),
        borderRadius: Sizer.hSize(16),
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leaderboardTable: {
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
        backgroundColor: '#F9F9F9',
        paddingVertical: Sizer.vSize(16),
        paddingHorizontal: Sizer.hSize(16),
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: Sizer.vSize(16),
        paddingHorizontal: Sizer.hSize(16),
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
        alignItems: 'center',
        backgroundColor: COLORS.white100,
    },
    topPerformerRow: {
        backgroundColor: COLORS.orange300,
    },
    rankBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: Sizer.hSize(8),
        paddingVertical: Sizer.vSize(4),
        borderRadius: Sizer.hSize(6),
        justifyContent: 'center',
        alignItems: 'center',
    }
});
