import {
    createNavigationContainerRef,
    CommonActions,
    StackActions,
    DrawerActions,
  } from '@react-navigation/native';
import { RouteName } from '../routes/routes';
  
  export const navigationRef = createNavigationContainerRef();
  
  export function navigate(routeName: RouteName, params?: object) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(CommonActions.navigate(routeName, params));
    }
  }
  
  export function resetAndNavigate(routeName: RouteName) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: routeName}],
        }),
      );
    }
  }
  
  export function goBack() {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(CommonActions.goBack());
    }
  }

  export function canGoBack() {
    navigationRef.isReady();
    if (navigationRef.isReady()) {
      return navigationRef.canGoBack();
    }
  }
  
  export function push(routeName: RouteName, params?: object) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(routeName, params));
    }
  }

  export function toggleDrawer() {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(DrawerActions.toggleDrawer());
    }
  }
  
  export function prepareNavigation() {
  }