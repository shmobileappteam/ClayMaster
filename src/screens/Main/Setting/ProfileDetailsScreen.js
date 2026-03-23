import {
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'react-native-paper';
//----------
import {
  Container,
  Flex,
  FormController,
  Typography,
} from '../../../atomComponents';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { Button, Header, TextField } from '../../../components';
import Icon from '../../../helpers/Icon';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { editProfile } from '../../../api/userService';
import { setUser } from '../../../redux/slices/appSlice';
import { maskPhoneNumber, showMessage } from '../../../utils';
import useImagePicker from '../../../hooks/useImagePicker';
import { BASE_URL } from '../../../api/endpoints';

const ProfileDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);

  const { openGallery, imageUri, clearImage } = useImagePicker();

  const [edit, setIsEdit] = useState(false);

  //Edit Profile Mutation:
  const { mutate: editProf, isPending } = useCustomMutation({
    mutationFn: editProfile,
    onSuccess: response => {
      if (response?.status) {
        dispatch(setUser({ ...response?.user }));
        setIsEdit(false);
        showMessage({
          type: 'success',
          message: response?.message,
        });
      }
    },
    onSettled: () => {
      clearImage();
    },
  });

  //Handle Edit Profile:
  const handleEditProfile = values => {
    if (imageUri?.uri) {
      values.profile_image = {
        uri: imageUri?.uri,
        fileName: imageUri?.fileName,
        type: imageUri?.type,
      };
    } else {
      delete values.profile_image;
    }

    editProf({ id: user?.id, ...values });
  };

  const initialValues = {
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    address: user?.address_1 || '',
    contact: user?.contact || '',
    profile_image: user?.profile_image || null,
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (edit) {
          setIsEdit(false);
          return true;
        } else {
          return false;
        }
      },
    );

    return () => backHandler.remove();
  }, [edit]);

  return (
    <Container keyboardAvoiding isPadding={false}>
      <Header
        type="app"
        title="Account Settings"
        onPresBack={() => (edit ? setIsEdit(false) : navigation.goBack())}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Sizer.hSize(100),
          paddingHorizontal: Sizer.hSize(20),
        }}
      >
        <Flex algItems={'center'} direction={'column'} mT={40} mB={32}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={openGallery}
            style={styles.avatarContainer}
          >
            <Avatar.Image
              source={{ uri: imageUri?.uri || `${BASE_URL}${user?.profile_image}` }}
              size={Sizer.hSize(120)}
              style={{ backgroundColor: COLORS.white200 }}
            />
            <View style={styles.editBadge}>
              <Icon name="camera" size={18} color={COLORS.white100} iconFamily="Ionicons" />
            </View>
          </TouchableOpacity>
        </Flex>

        <FormController
          initialValues={initialValues}
          onSubmit={handleEditProfile}
        >
          {props => {
            const { handleSubmit, handleChange, handleBlur, values, errors } = props;
            return (
              <>
                <InputLabel title="First Name" />
                <TextField
                  placeholder="First Name"
                  value={values?.first_name}
                  error={errors?.first_name}
                  handleChange={handleChange('first_name')}
                  handleBlur={handleBlur('first_name')}
                  mT={0}
                />

                <InputLabel title="Last Name" />
                <TextField
                  placeholder="Last Name"
                  value={values?.last_name}
                  error={errors?.last_name}
                  handleChange={handleChange('last_name')}
                  handleBlur={handleBlur('last_name')}
                  mT={0}
                />

                <InputLabel title="Address" />
                <TextField
                  placeholder="Address"
                  value={values?.address}
                  error={errors?.address}
                  handleChange={handleChange('address')}
                  handleBlur={handleBlur('address')}
                  mT={0}
                />

                <InputLabel title="Email" />
                <TextField
                  placeholder="Email"
                  value={values?.email}
                  error={errors?.email}
                  handleChange={handleChange('email')}
                  handleBlur={handleBlur('email')}
                  disable={true}
                  mT={0}
                />

                <InputLabel title="Contact" />
                <TextField
                  placeholder="Contact"
                  value={maskPhoneNumber(values?.contact)}
                  error={errors?.contact}
                  handleChange={number => handleChange('contact')(number?.replace(/\D/g, ''))}
                  handleBlur={handleBlur('contact')}
                  mT={0}
                  maxLength={12}
                />

                <Button
                  label="Update Profile"
                  mt={32}
                  onPress={handleSubmit}
                  loader={isPending}
                />
              </>
            );
          }}
        </FormController>

        <View style={styles.divider} />

        <Button
            label="Change Password"
            mt={16}
            onPress={() => navigation.navigate('ChangePasswordScreen')}
            type="border"
            btnStyle={{ borderColor: COLORS.primary }}
            textStyle={{ color: COLORS.primary }}
        />

        <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={() => navigation.navigate('DeleteAccountScreen')}
        >
            <Typography color={COLORS.red200} size={14} fFamily="barlowBold700" textAlign="center">
                Delete My Account
            </Typography>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

const InputLabel = ({ title = '' }) => (
    <Typography size={13} color={COLORS.primary} fFamily="barlowSemiBold600" mT={16} mB={6}>
        {title}
    </Typography>
);

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white100,
  },
  divider: {
    height: Sizer.vSize(1),
    backgroundColor: COLORS.borderSubtle,
    marginVertical: Sizer.vSize(32),
  },
  deleteBtn: {
    marginTop: Sizer.vSize(40),
    paddingBottom: Sizer.vSize(40),
  }
});
