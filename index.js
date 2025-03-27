/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import "./global.css"
import Main from './src/Main';
import './gesture-handler';

if (__DEV__) {
    require("./ReactotronConfig");
}

// Override Text scaling
if (Text.defaultProps) {
    Text.defaultProps.allowFontScaling = false;
  } else {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }
  
  // Override Text scaling in input fields
  if (TextInput.defaultProps) {
    TextInput.defaultProps.allowFontScaling = false;
  } else {
    TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
  }

  messaging().setBackgroundMessageHandler((remoteMessage) => {
  });

  function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }
  
    // Render the app component on foreground launch
    return <Main />;
  }

AppRegistry.registerComponent(appName, () => HeadlessCheck);
