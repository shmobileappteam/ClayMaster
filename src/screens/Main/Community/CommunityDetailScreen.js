import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import {
  getCommunityPost,
  getInitials,
  POST_REPLIES,
} from '../../../constants/communityPosts';

/**
 * ClayMaster-App-UI `PostDetail.tsx`
 */
const CommunityDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const postId = route?.params?.id ?? route?.params?.topicId ?? 1;
  const post = getCommunityPost(postId);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(true);

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Post"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[GLOBALSTYLE.screenCard, styles.postCard]}>
          <View style={styles.postHeader}>
            <View style={styles.avatarLg}>
              <Typography
                size={TYPE.caption.size}
                color={COLORS.primary}
                fFamily="barlowBold700"
              >
                {getInitials(post.user)}
              </Typography>
            </View>
            <View style={{ flex: 1 }}>
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.body.size}
                color={COLORS.textPrimary}
              >
                {post.user}
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                {post.time}
              </Typography>
            </View>
          </View>
          <Typography
            size={TYPE.body.size}
            color={COLORS.textPrimary}
            lineHeight={22}
            mB={16}
          >
            {post.detailContent || post.content}
          </Typography>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setLiked(v => !v)}
              activeOpacity={0.88}
            >
              <Icon
                name={liked ? 'heart' : 'heart-outline'}
                iconFamily="Ionicons"
                size={18}
                color={COLORS.primary}
              />
              <Typography
                size={TYPE.body.size}
                color={COLORS.primary}
                fFamily="barlowMedium500"
                mL={6}
              >
                {post.likes}
              </Typography>
            </TouchableOpacity>
            <View style={styles.actionBtn}>
              <Icon
                name="chatbubble-outline"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.textSecondary}
              />
              <Typography size={TYPE.body.size} color={COLORS.textSecondary} mL={6}>
                {post.replies}
              </Typography>
            </View>
            <TouchableOpacity style={styles.shareBtn} activeOpacity={0.88}>
              <Icon
                name="share-outline"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Typography
          fFamily={TYPE.h2.fFamily}
          size={TYPE.h2.size}
          color={COLORS.textPrimary}
          mB={SPACING.component}
        >
          Replies
        </Typography>

        <View style={styles.repliesList}>
          {POST_REPLIES.map((reply, i) => (
            <View
              key={`${reply.user}-${i}`}
              style={[GLOBALSTYLE.screenCard, styles.replyCard]}
            >
              <View style={styles.replyHeader}>
                <View style={styles.avatarSm}>
                  <Typography
                    size={10}
                    color={COLORS.primary}
                    fFamily="barlowBold700"
                  >
                    {getInitials(reply.user)}
                  </Typography>
                </View>
                <View>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                  >
                    {reply.user}
                  </Typography>
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                    {reply.time}
                  </Typography>
                </View>
              </View>
              <Typography size={TYPE.body.size} color={COLORS.textPrimary} lineHeight={22}>
                {reply.content}
              </Typography>
              <TouchableOpacity style={styles.likeReply} activeOpacity={0.88}>
                <Icon
                  name="heart-outline"
                  iconFamily="Ionicons"
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={4}>
                  Like
                </Typography>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.replyBar,
          { paddingBottom: Math.max(insets.bottom, Sizer.vSize(12)) },
        ]}
      >
        <TextInput
          value={replyText}
          onChangeText={setReplyText}
          placeholder="Write a reply..."
          placeholderTextColor={COLORS.textSecondary}
          style={styles.replyInput}
        />
        <TouchableOpacity style={styles.sendBtn} activeOpacity={0.88}>
          <Icon name="send" iconFamily="Ionicons" size={20} color={COLORS.white100} />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default CommunityDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  postCard: {
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(SPACING.section),
    ...SHADOWS.card,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(12),
  },
  avatarLg: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
    paddingTop: Sizer.vSize(12),
    gap: Sizer.hSize(16),
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareBtn: {
    marginLeft: 'auto',
  },
  repliesList: {
    gap: Sizer.vSize(SPACING.component),
  },
  replyCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(8),
  },
  avatarSm: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeReply: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(8),
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(12),
    backgroundColor: COLORS.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
  },
  replyInput: {
    flex: 1,
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.mainBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    fontFamily: 'Barlow-Regular',
    fontSize: Sizer.fS(TYPE.body.size),
    color: COLORS.textPrimary,
  },
  sendBtn: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
