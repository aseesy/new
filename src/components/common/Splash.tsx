import { View } from 'react-native'
import React from 'react'
import { getFromAppStorage, getFromLoggedInUser } from '../../utils'
import { useQuery } from 'react-query'
import { getUsersByID } from '../../networking/auth.service'
import { resetAndNavigate } from '../../utils/navigationUtils'
import SvgComponent from './LogoGlow'
import Grid from './Grid'
import NText from '../ui/NText'
import NPressable from '../ui/NPressable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getUserInfoById } from '../../networking/user.service'
import { useUser } from '../../Providers/UserServiceProvider'

const Splash = () => {
    const userInfo = getFromAppStorage();
    const userId = getFromLoggedInUser('certserialnumber');

    const { setUser } = useUser();

    const handlePress = () => {
      resetAndNavigate('/intro');
    };

    useQuery({
        queryKey: ['users', userId],
        queryFn: ({ queryKey }) => getUserInfoById(+queryKey[1]!),
        select: (data) => data.result,
        onSuccess: (data) => setUser(data),
        enabled: !!userId
    })

    const {isLoading} = useQuery({
        queryKey: ['getUsersByID', userInfo?.uniqueId],
        queryFn: ({ queryKey }) => getUsersByID({userMatchId: queryKey[1] ?? ''}),
        enabled: !!userInfo?.uniqueId,
        onSuccess: (data) => {
            if (data.isValid && data.result?.length) {
              return resetAndNavigate('/home');
            }
            resetAndNavigate('/match');
        },
        onError: () => {
          resetAndNavigate('/match');
        },
    });

  return (
    <Grid>
      <View className='flex-1 justify-center'>
        <View className='mx-12 flex-1' />
        <View className='mx-12 flex-1 items-center '>
          <View className='items-center justify-center'>
              <View className='flex-1'>
                <SvgComponent />
              </View>
              <View className='mt-2'/>
              <NText classname='text-dark text-center android:mt-2' variant='h4' >
                The Go-To App for Co-Parenting
              </NText>
          </View>
        </View>
        <View className='flex-1 mt-2'>
        {!isLoading ? 
          <View className='mt-6 mx-12'>
            <NPressable title='Get Started' onPress={handlePress} />
          </View>
          : null}
        </View>
        <View style={{ paddingBlock: useSafeAreaInsets().bottom }} />
      </View>
    </Grid>
  )
}

export default Splash