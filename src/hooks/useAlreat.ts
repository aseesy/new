import { useCallback } from 'react';
import { Alert } from 'react-native';

const useAlert = (defaultTitle: string = "LiaiZen") => {
  const showAlert = useCallback(
    (message: string, options: { title?: string, buttons?: Array<{ text: string, onPress?: () => void }> } = { title: defaultTitle, buttons: [{ text: "OK" }] }) => {
      const { title, buttons } = options;
      Alert.alert(title || defaultTitle, message, buttons);
    },
    [defaultTitle]
  );

  return showAlert;
};

export default useAlert;
