import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './utils/navigationUtils';
import {Navigator} from './routes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AppColor} from './constants/theme';
import {WSProvider} from './Providers/SocketProvider';
import {enableScreens} from 'react-native-screens';
import Notification from './components/common/Notification';
import UserServiceProvider from './Providers/UserServiceProvider';

const Main = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: () => false,
      },
    },
  });

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: AppColor.light,
    },
  };

  enableScreens();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <WSProvider>
        <UserServiceProvider>
          <NavigationContainer ref={navigationRef} theme={{...MyTheme}}>
            <QueryClientProvider client={queryClient}>
              <Navigator />
              <Notification />
            </QueryClientProvider>
          </NavigationContainer>
        </UserServiceProvider>
      </WSProvider>
    </GestureHandlerRootView>
  );
};

export default Main;
