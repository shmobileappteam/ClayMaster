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
import { Container, FormController, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import ProfileField from '../../../components/profile/ProfileField';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { editProfile } from '../../../api/userService';
import { setUser } from '../../../redux/slices/appSlice';
import { formatBackendErrors, maskPhoneNumber, showToast } from '../../../utils';
import useImagePicker from '../../../hooks/useImagePicker';
import { BASE_URL } from '../../../api/endpoints';
import validatoinSchema from '../../../validations';

/**
 * Edit profile — form fields match POST /api/edit-profile payload.
 * first_name, last_name, contact, address, username, profile_image (+ id, email)
 */
const ProfileDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);
  const { openGallery, imageUri, clearImage } = useImagePicker();

  const { mutateAsync: editProf, isPending } = useCustomMutation({
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

  const handleSubmit = async (values, { setErrors }) => {
    const payload = {
      id: user?.id,
      email: user?.email,
      first_name: values.first_name?.trim() || '',
      last_name: values.last_name?.trim() || '',
      username: values.username?.trim() || '',
      contact: (values.contact || '').replace(/\D/g, ''),
      address: values.address?.trim() || '',
    };

    if (imageUri?.uri) {
      payload.profile_image = {
        uri: imageUri.uri,
        fileName: imageUri.fileName,
        type: imageUri.type,
      };
    }

    try {
      await editProf(payload);
    } catch (err) {
      const response = err?.response;
      if (response?.status === 422 && response?.data?.errors) {
        setErrors(formatBackendErrors(response.data.errors));
      }
    }
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
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          username: user?.username || '',
          email: user?.email || '',
          contact: String(user?.contact || '')
            .replace(/\D/g, '')
            .slice(0, 10),
          address: user?.address_1 || user?.address || '',
        }}
        validationSchema={validatoinSchema.authValidations.editProfileSchema}
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
              label="First Name"
              value={values.first_name}
              onChangeText={handleChange('first_name')}
              onBlur={handleBlur('first_name')}
              error={errors.first_name}
              placeholder="First name"
            />
            <ProfileField
              label="Last Name"
              value={values.last_name}
              onChangeText={handleChange('last_name')}
              onBlur={handleBlur('last_name')}
              error={errors.last_name}
              placeholder="Last name"
            />
            <ProfileField
              label="Username"
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              error={errors.username}
              placeholder="Username"
            />
            <ProfileField
              label="Email"
              value={values.email}
              editable={false}
              placeholder="email@example.com"
            />
            <ProfileField
              label="Contact"
              value={maskPhoneNumber(values.contact)}
              onChangeText={t =>
                handleChange('contact')(String(t || '').replace(/\D/g, '').slice(0, 10))
              }
              onBlur={handleBlur('contact')}
              error={errors.contact}
              placeholder="555-123-4567"
              keyboardType="phone-pad"
              maxLength={12}
              returnKeyType="done"
              leftAddon={
                <Typography
                  fFamily="barlowMedium500"
                  size={TYPE.body.size}
                  color={COLORS.textPrimary}
                >
                  +1
                </Typography>
              }
            />
            <ProfileField
              label="Address"
              value={values.address}
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
              error={errors.address}
              placeholder="Address"
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
