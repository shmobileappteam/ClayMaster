import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Container, FormController, Typography, AppLoader } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { ScreenOverlayLoader } from '../../../components';
import ProfileField from '../../../components/profile/ProfileField';
import CustomDropdown from '../../../components/customFields/CustomDropDown';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import {
  createForum,
  getForumCategories,
  updateForum,
} from '../../../api/forumService';
import {
  getInitials,
  mapForumCategory,
  SUGGESTED_TAGS,
} from '../../../constants/community';
import validatoinSchema from '../../../validations';
import { showToast } from '../../../utils';

/** Create or edit forum topic — FormController + Yup. */
const CreatePostScreen = ({ navigation, route }) => {
  const blocked = useRequireLibraryMode();
  const queryClient = useQueryClient();
  const { user } = useSelector(state => state.app);

  const editParams = route?.params || {};
  const isEdit = editParams.mode === 'edit' && editParams.forumId != null;
  const forumId = editParams.forumId;
  const editSlug = editParams.slug;

  const { data: catData, isLoading: catsLoading } = useCustomQuery({
    queryKey: ['forumCategories'],
    queryFn: getForumCategories,
  });

  const categoryOptions = useMemo(() => {
    return (catData?.items || [])
      .map(mapForumCategory)
      .filter(Boolean)
      .map(c => ({ label: c.name, value: String(c.id) }));
  }, [catData?.items]);

  const displayName = useMemo(() => {
    const full = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim();
    return full || user?.username || 'Member';
  }, [user]);

  const initialValues = useMemo(() => {
    if (isEdit) {
      const cat =
        editParams.categoryId != null
          ? String(editParams.categoryId)
          : categoryOptions[0]?.value || '';
      const hasPoll = Boolean(editParams.enablePoll);
      return {
        title: editParams.title || '',
        category_id: cat,
        description: editParams.description || '',
        tags: Array.isArray(editParams.tags) ? editParams.tags : [],
        enable_poll: hasPoll,
        poll_question: editParams.pollQuestion || '',
        poll_option_a: editParams.pollOptionA || '',
        poll_option_b: editParams.pollOptionB || '',
      };
    }
    return {
      title: '',
      category_id: categoryOptions[0]?.value || '',
      description: '',
      tags: [],
      enable_poll: false,
      poll_question: '',
      poll_option_a: '',
      poll_option_b: '',
    };
  }, [isEdit, editParams, categoryOptions]);

  const { mutate, isPending } = useCustomMutation({
    mutationFn: values => {
      if (isEdit) {
        return updateForum(forumId, values);
      }
      return createForum(values);
    },
    onSuccess: body => {
      queryClient.invalidateQueries({ queryKey: ['forums'] });
      if (isEdit && editSlug) {
        queryClient.invalidateQueries({ queryKey: ['forum', editSlug] });
      }
      showToast({
        title:
          body?.message ||
          (isEdit ? 'Topic updated successfully!' : 'Topic created successfully!'),
        type: 'success',
      });
      if (isEdit) {
        navigation.goBack();
        return;
      }
      const slug = body?.data?.slug;
      const id = body?.data?.id;
      if (slug) {
        navigation.replace('CommunityDetailScreen', {
          slug,
          id,
          title: body?.data?.title,
        });
      } else {
        navigation.goBack();
      }
    },
    onError: res => {
      if (res?.status === 422) return;
      showToast({
        title:
          res?.status === 403
            ? res?.data?.message ||
              'An active subscription is required to post.'
            : res?.data?.message ||
              (isEdit ? 'Could not update topic.' : 'Could not create topic.'),
        type: 'danger',
      });
    },
    on422Error: () => {
      showToast({
        title: 'Please check the highlighted fields.',
        type: 'danger',
      });
    },
  });

  if (blocked) {
    return null;
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title={isEdit ? 'Edit Post' : 'Create Post'}
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FormController
          initialValues={initialValues}
          enableReinitialize
          validationSchema={
            validatoinSchema.communityValidations.CreateForumSchema
          }
          onSubmit={values => {
            const tags = (values.tags || []).map(t =>
              String(t).replace(/^#/, '').trim(),
            );
            const enablePoll = Boolean(values.enable_poll);
            const pollOptions = enablePoll
              ? [
                  values.poll_option_a.trim(),
                  values.poll_option_b.trim(),
                  // Keep any 3rd+ options from the original topic so update doesn't drop them
                  ...(isEdit && Array.isArray(editParams.pollExtraOptions)
                    ? editParams.pollExtraOptions
                    : []),
                ].filter(Boolean)
              : undefined;
            mutate({
              title: values.title.trim(),
              category_id: values.category_id,
              description: values.description.trim(),
              tags,
              enable_poll: enablePoll,
              poll_question: enablePoll
                ? values.poll_question?.trim()
                : undefined,
              poll_options: pollOptions,
            });
          }}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => {
            const toggleTag = tag => {
              const clean = tag.replace(/^#/, '');
              const current = values.tags || [];
              const next = current.includes(clean)
                ? current.filter(t => t !== clean)
                : [...current, clean];
              setFieldValue('tags', next);
            };

            return (
              <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.authorRow}>
                  <View style={styles.authorAvatar}>
                    <Typography
                      size={TYPE.caption.size}
                      color={COLORS.white100}
                      fFamily="barlowBold700"
                    >
                      {getInitials(displayName)}
                    </Typography>
                  </View>
                  <View>
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={TYPE.body.size}
                      color={COLORS.textPrimary}
                    >
                      {displayName}
                    </Typography>
                    <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                      {isEdit
                        ? 'Editing your topic'
                        : 'Posting to Private Community'}
                    </Typography>
                  </View>
                </View>

                <ProfileField
                  label="Title"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  placeholder="What’s your topic?"
                  error={errors.title}
                />

                <View style={styles.fieldGroup}>
                  <Typography
                    fFamily="barlowMedium500"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                    mB={6}
                  >
                    Category
                  </Typography>
                  {catsLoading ? (
                    <AppLoader />
                  ) : (
                    <CustomDropdown
                      key={`cat-${categoryOptions.length}-${values.category_id}`}
                      data={categoryOptions}
                      defaultValue={values.category_id}
                      placeholder="Select category"
                      onChange={item =>
                        setFieldValue('category_id', item?.value ?? item)
                      }
                    />
                  )}
                  {errors.category_id ? (
                    <Typography size={12} color={COLORS.destructive} mT={4}>
                      {errors.category_id}
                    </Typography>
                  ) : null}
                </View>

                <ProfileField
                  label="Description"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  placeholder="Share context, questions, or what worked for you..."
                  multiline
                  numberOfLines={6}
                  error={errors.description}
                />

                <Typography
                  fFamily="barlowMedium500"
                  size={TYPE.body.size}
                  color={COLORS.textPrimary}
                  mB={8}
                >
                  Tags
                </Typography>
                <View style={styles.tagsWrap}>
                  {SUGGESTED_TAGS.map(tag => {
                    const active = (values.tags || []).includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        style={[styles.tag, active && styles.tagActive]}
                        onPress={() => toggleTag(tag)}
                        activeOpacity={0.88}
                      >
                        <Typography
                          size={TYPE.caption.size}
                          color={COLORS.primary}
                          fFamily="barlowMedium500"
                        >
                          #{tag}
                        </Typography>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={[GLOBALSTYLE.screenCard, styles.pollCard]}>
                  <View style={styles.pollHeader}>
                    <View style={{ flex: 1 }}>
                      <Typography
                        fFamily="barlowSemiBold600"
                        size={15}
                        color={COLORS.textPrimary}
                      >
                        {isEdit ? 'Poll' : 'Add a poll'}
                      </Typography>
                      <Typography size={12} color={COLORS.textSecondary} mT={2}>
                        {isEdit
                          ? 'Keep enabled to preserve the poll when saving'
                          : 'Optional — needs at least two options'}
                      </Typography>
                    </View>
                    <Switch
                      value={Boolean(values.enable_poll)}
                      onValueChange={v => setFieldValue('enable_poll', v)}
                      trackColor={{
                        false: COLORS.borderMuted,
                        true: 'rgba(235,108,15,0.45)',
                      }}
                      thumbColor={
                        values.enable_poll ? COLORS.primary : COLORS.white100
                      }
                    />
                  </View>

                  {values.enable_poll ? (
                    <View
                      style={{
                        marginTop: Sizer.vSize(12),
                        gap: Sizer.vSize(4),
                      }}
                    >
                      <ProfileField
                        label="Poll question"
                        value={values.poll_question}
                        onChangeText={handleChange('poll_question')}
                        onBlur={handleBlur('poll_question')}
                        placeholder="What should members vote on?"
                        error={errors.poll_question}
                      />
                      <ProfileField
                        label="Option 1"
                        value={values.poll_option_a}
                        onChangeText={handleChange('poll_option_a')}
                        onBlur={handleBlur('poll_option_a')}
                        placeholder="First choice"
                        error={errors.poll_option_a}
                      />
                      <ProfileField
                        label="Option 2"
                        value={values.poll_option_b}
                        onChangeText={handleChange('poll_option_b')}
                        onBlur={handleBlur('poll_option_b')}
                        placeholder="Second choice"
                        error={errors.poll_option_b}
                      />
                    </View>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[styles.publishBtn, isPending && styles.publishDisabled]}
                  onPress={handleSubmit}
                  activeOpacity={0.88}
                  disabled={isPending}
                >
                  <Icon
                    name={isEdit ? 'checkmark' : 'send'}
                    iconFamily="Ionicons"
                    size={16}
                    color={COLORS.white100}
                  />
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.h3.size}
                    color={COLORS.white100}
                    mL={8}
                  >
                    {isEdit ? 'Save changes' : 'Publish Post'}
                  </Typography>
                </TouchableOpacity>
              </ScrollView>
            );
          }}
        </FormController>
      </KeyboardAvoidingView>

      <ScreenOverlayLoader visible={isPending} />
    </Container>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(4),
  },
  authorAvatar: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldGroup: { marginBottom: Sizer.vSize(4) },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(4),
  },
  tag: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(6),
    backgroundColor: COLORS.primaryLight,
    borderRadius: Sizer.hSize(999),
  },
  tagActive: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pollCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  pollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
  },
  publishBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(8),
  },
  publishDisabled: { opacity: 0.7 },
});
