import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'react-native-paper';
//----------
import {
  Container,
  Flex,
  FormController,
} from '../../../atomComponents';
import { Edit } from '../../../assets/images';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { Button, Header, TextField } from '../../../components';
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
      // console.log('🚀 ~ EditProfileDetailsScreen ~ response:', response);
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

    console.log('🚀 ~ handleEditProfile ~ values:', {
      id: user?.id,
      ...values,
      //   imageUri
    });

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

  // console.log(`${BASE_URL}${user?.profile_image}`);


  return (
    <Container keyboardAvoiding isPadding={false}>
      <Header
        type="app"
        title={edit ? 'Edit Profile' : 'My Profile'}
        onPresBack={() => (edit ? setIsEdit(false) : navigation.goBack())}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          ...GLOBALSTYLE.paddingHor,
          paddingBottom: Sizer.hSize(50),
        }}
      >
        <Flex algItems={'center'} direction={'column'} mT={25} mb={30}>
          <TouchableOpacity
            activeOpacity={BASEOPACITY}
            onPress={() => {
              if (edit) {
                openGallery();
              } else {
                setIsEdit(!edit);
              }
            }}
            style={{ position: 'relative' }}
          >
            <Avatar.Image
              source={{ uri: imageUri?.uri || `${BASE_URL}${user?.profile_image}` }}
              size={Sizer.hSize(88)}
              style={{ backgroundColor: COLORS.orange400 }}
            />

            {!edit && (
              <Image
                source={Edit}
                resizeMode="contain"
                style={{
                  height: Sizer.vSize(24),
                  width: Sizer.vSize(24),
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}
              />
            )}
          </TouchableOpacity>
        </Flex>
        <FormController
          initialValues={initialValues}
          onSubmit={handleEditProfile}
        >
          {props => {
            const { handleSubmit, handleChange, handleBlur, values, errors } =
              props;

            return (
              <>
                {/* <InputLabel title="Email" mT={24} /> */}
                <TextField
                  placeholder="email"
                  value={values?.email}
                  error={errors?.email}
                  handleChange={handleChange('email')}
                  handleBlur={handleBlur('email')}
                  leftIcon
                  leftIconName="mail"
                  disable={false}
                  mT={24}
                />
                {/* <InputLabel title="First Name" /> */}
                <TextField
                  placeholder="First Name"
                  value={values?.first_name}
                  error={errors?.first_name}
                  handleChange={handleChange('first_name')}
                  handleBlur={handleBlur('first_name')}
                  leftIcon
                  leftIconName="person"
                  disable={edit}
                  mT={16}
                />
                {/* <InputLabel title="Last Name" /> */}
                <TextField
                  placeholder="Last Name"
                  value={values?.last_name}
                  error={errors?.last_name}
                  handleChange={handleChange('last_name')}
                  handleBlur={handleBlur('last_name')}
                  leftIcon
                  leftIconName="person"
                  disable={edit}
                  mT={16}
                />
                {/* <InputLabel title="Phone Number" /> */}
                <TextField
                  mT={16}
                  leftIconName="phone"
                  value={maskPhoneNumber(values?.contact)}
                  error={errors?.contact}
                  handleChange={number =>
                    handleChange('contact')(number?.replace(/\D/g, ''))
                  }
                  handleBlur={handleBlur('contact')}
                  leftIconFamily="FontAwesome"
                  leftIcon
                  placeholder="Phone"
                  maxLength={12}
                  disable={edit}
                />

                {/* <InputLabel title="Address" /> */}
                <TextField
                  mT={16}
                  leftIconName="location"
                  value={values?.address}
                  error={errors?.address}
                  handleChange={handleChange('address')}
                  handleBlur={handleBlur('address')}
                  leftIconFamily="Ionicons"
                  leftIcon
                  placeholder="Address"
                  disable={edit}
                  // multiline={true}
                  numberOfLines={5}
                />

                {edit && (
                  <Button
                    label="Save Changes"
                    mt={28}
                    onPress={handleSubmit}
                    loader={isPending}
                  />
                )}
              </>
            );
          }}
        </FormController>
      </ScrollView>
    </Container>
  );
};


const styles = StyleSheet.create({
  formWrapper: {
    paddingHorizontal: Sizer.hSize(20),
  },
});

export default ProfileDetailsScreen;
