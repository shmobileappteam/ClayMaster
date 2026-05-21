import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  COMMUNITY_POSTS,
  getInitials,
} from '../../../constants/communityPosts';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';

/**
 * ClayMaster-App-UI `Community.tsx`
 */
const CommunityScreen = ({ navigation }) => {
  const createBtn = (
    <TouchableOpacity
      style={styles.createBtn}
      onPress={() => navigateFromTabToStack(navigation, 'CreatePostScreen')}
      activeOpacity={0.88}
    >
      <Icon name="add" iconFamily="Ionicons" size={18} color={COLORS.white100} />
    </TouchableOpacity>
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Community"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
        rightSlot={createBtn}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {COMMUNITY_POSTS.map(post => (
          <TouchableOpacity
            key={post.id}
            style={[GLOBALSTYLE.screenCard, styles.postCard]}
            activeOpacity={0.88}
            onPress={() =>
              navigateFromTabToStack(navigation, 'CommunityDetailScreen', {
                id: post.id,
              })
            }
          >
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Typography
                  size={TYPE.caption.size}
                  color={COLORS.primary}
                  fFamily="barlowBold700"
                >
                  {getInitials(post.user)}
                </Typography>
              </View>
              <View>
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
              mB={12}
              lineHeight={22}
            >
              {post.content}
            </Typography>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Icon
                  name="heart-outline"
                  iconFamily="Ionicons"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={4}>
                  {post.likes}
                </Typography>
              </View>
              <View style={styles.stat}>
                <Icon
                  name="chatbubble-outline"
                  iconFamily="Ionicons"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={4}>
                  {post.replies}
                </Typography>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.component),
  },
  createBtn: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(12),
  },
  avatar: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(16),
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
