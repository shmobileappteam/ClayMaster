import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import {
  getInitials,
  SUGGESTED_TAGS,
} from '../../../constants/communityPosts';
import { showToast } from '../../../utils';

/**
 * ClayMaster-App-UI `CreatePost.tsx`
 */
const CreatePostScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.app);
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const displayName =
    `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || 'John Smith';

  const toggleTag = tag => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const handlePublish = () => {
    showToast({ title: 'Post published' });
    navigation.goBack();
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Create Post"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
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
              Posting publicly
            </Typography>
          </View>
        </View>

        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="What's on your mind? Share your shooting experience..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={styles.textArea}
          autoFocus
        />

        <View style={styles.attachRow}>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.88}>
            <Icon
              name="image-outline"
              iconFamily="Ionicons"
              size={20}
              color={COLORS.textSecondary}
            />
            <Typography size={TYPE.body.size} color={COLORS.textSecondary} mL={8}>
              Add Photo
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.88}>
            <Icon
              name="pricetag-outline"
              iconFamily="Ionicons"
              size={20}
              color={COLORS.textSecondary}
            />
            <Typography size={TYPE.body.size} color={COLORS.textSecondary} mL={8}>
              Add Tag
            </Typography>
          </TouchableOpacity>
        </View>

        <Typography
          fFamily="barlowMedium500"
          size={TYPE.body.size}
          color={COLORS.textPrimary}
          mB={SPACING.component}
        >
          Suggested Tags
        </Typography>
        <View style={styles.tagsWrap}>
          {SUGGESTED_TAGS.map(tag => {
            const active = selectedTags.includes(tag);
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
                  {tag}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.publishBtn}
          onPress={handlePublish}
          activeOpacity={0.88}
        >
          <Typography
            fFamily="barlowSemiBold600"
            size={TYPE.h3.size}
            color={COLORS.white100}
          >
            Publish Post
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
  },
  authorAvatar: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    minHeight: Sizer.vSize(144),
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(12),
    backgroundColor: COLORS.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    fontFamily: 'Barlow-Regular',
    fontSize: Sizer.fS(TYPE.body.size),
    color: COLORS.textPrimary,
  },
  attachRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
  },
  attachBtn: {
    flex: 1,
    height: Sizer.vSize(48),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
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
  publishBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(8),
  },
});
