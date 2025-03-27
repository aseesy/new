import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { IMAGES } from '../../../assets/images';
import { AppColor } from '../../constants/theme';

const Grid = ({ children }: any) => {
  return (
    <View className='flex-1 bg-secondary'>
      <Image
        source={IMAGES.grid}  // Assuming this is a small image
        style={styles.background}
        resizeMode="repeat"    // Ensures the image repeats instead of stretching
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    opacity:0.1,
    position: 'absolute', // Ensure the image is positioned over the grid
    flex: 1,               // This makes the ImageBackground take full space of the parent container
    width: '100%',         // Ensure it covers full width
    height: '100%',        // Ensure it covers full height
  },
});

export default Grid;
