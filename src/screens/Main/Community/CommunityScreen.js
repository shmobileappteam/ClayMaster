import React, { useMemo, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography, AppLoader } from '../../../atomComponents';
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
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import {
  getForumCategories,
  getForums,
} from '../../../api/forumService';
import {
  FORUM_SORT_OPTIONS,
  getInitials,
  mapForumCategory,
  mapForumTopic,
  stripHtml,
} from '../../../constants/community';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';

/**
 * Private Community — live forum topic list.
 */
const CommunityScreen = ({ navigation }) => {
  const blocked = useRequireLibraryMode();
  const [categoryId, setCategoryId] = useState(null);
  const [sort, setSort] = useState('recent');

  const {
    data: catData,
    isLoading: catsLoading,
  } = useCustomQuery({
    queryKey: ['forumCategories'],
    queryFn: getForumCategories,
  });

  const {
    data: listData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCustomQuery({
    queryKey: ['forums', { categoryId, sort }],
    queryFn: () =>
      getForums({
        sort,
        category: categoryId || undefined,
        page: 1,
        per_page: 30,
      }),
  });

  const categories = useMemo(
    () => (catData?.items || []).map(mapForumCategory).filter(Boolean),
    [catData?.items],
  );

  const topics = useMemo(
    () => (listData?.items || []).map(mapForumTopic).filter(Boolean),
    [listData?.items],
  );

  if (blocked) {
    return null;
  }

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
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        <Typography size={13} color={COLORS.textSecondary} lineHeight={19}>
          Ask questions, share practice notes, and learn with other ClayMaster
          members.
        </Typography>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <TouchableOpacity
            style={[styles.chip, categoryId == null && styles.chipActive]}
            onPress={() => setCategoryId(null)}
            activeOpacity={0.88}
          >
            <Typography
              size={12}
              fFamily="barlowSemiBold600"
              color={categoryId == null ? COLORS.white100 : COLORS.textPrimary}
            >
              All
            </Typography>
          </TouchableOpacity>
          {catsLoading ? (
            <AppLoader />
          ) : (
            categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  categoryId === cat.id && styles.chipActive,
                ]}
                onPress={() => setCategoryId(cat.id)}
                activeOpacity={0.88}
              >
                <Typography
                  size={12}
                  fFamily="barlowSemiBold600"
                  color={
                    categoryId === cat.id ? COLORS.white100 : COLORS.textPrimary
                  }
                >
                  {cat.name}
                </Typography>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {FORUM_SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.sortChip, sort === opt.value && styles.sortChipActive]}
              onPress={() => setSort(opt.value)}
              activeOpacity={0.88}
            >
              <Typography
                size={12}
                fFamily="barlowMedium500"
                color={sort === opt.value ? COLORS.primary : COLORS.textSecondary}
              >
                {opt.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isLoading ? (
          <AppLoader />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load topics. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : topics.length === 0 ? (
          <View style={[GLOBALSTYLE.screenCard, styles.emptyCard]}>
            <Icon
              name="chatbubbles-outline"
              iconFamily="Ionicons"
              size={28}
              color={COLORS.primary}
            />
            <Typography
              fFamily="barlowSemiBold600"
              size={16}
              color={COLORS.textPrimary}
              mT={12}
              textAlign="center"
            >
              No topics yet
            </Typography>
            <Typography
              size={13}
              color={COLORS.textSecondary}
              mT={6}
              textAlign="center"
            >
              Start the conversation — create the first post.
            </Typography>
            <TouchableOpacity
              style={styles.emptyBtn}
              activeOpacity={0.88}
              onPress={() =>
                navigateFromTabToStack(navigation, 'CreatePostScreen')
              }
            >
              <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100}>
                Create post
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          topics.map(post => (
            <TouchableOpacity
              key={post.id}
              style={[GLOBALSTYLE.screenCard, styles.postCard]}
              activeOpacity={0.88}
              onPress={() =>
                navigateFromTabToStack(navigation, 'CommunityDetailScreen', {
                  slug: post.slug,
                  id: post.id,
                  title: post.title,
                })
              }
            >
              <View style={styles.postHeader}>
                {post.avatarUrl ? (
                  <Image
                    source={{ uri: post.avatarUrl }}
                    style={styles.avatarImg}
                  />
                ) : (
                  <View style={styles.avatar}>
                    <Typography
                      size={TYPE.caption.size}
                      color={COLORS.primary}
                      fFamily="barlowBold700"
                    >
                      {getInitials(post.userName)}
                    </Typography>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                  >
                    {post.userName}
                  </Typography>
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                    {[post.time, post.categoryName].filter(Boolean).join(' · ')}
                  </Typography>
                </View>
              </View>

              <Typography
                fFamily="barlowSemiBold600"
                size={15}
                color={COLORS.textPrimary}
                mB={6}
              >
                {post.title}
              </Typography>
              {post.description ? (
                <Typography
                  size={TYPE.body.size}
                  color={COLORS.textSecondary}
                  mB={12}
                  lineHeight={21}
                  numberOfLines={3}
                >
                  {stripHtml(post.description)}
                </Typography>
              ) : null}

              {post.tags.length ? (
                <View style={styles.tagsRow}>
                  {post.tags.slice(0, 3).map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Typography size={11} color={COLORS.primary}>
                        #{tag}
                      </Typography>
                    </View>
                  ))}
                </View>
              ) : null}

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Icon
                    name="eye-outline"
                    iconFamily="Ionicons"
                    size={16}
                    color={COLORS.textSecondary}
                  />
                  <Typography
                    size={TYPE.caption.size}
                    color={COLORS.textSecondary}
                    mL={4}
                  >
                    {post.viewsCount}
                  </Typography>
                </View>
                <View style={styles.stat}>
                  <Icon
                    name="chatbubble-outline"
                    iconFamily="Ionicons"
                    size={16}
                    color={COLORS.textSecondary}
                  />
                  <Typography
                    size={TYPE.caption.size}
                    color={COLORS.textSecondary}
                    mL={4}
                  >
                    {post.repliesCount}
                  </Typography>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  chipsRow: {
    gap: Sizer.hSize(8),
    paddingRight: Sizer.hSize(8),
  },
  chip: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(8),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortChip: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(8),
    backgroundColor: COLORS.surfaceMuted,
  },
  sortChipActive: {
    backgroundColor: COLORS.primaryLight,
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
  avatarImg: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(6),
    marginBottom: Sizer.vSize(10),
  },
  tag: {
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: Sizer.vSize(3),
    borderRadius: Sizer.hSize(8),
    backgroundColor: COLORS.primaryLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(16),
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyCard: {
    padding: Sizer.hSize(24),
    alignItems: 'center',
    ...SHADOWS.card,
  },
  emptyBtn: {
    marginTop: Sizer.vSize(14),
    height: Sizer.vSize(42),
    paddingHorizontal: Sizer.hSize(18),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
