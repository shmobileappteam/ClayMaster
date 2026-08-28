import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, FormController, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { ScreenOverlayLoader } from '../../../components';
import ProfileField from '../../../components/profile/ProfileField';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { editProfile } from '../../../api/userService';
import { setUser } from '../../../redux/slices/appSlice';
import { formatBackendErrors, maskPhoneNumber, showToast } from '../../../utils';
import useImagePicker from '../../../hooks/useImagePicker';
import { getBaseUrl } from '../../../api/endpoints';
import validatoinSchema from '../../../validations';

/**
 * Edit profile — form fields match POST /api/edit-profile payload.
 * first_name, last_name, contact, address, username, profile_image (+ id, email)
 * Avatar press → photo sheet → gallery (ZoomGo EditProfile pattern).
 */
const ProfileDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { user } = useSelector(state => state.app);
  const { openGallery, imageUri, clearImage } = useImagePicker();
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);

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

  const remoteAvatar = user?.profile_image
    ? String(user.profile_image).startsWith('http')
      ? user.profile_image
      : `${getBaseUrl()}${String(user.profile_image).replace(/^\//, '')}`
    : null;
  const avatarUri = imageUri?.uri || remoteAvatar;

  const closePhotoOptions = () => setPhotoOptionsVisible(false);

  const openPhotoOptions = () => setPhotoOptionsVisible(true);

  const handleChooseFromGallery = () => {
    closePhotoOptions();
    // Wait for modal dismiss so the system picker presents cleanly (ZoomGo)
    setTimeout(() => {
      openGallery();
    }, 250);
  };

  const handleRemoveLocalPhoto = () => {
    clearImage();
    closePhotoOptions();
  };

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
        fileName: imageUri.fileName || `profile-${Date.now()}.jpg`,
        type: imageUri.type || 'image/jpeg',
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
      if (photoOptionsVisible) {
        closePhotoOptions();
        return true;
      }
      navigation.goBack();
      return true;
    });
    return () => sub.remove();
  }, [navigation, photoOptionsVisible]);

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
              <Pressable
                style={styles.avatarWrap}
                onPress={openPhotoOptions}
                accessibilityRole="button"
                accessibilityLabel="Change profile photo"
              >
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
                <View style={styles.cameraBtn} pointerEvents="none">
                  <Icon
                    name="camera"
                    iconFamily="Ionicons"
                    size={16}
                    color={COLORS.primary}
                  />
                </View>
              </Pressable>
              <TouchableOpacity onPress={openPhotoOptions} activeOpacity={0.88}>
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
                Save Changes
              </Typography>
            </TouchableOpacity>
          </ScrollView>
        )}
      </FormController>

      <Modal
        visible={photoOptionsVisible}
        transparent
        animationType="fade"
        onRequestClose={closePhotoOptions}
      >
        <Pressable style={styles.modalOverlay} onPress={closePhotoOptions}>
          <Pressable
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom, Sizer.vSize(16)) },
            ]}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            <Typography
              size={11}
              color={COLORS.textSecondary}
              fFamily="barlowBold700"
              textAlign="center"
              style={styles.modalEyebrow}
              mB={12}
            >
              UPDATE PHOTO
            </Typography>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleChooseFromGallery}
              activeOpacity={0.88}
            >
              <View style={styles.modalOptionIcon}>
                <Icon
                  name="images-outline"
                  iconFamily="Ionicons"
                  size={18}
                  color={COLORS.primary}
                />
              </View>
              <Typography
                size={TYPE.body.size}
                color={COLORS.textPrimary}
                fFamily="barlowSemiBold600"
                style={styles.modalOptionLabel}
              >
                Choose from gallery
              </Typography>
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>

            {imageUri?.uri ? (
              <TouchableOpacity
                style={[styles.modalOption, styles.modalOptionDanger]}
                onPress={handleRemoveLocalPhoto}
                activeOpacity={0.88}
              >
                <View style={[styles.modalOptionIcon, styles.modalOptionIconDanger]}>
                  <Icon
                    name="trash-outline"
                    iconFamily="Ionicons"
                    size={18}
                    color={COLORS.destructive}
                  />
                </View>
                <Typography
                  size={TYPE.body.size}
                  color={COLORS.destructive}
                  fFamily="barlowSemiBold600"
                  style={styles.modalOptionLabel}
                >
                  Remove selected photo
                </Typography>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={closePhotoOptions}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.body.size}
                color={COLORS.textPrimary}
              >
                Cancel
              </Typography>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <ScreenOverlayLoader visible={isPending} />
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: Sizer.hSize(20),
    borderTopRightRadius: Sizer.hSize(20),
    paddingHorizontal: Sizer.hSize(20),
    paddingTop: Sizer.vSize(12),
  },
  modalHandle: {
    width: Sizer.hSize(40),
    height: Sizer.vSize(4),
    borderRadius: 2,
    backgroundColor: COLORS.borderMuted,
    alignSelf: 'center',
    marginBottom: Sizer.vSize(12),
  },
  modalEyebrow: {
    letterSpacing: 1.4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.mainBg,
    borderRadius: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(14),
    marginBottom: Sizer.vSize(10),
  },
  modalOptionDanger: {
    borderColor: 'rgba(220, 38, 38, 0.25)',
  },
  modalOptionIcon: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionIconDanger: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  modalOptionLabel: {
    flex: 1,
  },
  modalCancel: {
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(4),
  },
});
