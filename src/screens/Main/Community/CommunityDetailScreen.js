import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, Button } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS, BASEOPACITY } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const CommunityDetailScreen = ({ navigation, route }) => {
    const { topicId } = route.params || { topicId: 1 };

    return (
        <Container isPadding={false} backgroundColor="#FCFBFA">
            <Header type="app" title="Topic Details" isBackVisible={true} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={[GLOBALSTYLE.paddingHor, { marginTop: 24 }]}>
                    
                    {/* User Header */}
                    <Flex direction="row" algItems="center" mB={24}>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?u=scott' }} style={styles.avatar} />
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Typography fFamily="barlowBold700" size={16} color={COLORS.black100}>Scott Winstead</Typography>
                            <Flex direction="row" algItems="center" mT={2}>
                                <Icon name="chatbubble-ellipses" iconFamily="Ionicons" size={12} color={COLORS.black300} />
                                <Typography size={12} color={COLORS.black300} mL={4}>Conversation Starter</Typography>
                                <Typography size={12} color={COLORS.black300} mL={12}>March 23, 2026 at 10:28 PM</Typography>
                            </Flex>
                        </View>
                        <TouchableOpacity style={styles.replyBtn} activeOpacity={BASEOPACITY}>
                            <Typography size={13} color={COLORS.white100} fFamily="barlowBold700">Reply</Typography>
                        </TouchableOpacity>
                    </Flex>

                    {/* Question Content */}
                    <View style={styles.contentCard}>
                        <Flex direction="row" algItems="flex-start">
                           <Typography fFamily="barlowBold700" size={32} color={COLORS.black100} lineHeight={36}>Q:</Typography>
                           <View style={{ flex: 1, marginLeft: 12 }}>
                               <Typography fFamily="barlowBold700" size={20} color={COLORS.black100} lineHeight={26}>
                                   Tournament Jitters/Pressure - Is this something that impacts you?
                               </Typography>
                               <View style={styles.catBadge}>
                                  <Typography size={11} color={COLORS.white100} fFamily="barlowBold700">General Discussion</Typography>
                               </View>
                           </View>
                        </Flex>

                        <Typography size={14} color={COLORS.black300} mT={24} lineHeight={24}>
                            I watched a video on YouTube (I think it was by Russell Mark, the Olympic Trap shooter) where he talked about the "little man on his shoulder" that would talk to him when things were going good (e.g., running a couple of stations in a row, knowing you had the potential for a good score, etc.). That stuck with me... I've definitely had that "little man" on my shoulder before where he's trying to sabotage my shooting performance.
                        </Typography>

                        <Typography size={14} color={COLORS.black300} mT={20} lineHeight={24}>
                            As soon as I feel him trying to talk to me, I immediately try to shift my focus back to the process - the first thing I really go back to is trying to see the target even better/more clearly (something else I learned courtesy of YouTube University). It seems when I shift my focus back to the process (see the target better/more clearly) that it distracts/provides my conscious mind something to do while I attempt to stay in the moment and break targets with my subconscious mind. I know this sounds a bit mythical, but it works for me.
                        </Typography>

                        <Typography size={14} color={COLORS.black300} mT={20} lineHeight={24}>
                            Try it out and see if it works for you. The key is that you <Typography size={14} fFamily="barlowBold700" color={COLORS.black100}>really, really have to focus</Typography> on see the target better/more clearly so that you don't allow any room for the "little man" to squeeze in.
                        </Typography>

                        <View style={styles.divider} />

                        <Flex direction="row" algItems="center" jusContent="flex-end" mT={16} gap={12}>
                             <TouchableOpacity style={styles.miniBtn} activeOpacity={BASEOPACITY}>
                                <Typography size={11} fFamily="barlowBold700" color={COLORS.white100}>Reply</Typography>
                             </TouchableOpacity>
                             <View style={[styles.miniBtn, { backgroundColor: '#222' }]}>
                                <Typography size={11} fFamily="barlowBold700" color={COLORS.white100}>Views (2)</Typography>
                             </View>
                             <View style={[styles.miniBtn, { backgroundColor: COLORS.primary }]}>
                                <Typography size={11} fFamily="barlowBold700" color={COLORS.white100}>Report (0)</Typography>
                             </View>
                        </Flex>
                    </View>

                    {/* Replies Header */}
                    <View style={styles.sectionHeader}>
                        <Typography fFamily="barlowBold700" size={18} color={COLORS.black100}>ALL REPLIES (0)</Typography>
                    </View>
                    <View style={styles.emptyReplies}>
                        <Typography color={COLORS.textMuted} size={14}>No replies yet. Be the first to reply!</Typography>
                    </View>

                    {/* Poll Section */}
                    <View style={styles.pollCard}>
                        <Typography fFamily="barlowBold700" size={15} color={COLORS.black100} mB={20}>WHICH SERVICE DO YOU USE OR FIND MOST VALUABLE?</Typography>
                        
                        <PollItem label="Analytics Tool & Other Analytics Services" percent={0} />
                        <PollItem label="Instructional Videos" percent={0} />
                        <PollItem label="Detailed Practice Drills" percent={0} />
                        <PollItem label="On-line Coaching Sessions" percent={0} />
                    </View>

                </View>
            </ScrollView>
        </Container>
    );
};

const PollItem = ({ label, percent }) => (
    <View style={{ marginBottom: 16 }}>
        <Typography size={13} color={COLORS.black300} mB={8}>{label}</Typography>
        <Flex direction="row" algItems="center">
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
            </View>
            <Typography fFamily="barlowBold700" size={12} color={COLORS.black300} mL={12}>{percent}%</Typography>
        </Flex>
    </View>
);

export default CommunityDetailScreen;

const styles = StyleSheet.create({
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EEE',
    },
    replyBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    contentCard: {
        backgroundColor: COLORS.white100,
        borderRadius: 12,
        padding: 24,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        ...SHADOWS.card,
    },
    catBadge: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-start',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#EFEFEF',
        marginTop: 32,
    },
    miniBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    sectionHeader: {
        marginTop: 40,
        marginBottom: 16,
    },
    emptyReplies: {
        backgroundColor: COLORS.white100,
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    pollCard: {
        backgroundColor: COLORS.white100,
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        ...SHADOWS.card,
    },
    progressBarBg: {
        flex: 1,
        height: 24,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    }
});
