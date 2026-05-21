import React, { useEffect } from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import ProfileField from '../../../components/profile/ProfileField';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { editProfile } from '../../../api/userService';
import { setUser } from '../../../redux/slices/appSlice';
import { maskPhoneNumber, showToast } from '../../../utils';
import useImagePicker from '../../../hooks/useImagePicker';
import { BASE_URL } from '../../../api/endpoints';
import { FormController } from '../../../atomComponents';

/**
 * ClayMaster-App-UI `EditProfile.tsx` — keeps existing editProfile API.
 */
const ProfileDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);
  const { openGallery, imageUri, clearImage } = useImagePicker();

  const { mutate: editProf, isPending } = useCustomMutation({
    mutationFn: editProfile,
    onSuccess: response => {
      if (response?.status) {
        dispatch(setUser({ ...response?.user }));
        showToast({ title: response?.message || 'Profile updated' });
        navigation.goBack();
      }
    },
    onSettled: () => clearImage(),
  });

  const displayName =
    `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || 'Member';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const avatarUri = imageUri?.uri
    ? imageUri.uri
    : user?.profile_image
      ? `${BASE_URL}${user.profile_image}`
      : null;

  const handleSubmit = values => {
    const parts = (values.full_name || '').trim().split(/\s+/);
    const payload = {
      email: user?.email,
      first_name: parts[0] || '',
      last_name: parts.slice(1).join(' ') || '',
      address: values.location || '',
      contact: (values.phone || '').replace(/\D/g, ''),
    };
    if (imageUri?.uri) {
      payload.profile_image = {
        uri: imageUri.uri,
        fileName: imageUri.fileName,
        type: imageUri.type,
      };
    }
    editProf({ id: user?.id, ...payload });
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  return (
    <Container keyboardAvoiding isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Edit Profile"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <FormController
        initialValues={{
          full_name: displayName,
          email: user?.email || '',
          phone: user?.contact || '',
          location: user?.address_1 || '',
          bio: 'Passionate clay shooter. Pro member since 2024.',
        }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: submit, handleChange, handleBlur, values, errors }) => (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrap}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                ) : (
                  <View style={styles.avatar}>
                    <Typography
                      fFamily="barlowBold700"
                      size={32}
                      color={COLORS.white100}
                    >
                      {initials || 'CM'}
                    </Typography>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.cameraBtn}
                  onPress={openGallery}
                  activeOpacity={0.88}
                >
                  <Icon
                    name="camera"
                    iconFamily="Ionicons"
                    size={16}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={openGallery} activeOpacity={0.88}>
                <Typography
                  size={TYPE.caption.size}
                  color={COLORS.primary}
                  fFamily="barlowMedium500"
                  mT={8}
                >
                  Change Photo
                </Typography>
              </TouchableOpacity>
            </View>

            <ProfileField
              label="Full Name"
              value={values.full_name}
              onChangeText={handleChange('full_name')}
              onBlur={handleBlur('full_name')}
              error={errors.full_name}
              placeholder="John Smith"
            />
            <ProfileField
              label="Email"
              value={values.email}
              editable={false}
              placeholder="john.smith@email.com"
            />
            <ProfileField
              label="Phone"
              value={maskPhoneNumber(values.phone)}
              onChangeText={t => handleChange('phone')(t.replace(/\D/g, ''))}
              onBlur={handleBlur('phone')}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
            />
            <ProfileField
              label="Location"
              value={values.location}
              onChangeText={handleChange('location')}
              onBlur={handleBlur('location')}
              error={errors.location}
              placeholder="Dallas, TX"
            />
            <ProfileField
              label="Bio"
              value={values.bio}
              onChangeText={handleChange('bio')}
              multiline
              placeholder="Tell us about yourself"
            />

            <TouchableOpacity
              style={[styles.saveBtn, isPending && styles.saveBtnDisabled]}
              onPress={submit}
              disabled={isPending}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.h3.size}
                color={COLORS.white100}
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Typography>
            </TouchableOpacity>
          </ScrollView>
        )}
      </FormController>
    </Container>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Sizer.vSize(SPACING.section),
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: Sizer.hSize(96),
    height: Sizer.hSize(96),
    borderRadius: Sizer.hSize(48),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: Sizer.hSize(96),
    height: Sizer.hSize(96),
    borderRadius: Sizer.hSize(48),
    backgroundColor: COLORS.surfaceMuted,
  },
  cameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: COLORS.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(8),
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
});
