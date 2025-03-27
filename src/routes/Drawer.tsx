import { createDrawerNavigator } from '@react-navigation/drawer';
import { TabNavigator } from './Tab';
import { AppColor } from '../constants/theme';
import MyDrawer from '../components/common/MyDrawer';

const Drawer = createDrawerNavigator();

export const DrawerStack = () => {
    return (
        <Drawer.Navigator 
            drawerContent={(props) => <MyDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerPosition: 'right',
                drawerType: 'front',
                drawerActiveTintColor: AppColor.primary,
                drawerInactiveTintColor: AppColor.dark90,
                drawerStyle: {
                    width: '70%',
                    backgroundColor: AppColor.light50,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                },
            }} >
                <Drawer.Screen name='Drawer' component={TabNavigator} options={{
                    title: 'Home'
            }} />
        </Drawer.Navigator>
    )
}