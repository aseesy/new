import {
  View,
  Alert,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import { DrawerContentComponentProps, DrawerItem } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFromAppStorage, getFromLoggedInUser, globalLogout } from '../../utils';
import NText from '../ui/NText';
import { IMAGES } from '../../../assets/images';
import Avatar from './Avatar';
import Icon from '@react-native-vector-icons/fontawesome6';
import { AppColor } from '../../constants/theme';
import { navigate, toggleDrawer } from '../../utils/navigationUtils';
import { BLOB_PATH } from '../../constants/config';
import { useUser } from '../../Providers/UserServiceProvider';

const MyDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const { top, bottom } = useSafeAreaInsets();

  const confirm = () => {
      Alert.alert('Confirm!', `Are you sure you want to logout?`, [
          {
              text: 'Cancel',
          },
          {
              text: 'Yes',
              onPress: globalLogout,
          },
      ]);
  };

  const { profile_photo, user } = useUser();

  const fullName = user?.firstName+ ' ' + user?.lastName;

  return (
      <View style={{ flex: 1 }} className='bg-light50'>
          <View
              className=" bg-secondary items-center pb-4"
              style={{ paddingTop: top + 5 }}
          >
              {/* Logo Section */}
              <View
                  style={{
                      width: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      marginBottom: 11,
                  }}
              >
                  <Avatar key={profile_photo} source={profile_photo} size={80} name={fullName} />
              </View>

              {/* User Information */}
              <NText fontFamily="Medium" variant="h6">
                 {fullName}
              </NText>
              <View style={{ marginVertical: 2 }} />
              <NText variant="h6">
                  {getFromAppStorage()?.uniqueId}
              </NText>
          </View>

          {/* Spacer */}
          <View className="flex flex-1">
            <DrawerItem
                activeTintColor={AppColor.secondary}
                inactiveTintColor={AppColor.dark90}
                label={'Profile'}
                allowFontScaling
                icon={({ size, color }) => (
                    <Icon iconStyle='solid' name="user-gear" color={color} size={size * 0.7} />
                )}
                onPress={() => {
                    toggleDrawer()
                    navigate('/profile/index')
                }}
                labelStyle={{
                    // marginLeft: DEFAULT_TEXT_ICON_SPACING,
                }}
            />
            {/* <DrawerItem
                activeTintColor={AppColor.secondary}
                inactiveTintColor={AppColor.dark90}
                label={'Settings'}
                allowFontScaling
                icon={({ size, color }) => (
                    <Icon iconStyle='solid' name="gears" color={color} size={size * 0.7} />
                )}
                onPress={() => navigate('/connection')}
                labelStyle={{
                    // marginLeft: DEFAULT_TEXT_ICON_SPACING,
                }}
            /> */}

            <DrawerItem
                activeTintColor={AppColor.secondary}
                inactiveTintColor={AppColor.dark90}
                label={'Settings'}
                allowFontScaling
                icon={({ size, color }) => (
                    <Icon iconStyle='solid' name="gears" color={color} size={size * 0.7} />
                )}
                onPress={() => navigate('/connection')}
                labelStyle={{
                    // marginLeft: DEFAULT_TEXT_ICON_SPACING,
                }}
            />
          </View>

          <View className='m-2'>
            <NText classname='text-medium50 text-right' >
                v1.0.0 (beta)
            </NText>
          </View>
          {/* Logout Button */}
          <Pressable
              style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
              })}
          >
              <TouchableOpacity
                  className='bg-secondary p-3'
                  style={{
                    paddingBottom: bottom + 11
                  }}
                  onPress={confirm}
              >
                  <NText variant='h5' fontFamily='Bold' classname='text-center' >
                      Logout
                  </NText>
              </TouchableOpacity>
          </Pressable>
      </View>
  );
};

export default MyDrawer;
