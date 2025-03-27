import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes, routesWithTitle, TabRoutes } from './routes';
import { AppColor } from '../constants/theme';
import { isIos } from '../utils';

const Stack = createNativeStackNavigator();

const handleScreenOptions = ({ route }: any): any => {
    const routeName = route.name;
    const isRouteWithTitle = routesWithTitle.some(route => route.name === routeName)
    const isTabRoute = routeName === '/home';
    const isChat = isIos && routeName === '/messages/chat';

    return {
        headerShown: !isTabRoute,
        headerShadowVisible: false,
        headerTransparent: !isRouteWithTitle || isChat,
        headerBackButtonDisplayMode: 'minimal',
        fullScreenGestureEnabled: true,
        title: Routes.find((r) => r?.name === routeName)?.title ?? '',
        headerStyle: { backgroundColor: isRouteWithTitle ? AppColor.secondary : AppColor.transparent },
        headerTintColor: AppColor.light,
    };
}

export const Navigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={'/splash'}
            screenOptions={handleScreenOptions}
        >
            {Routes.map((route) => (
                <Stack.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                />
            ))}
        </Stack.Navigator>
    );
};
