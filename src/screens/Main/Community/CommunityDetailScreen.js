import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import useImagePicker from '../../../hooks/useImagePicker';
import {
  getForum,
  postForumReply,
  toggleReplyHelpful,
  reportForum,
  reportForumReply,
  voteForumPoll,
  deleteForum,
  deleteForumReply,
  markBestAnswer,
} from '../../../api/forumService';
import {
  formatRelativeTime,
  getInitials,
  mapForumDetail,
  mapForumReply,
} from '../../../constants/community';
import { showToast } from '../../../utils';

const attachmentUri = attachment => {
  if (!attachment) return null;
  if (typeof attachment === 'string') return attachment;
  return attachment.url || attachment.uri || attachment.path || null;
};

const isImageUri = uri =>
  uri && /\.(jpe?g|png|gif|webp)(\?|$)/i.test(String(uri));

const AuthorAvatar = ({ name, avatarUrl }) => {
  if (avatarUrl) {
    return <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />;
  }
  return (
    <View style={styles.avatar}>
      <Typography
        size={TYPE.caption.size}
        color={COLORS.white100}
        fFamily="barlowBold700"
      >
        {getInitials(name)}
      </Typography>
    </View>
  );
};

/** Forum topic detail — full live API flow. */
const CommunityDetailScreen = ({ navigation, route }) => {
  const blocked = useRequireLibraryMode();
  const queryClient = useQueryClient();
  const { user } = useSelector(state => state.app);
  const { imageUri, openGallery, clearImage, error: imageError } =
    useImagePicker();

  const slug =
    route?.params?.slug || route?.params?.post?.slug || null;
  const routeForumId = route?.params?.id ?? null;

  const [replyDraft, setReplyDraft] = useState('');
  /** @type {null | { type: 'topic' | 'reply', id?: number|string }} */
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('');

  const {
    data: forumBody,
    isLoading: forumLoading,
    isError: forumError,
    error: forumErr,
    refetch: refetchForum,
    isFetching: forumFetching,
  } = useCustomQuery({
    queryKey: ['forum', slug],
    queryFn: () => getForum(slug),
    enabled: Boolean(slug),
  });

  const post = useMemo(() => mapForumDetail(forumBody), [forumBody]);

  const replies = useMemo(() => {
    return (forumBody?.replies || []).map(mapForumReply).filter(Boolean);
  }, [forumBody?.replies]);

  const forumId = post?.id ?? routeForumId;
  const currentUserId = user?.id != null ? String(user.id) : null;
  const isTopicOwner =
    currentUserId != null &&
    post?.userId != null &&
    String(post.userId) === currentUserId;

  const invalidateTopic = () => {
    queryClient.invalidateQueries({ queryKey: ['forum', slug] });
    queryClient.invalidateQueries({ queryKey: ['forums'] });
  };

  const { mutate: sendReply, isPending: replyPending } = useCustomMutation({
    mutationFn: ({ content, attachment }) =>
      postForumReply(slug, { content, attachment }),
    onSuccess: body => {
      setReplyDraft('');
      clearImage();
      invalidateTopic();
      showToast({
        title: body?.message || 'Reply posted.',
        type: 'success',
      });
    },
    onError: res => {
      showToast({
        title: res?.data?.message || 'Could not post reply.',
        type: 'danger',
      });
    },
  });

  const { mutate: toggleHelpful, isPending: helpfulPending } =
    useCustomMutation({
      mutationFn: replyId => toggleReplyHelpful(replyId),
      onSuccess: () => invalidateTopic(),
      onError: res => {
        showToast({
          title: res?.data?.message || 'Could not update helpful vote.',
          type: 'danger',
        });
      },
    });

  const { mutate: castPollVote, isPending: pollPending } = useCustomMutation({
    mutationFn: optionId => voteForumPoll(forumId, optionId),
    onSuccess: body => {
      invalidateTopic();
      showToast({
        title: body?.message || 'Vote recorded.',
        type: 'success',
      });
    },
    onError: res => {
      showToast({
        title: res?.data?.message || 'Could not submit vote.',
        type: 'danger',
      });
    },
  });

  const { mutate: submitReport, isPending: reportPending } = useCustomMutation({
    mutationFn: ({ type, id, reason }) => {
      if (type === 'reply') return reportForumReply(id, reason);
      return reportForum(id, reason);
    },
    onSuccess: body => {
      setReportTarget(null);
      setReportReason('');
      showToast({
        title: body?.message || 'Report submitted.',
        type: 'success',
      });
    },
    onError: res => {
      showToast({
        title: res?.data?.message || 'Could not submit report.',
        type: 'danger',
      });
    },
  });

  const { mutate: removeTopic, isPending: deleteTopicPending } =
    useCustomMutation({
      mutationFn: () => deleteForum(forumId),
      onSuccess: body => {
        queryClient.invalidateQueries({ queryKey: ['forums'] });
        showToast({
          title: body?.message || 'Topic deleted.',
          type: 'success',
        });
        navigation.goBack();
      },
      onError: res => {
        showToast({
          title: res?.data?.message || 'Could not delete topic.',
          type: 'danger',
        });
      },
    });

  const { mutate: removeReply, isPending: deleteReplyPending } =
    useCustomMutation({
      mutationFn: replyId => deleteForumReply(replyId),
      onSuccess: body => {
        invalidateTopic();
        showToast({
          title: body?.message || 'Reply deleted.',
          type: 'success',
        });
      },
      onError: res => {
        showToast({
          title: res?.data?.message || 'Could not delete reply.',
          type: 'danger',
        });
      },
    });

  const { mutate: setBestAnswer, isPending: bestPending } = useCustomMutation({
    mutationFn: replyId => markBestAnswer(replyId),
    onSuccess: body => {
      invalidateTopic();
      showToast({
        title: body?.message || 'Marked as best answer.',
        type: 'success',
      });
    },
    onError: res => {
      showToast({
        title: res?.data?.message || 'Could not mark best answer.',
        type: 'danger',
      });
    },
  });

  if (blocked) {
    return null;
  }

  if (!slug) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        <LibraryHeader
          title="Discussion"
          showBack
          showNotification={false}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.centered}>
          <Typography color={COLORS.textSecondary} tAlign="center">
            Missing topic. Go back and open a post from the community list.
          </Typography>
        </View>
      </Container>
    );
  }

  const onSendReply = () => {
    const content = replyDraft.trim();
    if (content.length < 1) {
      showToast({ title: 'Write a reply first.', type: 'danger' });
      return;
    }
    const attachment = imageUri?.uri
      ? {
          uri: imageUri.uri,
          type: imageUri.type || 'image/jpeg',
          fileName: imageUri.fileName || 'attachment.jpg',
        }
      : undefined;
    sendReply({ content, attachment });
  };

  const onReport = () => {
    if (!reportTarget) return;
    const id =
      reportTarget.type === 'topic' ? forumId : reportTarget.id;
    if (id == null) {
      showToast({ title: 'Unable to report.', type: 'danger' });
      return;
    }
    const reason = reportReason.trim();
    if (reason.length < 10) {
      showToast({
        title: 'Please explain the issue (at least 10 characters).',
        type: 'danger',
      });
      return;
    }
    submitReport({ type: reportTarget.type, id, reason });
  };

  const confirmDeleteTopic = () => {
    Alert.alert(
      'Delete topic',
      'This will permanently remove the topic and its replies. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeTopic(),
        },
      ],
    );
  };

  const confirmDeleteReply = replyId => {
    Alert.alert('Delete reply', 'Remove this reply?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeReply(replyId),
      },
    ]);
  };

  const openEdit = () => {
    navigation.navigate('CreatePostScreen', {
      mode: 'edit',
      forumId: post.id,
      slug: post.slug,
      title: post.title,
      categoryId: post.categoryId,
      description: post.description,
      tags: post.tags || [],
    });
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Discussion"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />

      {forumLoading && !post ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : forumError || !post ? (
        <View style={styles.centered}>
          <Typography color={COLORS.textSecondary} tAlign="center" mB={12}>
            {forumErr?.data?.message ||
              'This topic could not be loaded. It may have been removed.'}
          </Typography>
          <TouchableOpacity onPress={() => refetchForum()} activeOpacity={0.88}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Try again
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={forumFetching && !forumLoading}
                onRefresh={refetchForum}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
          >
            <View style={styles.metaTop}>
              <View style={styles.categoryPill}>
                <Typography
                  size={11}
                  color={COLORS.primary}
                  fFamily="barlowSemiBold600"
                >
                  {post.category?.name || 'Discussion'}
                </Typography>
              </View>
              <View style={styles.metaActions}>
                {isTopicOwner ? (
                  <>
                    <TouchableOpacity
                      onPress={openEdit}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Icon
                        name="create-outline"
                        iconFamily="Ionicons"
                        size={20}
                        color={COLORS.textSecondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={confirmDeleteTopic}
                      disabled={deleteTopicPending}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Icon
                        name="trash-outline"
                        iconFamily="Ionicons"
                        size={20}
                        color={COLORS.destructive}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      setReportTarget(t =>
                        t?.type === 'topic' ? null : { type: 'topic' },
                      )
                    }
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon
                      name="flag-outline"
                      iconFamily="Ionicons"
                      size={18}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <Typography
              fFamily="barlowBold700"
              size={TYPE.h2.size}
              color={COLORS.textPrimary}
              mB={12}
            >
              {post.title}
            </Typography>

            <View style={styles.authorRow}>
              <AuthorAvatar
                name={post.author?.name}
                avatarUrl={post.author?.avatar}
              />
              <View style={{ flex: 1 }}>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={TYPE.body.size}
                  color={COLORS.textPrimary}
                >
                  {post.author?.name || 'Member'}
                </Typography>
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                  {formatRelativeTime(post.createdAt)}
                  {post.isEdited ? ' · edited' : ''}
                </Typography>
              </View>
            </View>

            <Typography
              size={TYPE.body.size}
              color={COLORS.textPrimary}
              style={styles.body}
            >
              {post.description}
            </Typography>

            {(() => {
              const topicAtt = attachmentUri(post.attachment);
              if (!topicAtt) return null;
              if (isImageUri(topicAtt)) {
                return (
                  <Image
                    source={{ uri: topicAtt }}
                    style={styles.attachPreview}
                    resizeMode="cover"
                  />
                );
              }
              return (
                <Typography size={12} color={COLORS.primary} mB={10}>
                  Attachment attached
                </Typography>
              );
            })()}

            {post.tags?.length > 0 ? (
              <View style={styles.tagsRow}>
                {post.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Typography size={TYPE.caption.size} color={COLORS.primary}>
                      #{tag}
                    </Typography>
                  </View>
                ))}
              </View>
            ) : null}

            {post.poll ? (
              <View style={[GLOBALSTYLE.screenCard, styles.pollCard]}>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={15}
                  color={COLORS.textPrimary}
                  mB={10}
                >
                  {post.poll.question}
                </Typography>
                {post.poll.options.map(opt => {
                  const pct =
                    opt.percentage > 0
                      ? Math.round(opt.percentage)
                      : post.poll.totalVotes > 0
                        ? Math.round((opt.votes / post.poll.totalVotes) * 100)
                        : 0;
                  const selected =
                    post.poll.userVotedOptionId != null &&
                    String(post.poll.userVotedOptionId) === String(opt.id);
                  const canVote =
                    !post.poll.hasVoted && !pollPending && forumId != null;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.pollOption,
                        selected && styles.pollOptionSelected,
                      ]}
                      activeOpacity={0.88}
                      disabled={!canVote}
                      onPress={() => castPollVote(opt.id)}
                    >
                      <View style={styles.pollOptionTop}>
                        <Typography
                          fFamily="barlowMedium500"
                          size={14}
                          color={COLORS.textPrimary}
                          style={{ flex: 1 }}
                        >
                          {opt.text}
                        </Typography>
                        {post.poll.hasVoted || post.poll.totalVotes > 0 ? (
                          <Typography
                            size={12}
                            color={COLORS.textSecondary}
                            fFamily="barlowSemiBold600"
                          >
                            {pct}%
                          </Typography>
                        ) : null}
                      </View>
                      {post.poll.hasVoted ? (
                        <View style={styles.pollBarTrack}>
                          <View
                            style={[styles.pollBarFill, { width: `${pct}%` }]}
                          />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
                <Typography size={11} color={COLORS.textSecondary} mT={8}>
                  {post.poll.totalVotes} vote
                  {post.poll.totalVotes === 1 ? '' : 's'}
                  {post.poll.hasVoted ? ' · You voted' : ''}
                </Typography>
              </View>
            ) : null}

            {reportTarget ? (
              <View style={[GLOBALSTYLE.screenCard, styles.reportCard]}>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={15}
                  color={COLORS.textPrimary}
                  mB={8}
                >
                  {reportTarget.type === 'reply'
                    ? 'Report this reply'
                    : 'Report this topic'}
                </Typography>
                <TextInput
                  style={styles.reportInput}
                  value={reportReason}
                  onChangeText={setReportReason}
                  placeholder="Describe the issue (spam, abuse, etc.)"
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  maxLength={500}
                />
                <View style={styles.reportActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setReportTarget(null);
                      setReportReason('');
                    }}
                  >
                    <Typography color={COLORS.textSecondary}>Cancel</Typography>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reportBtn}
                    onPress={onReport}
                    disabled={reportPending}
                  >
                    {reportPending ? (
                      <ActivityIndicator color={COLORS.white100} size="small" />
                    ) : (
                      <Typography
                        color={COLORS.white100}
                        fFamily="barlowSemiBold600"
                      >
                        Submit report
                      </Typography>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Icon
                  name="eye-outline"
                  iconFamily="Ionicons"
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Typography size={12} color={COLORS.textSecondary} mL={4}>
                  {post.viewsCount} views
                </Typography>
              </View>
              <View style={styles.stat}>
                <Icon
                  name="chatbubble-outline"
                  iconFamily="Ionicons"
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Typography size={12} color={COLORS.textSecondary} mL={4}>
                  {post.totalRepliesCount ?? post.repliesCount} replies
                </Typography>
              </View>
            </View>

            <Typography
              fFamily="barlowBold700"
              size={TYPE.h3.size}
              color={COLORS.textPrimary}
              mT={8}
              mB={12}
            >
              Replies
            </Typography>

            {replies.length === 0 ? (
              <Typography color={COLORS.textSecondary} size={TYPE.body.size}>
                No replies yet. Be the first to respond.
              </Typography>
            ) : (
              replies.map(reply => {
                const isOwn =
                  currentUserId != null &&
                  reply.author?.id != null &&
                  String(reply.author.id) === currentUserId;
                const att = attachmentUri(reply.attachment);
                return (
                  <View key={reply.id} style={styles.replyCard}>
                    <View style={styles.authorRow}>
                      <AuthorAvatar
                        name={reply.author?.name}
                        avatarUrl={reply.author?.avatar}
                      />
                      <View style={{ flex: 1 }}>
                        <View style={styles.replyNameRow}>
                          <Typography
                            fFamily="barlowSemiBold600"
                            size={TYPE.body.size}
                            color={COLORS.textPrimary}
                          >
                            {reply.author?.name || 'Member'}
                          </Typography>
                          {reply.isBestAnswer ? (
                            <View style={styles.bestPill}>
                              <Typography
                                size={10}
                                color={COLORS.green}
                                fFamily="barlowSemiBold600"
                              >
                                Best answer
                              </Typography>
                            </View>
                          ) : null}
                        </View>
                        <Typography
                          size={TYPE.caption.size}
                          color={COLORS.textSecondary}
                        >
                          {formatRelativeTime(reply.createdAt) || reply.time}
                          {reply.isEdited ? ' · edited' : ''}
                        </Typography>
                      </View>
                    </View>
                    <Typography
                      size={TYPE.body.size}
                      color={COLORS.textPrimary}
                      mT={10}
                    >
                      {reply.content}
                    </Typography>
                    {att && isImageUri(att) ? (
                      <Image
                        source={{ uri: att }}
                        style={styles.replyAttach}
                        resizeMode="cover"
                      />
                    ) : null}
                    <View style={styles.replyActions}>
                      <TouchableOpacity
                        style={styles.actionChip}
                        onPress={() => toggleHelpful(reply.id)}
                        disabled={helpfulPending || isOwn}
                        activeOpacity={0.88}
                      >
                        <Icon
                          name={
                            reply.isHelpfulByMe
                              ? 'thumbs-up'
                              : 'thumbs-up-outline'
                          }
                          iconFamily="Ionicons"
                          size={14}
                          color={
                            reply.isHelpfulByMe
                              ? COLORS.primary
                              : COLORS.textSecondary
                          }
                        />
                        <Typography
                          size={12}
                          color={
                            reply.isHelpfulByMe
                              ? COLORS.primary
                              : COLORS.textSecondary
                          }
                          mL={4}
                          fFamily="barlowMedium500"
                        >
                          Helpful · {reply.helpfulCount}
                        </Typography>
                      </TouchableOpacity>

                      {isTopicOwner && !reply.isBestAnswer ? (
                        <TouchableOpacity
                          style={styles.actionChip}
                          onPress={() => setBestAnswer(reply.id)}
                          disabled={bestPending}
                          activeOpacity={0.88}
                        >
                          <Icon
                            name="ribbon-outline"
                            iconFamily="Ionicons"
                            size={14}
                            color={COLORS.green}
                          />
                          <Typography
                            size={12}
                            color={COLORS.green}
                            mL={4}
                            fFamily="barlowMedium500"
                          >
                            Best
                          </Typography>
                        </TouchableOpacity>
                      ) : null}

                      {isOwn ? (
                        <TouchableOpacity
                          style={styles.actionChip}
                          onPress={() => confirmDeleteReply(reply.id)}
                          disabled={deleteReplyPending}
                          activeOpacity={0.88}
                        >
                          <Icon
                            name="trash-outline"
                            iconFamily="Ionicons"
                            size={14}
                            color={COLORS.destructive}
                          />
                          <Typography
                            size={12}
                            color={COLORS.destructive}
                            mL={4}
                            fFamily="barlowMedium500"
                          >
                            Delete
                          </Typography>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.actionChip}
                          onPress={() =>
                            setReportTarget({ type: 'reply', id: reply.id })
                          }
                          activeOpacity={0.88}
                        >
                          <Icon
                            name="flag-outline"
                            iconFamily="Ionicons"
                            size={14}
                            color={COLORS.textSecondary}
                          />
                          <Typography
                            size={12}
                            color={COLORS.textSecondary}
                            mL={4}
                            fFamily="barlowMedium500"
                          >
                            Report
                          </Typography>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          <View style={styles.composerWrap}>
            {imageUri?.uri ? (
              <View style={styles.attachRow}>
                <Image
                  source={{ uri: imageUri.uri }}
                  style={styles.attachThumb}
                />
                <TouchableOpacity onPress={clearImage}>
                  <Typography size={12} color={COLORS.destructive}>
                    Remove
                  </Typography>
                </TouchableOpacity>
              </View>
            ) : null}
            {imageError ? (
              <Typography size={11} color={COLORS.destructive} mB={4}>
                {imageError}
              </Typography>
            ) : null}
            <View style={styles.composer}>
              <TouchableOpacity
                style={styles.attachBtn}
                onPress={openGallery}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon
                  name="image-outline"
                  iconFamily="Ionicons"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.composerInput}
                value={replyDraft}
                onChangeText={setReplyDraft}
                placeholder="Write a reply…"
                placeholderTextColor={COLORS.textMuted}
                multiline
                maxLength={5000}
              />
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  (replyPending || !replyDraft.trim()) && styles.sendDisabled,
                ]}
                onPress={onSendReply}
                disabled={replyPending || !replyDraft.trim()}
                activeOpacity={0.88}
              >
                {replyPending ? (
                  <ActivityIndicator color={COLORS.white100} size="small" />
                ) : (
                  <Icon
                    name="send"
                    iconFamily="Ionicons"
                    size={18}
                    color={COLORS.white100}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </Container>
  );
};

export default CommunityDetailScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
  },
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(12),
    paddingBottom: Sizer.vSize(24),
  },
  metaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(10),
  },
  metaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(14),
  },
  categoryPill: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    backgroundColor: COLORS.primaryLight,
    borderRadius: Sizer.hSize(999),
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(10),
    marginBottom: Sizer.vSize(4),
  },
  avatar: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
  },
  body: {
    lineHeight: TYPE.body.size * 1.45,
    marginTop: Sizer.vSize(12),
    marginBottom: Sizer.vSize(12),
  },
  attachPreview: {
    width: '100%',
    height: Sizer.vSize(180),
    borderRadius: Sizer.hSize(12),
    marginBottom: Sizer.vSize(12),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(12),
  },
  tag: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    backgroundColor: COLORS.primaryLight,
    borderRadius: Sizer.hSize(999),
  },
  pollCard: {
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(12),
    ...SHADOWS.card,
  },
  pollOption: {
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(10),
    padding: Sizer.hSize(10),
    marginBottom: Sizer.vSize(8),
    backgroundColor: COLORS.white100,
  },
  pollOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  pollOptionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
  },
  pollBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderMuted,
    marginTop: Sizer.vSize(8),
    overflow: 'hidden',
  },
  pollBarFill: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  reportCard: {
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(12),
    ...SHADOWS.card,
  },
  reportInput: {
    minHeight: Sizer.vSize(80),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(10),
    padding: Sizer.hSize(12),
    textAlignVertical: 'top',
    color: COLORS.textPrimary,
    fontFamily: 'Barlow-Regular',
    fontSize: TYPE.body.size,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Sizer.hSize(16),
    marginTop: Sizer.vSize(10),
  },
  reportBtn: {
    backgroundColor: COLORS.destructive,
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(8),
    borderRadius: Sizer.hSize(8),
    minWidth: Sizer.hSize(110),
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(16),
    marginBottom: Sizer.vSize(8),
    paddingVertical: Sizer.vSize(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
  },
  stat: { flexDirection: 'row', alignItems: 'center' },
  replyCard: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(10),
    ...SHADOWS.card,
  },
  replyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
    flexWrap: 'wrap',
  },
  bestPill: {
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: 2,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderRadius: Sizer.hSize(999),
  },
  replyAttach: {
    width: '100%',
    height: Sizer.vSize(140),
    borderRadius: Sizer.hSize(10),
    marginTop: Sizer.vSize(10),
  },
  replyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(12),
    marginTop: Sizer.vSize(10),
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizer.vSize(4),
  },
  composerWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
    backgroundColor: COLORS.white100,
    paddingTop: Sizer.vSize(8),
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(10),
  },
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(10),
    marginBottom: Sizer.vSize(6),
  },
  attachThumb: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(8),
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Sizer.hSize(8),
  },
  attachBtn: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerInput: {
    flex: 1,
    maxHeight: Sizer.vSize(100),
    minHeight: Sizer.vSize(40),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(20),
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(8),
    color: COLORS.textPrimary,
    fontFamily: 'Barlow-Regular',
    fontSize: TYPE.body.size,
  },
  sendBtn: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.5 },
});
