import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, Button } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS, BASEOPACITY } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const FORUM_POSTS = [
    { 
        id: 1,
        author: 'Scott Winstead', 
        time: '15h ago', 
        title: 'Tournament Jitters/Pressure - Is This Something That Impacts You?', 
        excerpt: 'I watched a video on YouTube (I think it was by Russell Mark, the Olympic Trap shooter) where he talked about the "little man on his shoulder" that would talk to him when things were going good (e.g., running a couple of stations in a row, knowing you had the potential for a good score, etc.). That stuck with me...',
        category: 'General Discussion',
        stats: { comments: 0, views: 1 },
        avatar: 'https://i.pravatar.cc/150?u=scott'
    },
    { 
        id: 2,
        author: 'Scott Winstead', 
        time: '3d ago', 
        title: "We're Going To Be Filming Some New Videos Next Month Focused On \"Misses\" - Would Love Some Feedback From You!", 
        excerpt: "We're going to be filming some new videos next month focused on \"misses\" and how to fix them on different target presentations. We would love to hear from our community members about which specific targets give you the most trouble...",
        category: 'General Discussion',
        stats: { comments: 0, views: 1 },
        avatar: 'https://i.pravatar.cc/150?u=scott'
    },
    { 
        id: 3,
        author: 'Scott Winstead', 
        time: '3d ago', 
        title: 'GOOD GEAR ALERT - 10 Gauge Bronze Bore Brush 3-Pack', 
        excerpt: "Ok, I know it sounds a little trivial but like I said earlier, I like good gear at a great price. So, first of all it's a great brush that really does a good job of clearing the copper fouling without scratching the barrel...",
        category: 'Equipment/Gear Recommendations',
        stats: { comments: 0, views: 1 },
        avatar: 'https://i.pravatar.cc/150?u=scott'
    },
    { 
        id: 4,
        author: 'Scott Winstead', 
        time: '3d ago', 
        title: 'GOOD GEAR ALERT - Briley Soft Gun Case', 
        excerpt: 'I have a bunch of gun cases (e.g., Pelican knock off case for international travel, Negrini hard case, various soft cases for local matches). This Briley case is specifically padded for safe transport...',
        category: 'Equipment/Gear Recommendations',
        stats: { comments: 0, views: 1 },
        avatar: 'https://i.pravatar.cc/150?u=scott'
    },
];

const CommunityScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');

    return (
        <Container isPadding={false} backgroundColor="#FCFBFA">
            <Header type="app" title="Private Community Forum" isBackVisible={true} />
            
            <View style={styles.topSearch}>
                <View style={styles.searchBar}>
                     <Icon name="search" iconFamily="Ionicons" size={20} color={COLORS.black400} />
                     <TextInput 
                        placeholder="SEARCH HERE..." 
                        style={styles.searchInput}
                        placeholderTextColor={COLORS.black400}
                        value={search}
                        onChangeText={setSearch}
                     />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <View style={[GLOBALSTYLE.paddingHor, { marginTop: 24 }]}>
                    
                    <Typography fFamily="barlowBold700" size={24} color={COLORS.black100} mB={8}>Private Community Forum</Typography>
                    <View style={styles.headerDivider} />

                    <Flex direction="row" algItems="center" jusContent="space-between" mT={24} mB={32} gap={10}>
                        <View style={{ flex: 1.8, flexDirection: 'row', gap: 8 }}>
                            <View style={[styles.dropdown, { flex: 1 }]}>
                                <Typography size={11} color={COLORS.black300} numberOfLines={1}>Most Recent</Typography>
                                <Icon name="chevron-down" iconFamily="Ionicons" size={12} color={COLORS.black100} />
                            </View>
                            <View style={[styles.dropdown, { flex: 1 }]}>
                                <Typography size={11} color={COLORS.black300} numberOfLines={1}>All Categories</Typography>
                                <Icon name="chevron-down" iconFamily="Ionicons" size={12} color={COLORS.black100} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.createBtn} activeOpacity={BASEOPACITY}>
                            <Icon name="add-circle" iconFamily="Ionicons" size={18} color={COLORS.white100} />
                            <Typography size={11} fFamily="barlowBold700" color={COLORS.white100} mL={6}>CREATE TOPIC</Typography>
                        </TouchableOpacity>
                    </Flex>

                    {FORUM_POSTS.map((post) => (
                        <TouchableOpacity 
                            key={post.id} 
                            activeOpacity={0.88} 
                            style={styles.postCard}
                            onPress={() => navigation.navigate('CommunityDetailScreen', { topicId: post.id })}
                        >
                            <Flex direction="row" algItems="flex-start">
                                <Image source={{ uri: post.avatar }} style={styles.avatar} />
                                <View style={{ flex: 1, marginHorizontal: 14 }}>
                                    <Typography fFamily="barlowBold700" size={15} color={COLORS.black100} lineHeight={20}>{post.title}</Typography>
                                    <Typography size={12} color={COLORS.textSecondary} mT={6} numberOfLines={2} lineHeight={16}>{post.excerpt}</Typography>
                                    {/* Sub-meta */}
                                    <View style={styles.metaRow}>
                                        <Typography size={11} color={COLORS.textMuted}>Category: <Typography size={11} color={COLORS.primary} fFamily="barlowSemiBold600">{post.category}</Typography></Typography>
                                    </View>
                                </View>
                                <View style={styles.postStats}>
                                    <Flex direction="row" algItems="center" mB={6}>
                                        <Icon name="chatbubble-outline" iconFamily="Ionicons" size={14} color={COLORS.textMuted} />
                                        <Typography size={12} color={COLORS.textMuted} mL={6}>{post.stats.comments}</Typography>
                                    </Flex>
                                    <Flex direction="row" algItems="center" mB={12}>
                                        <Icon name="eye-outline" iconFamily="Ionicons" size={14} color={COLORS.textMuted} />
                                        <Typography size={12} color={COLORS.textMuted} mL={6}>{post.stats.views}</Typography>
                                    </Flex>
                                    <Typography size={12} color={COLORS.black100} fFamily="barlowBold700" textAlign="right">{post.time}</Typography>
                                </View>
                            </Flex>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </Container>
    );
};

export default CommunityScreen;

const styles = StyleSheet.create({
    topSearch: {
        paddingHorizontal: Sizer.hSize(20),
        paddingVertical: Sizer.vSize(16),
        backgroundColor: '#FCFAF8',
        borderBottomWidth:1,
        borderBottomColor: '#F0F0F0',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white100,
        height: Sizer.vSize(48),
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        ...SHADOWS.card,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 13,
        fontFamily: 'barlowSemiBold600',
        color: COLORS.black100,
    },
    headerDivider: {
        width: 60,
        height: 4,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
        marginTop: 4,
    },
    dropdown: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white100,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    createBtn: {
        flex: 1.1,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        height: Sizer.vSize(44),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    postCard: {
        backgroundColor: COLORS.white100,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F5F5F5',
        ...SHADOWS.card,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F0F0F0',
    },
    metaRow: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    postStats: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 50,
    }
});
