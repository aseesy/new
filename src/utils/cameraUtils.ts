import ImagePicker from 'react-native-image-crop-picker';

export const pickImageFromGallery = async () => {
    const responseModal = {
        result: null,
        success: false,
        message: '',
    }
    // No permissions request is necessary for launching the image library
    try {

        let result = await ImagePicker.openPicker({
            mediaType: 'photo',
            compressImageQuality: 0.5,
            cropping: true,
            includeBase64: true,
            width: 300,
            height: 400,
            selectionLimit: 1,
        });

        if (result.data) {
          return {...responseModal, result, success: true};
        }
    } catch (error: any) {
        return {...responseModal, message: error?.message};
    }
};

export const pickImageFromCamera = async () => {
    const responseModal = {
        result: null,
        success: false,
        message: '',
    }
    // No permissions request is necessary for launching the image library
    try {
        let result = await ImagePicker.openCamera({
            mediaType: 'photo',
            compressImageQuality: 0.5,
            includeBase64: true,
            useFrontCamera: true,
            cropping: true,
            width: 300,
            height: 400,
        });

        if (result.data) {
          return {...responseModal, result, success: true};
        }
    } catch (error: any) {
        return {...responseModal, message: error?.message};
    }
};
