import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { height, width } from '../../utils';
import SvgImage from './SvgImage';

const TransparentImageWithShadow = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <SvgImage
          svg='LiazenDark'
          width={'100%'}
          height={'100%'}
          style={styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    width: '100%',             // Width of the container
    height: '100%',            // Height of the container
    shadowColor: '#00ffff',  // Blue shadow color
    shadowOpacity: 1,     // Higher opacity for visible shadow
    shadowRadius: 16,       // Larger radius for more blur (effect of glow)
    elevation: 15,          // Shadow for Android (elevation)
    overflow: 'hidden',     // Ensures the shadow stays within the bounds
  },
  image: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    resizeMode: 'contain', // Ensure the image fits within the container without distortion
  },
});

export default TransparentImageWithShadow;
