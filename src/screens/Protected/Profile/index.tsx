import { View, TouchableOpacity, NativeSyntheticEvent } from 'react-native'
import React, { useLayoutEffect, useRef, useState } from 'react'
import Avatar from '../../../components/common/Avatar'
import { getFromLoggedInUser, width } from '../../../utils'
import NText from '../../../components/ui/NText'
import { useMutation } from 'react-query'
import { uploadUserImage } from '../../../networking/user.service'
import NLoader from '../../../components/ui/NLoader'
import NBottomSheet from '../../../components/ui/NBottomSheet'
import { pickImageFromCamera, pickImageFromGallery } from '../../../utils/cameraUtils'
import { useUser } from '../../../Providers/UserServiceProvider'
import { useNavigation } from '@react-navigation/native'
import Icon from '@react-native-vector-icons/fontawesome6'
import { Metrics } from '../../../utils/metrics'
import { AppColor } from '../../../constants/theme'
import ContextMenu, { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";
import { navigate } from '../../../utils/navigationUtils'

const EDIT_OPTIONS = [{title: 'Edit Profile'}, {title: 'Add Child'}];
const OPTIONS = ['Upload from Camera', 'Upload from Gallery', 'Cancel'];

const Profile = () => {

  const navigation = useNavigation();
  const userId = getFromLoggedInUser('certserialnumber');
  const { user, refreshProfilePhoto, profile_photo } = useUser();

  const [showBottomSheet, setBottomSheet] = useState<boolean>(false);

  const { mutate, isLoading: uploading } = useMutation({
    mutationFn: uploadUserImage,
    onSuccess() {
      refreshProfilePhoto();
    },
  });

  const closeSheet = () => {
    setBottomSheet(false);
  }

  const uploadFromCamera = async () => {
    try {
      const response = await pickImageFromCamera()
      if (response?.result?.data) {
        mutate({
          imageBinary: response?.result?.data,
          userId: +userId!,
        })
      }
      closeSheet();
    } catch (error) {
      console.log(error);
    }
  }

  const uploadFromGallery = async () => {
    try {
      const response = await pickImageFromGallery()
      if (response?.result?.data) {
        mutate({
          imageBinary: response?.result?.data,
          userId: +userId!,
        })
      }
        closeSheet();
    } catch (error) {
      closeSheet();
      console.log(error);
    }
  }

  const handleOptions = (index: number) => {
    switch (index) {
      case 0:
        // Upload from Camera
        uploadFromCamera()
        break;
      case 1:
        // Upload from Gallery
        uploadFromGallery()
        break;
      default:
        closeSheet();
        break;
    }
  }

  const handleAction = (action: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    const index = action.nativeEvent.index;
    switch(index){
      case 0:
        navigate('/profile/editProfile');
        break;
      case 1:
        navigate('/calendar');
        break;
      default:
        break;
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ContextMenu
            dropdownMenuMode
            actions={EDIT_OPTIONS}
            onPress={handleAction}
          >
            <View className='border-l-green-700 w-5 items-end'>
              <Icon name='ellipsis-vertical' size={Metrics.icon.lg} color={AppColor.light} iconStyle='solid'  />
            </View>
          </ContextMenu>
      ),
     });
  }, []);

  const fullName = `${user?.firstName} ${user?.lastName}`
  return (
    <View className='bg-secondary flex-1'>
      {/* Avatar */}
      <View className='items-center z-10'>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setBottomSheet(true)} className='border-4 border-light rounded-full'>
          <Avatar key={uploading?.toString()} source={profile_photo} classname='overflow-hidden' edit name={fullName} size={width * 0.25} />
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View className='flex-1 bg-light' style={{ marginTop: - width * 0.15, paddingTop: width * 0.15 }} >
        
        <View className='mx-4 items-center'>
          <View className='mt-4' />
          <NText fontFamily='Medium' variant='h1'>{fullName}</NText>
          {user?.phoneNumber? 
            <>
              <View className='mt-4' />
              <NText variant='h3'>+91 {user?.phoneNumber}</NText>
            </> : null}
          <View className='mt-4' />
          <NText variant='h5' classname='text-center'>Lorem ipsum dolor sit amet, consectetr adipiscing elit. </NText>
        </View>

        {/* Loader */}
        <NLoader isLoading={uploading} />

        <NBottomSheet onPress={handleOptions}  options={OPTIONS} visible={showBottomSheet} onClose={closeSheet} />
      </View>
    </View>
  )
}

export default Profile