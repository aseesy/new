import React, { ReactNode } from 'react';
import { View, FlatList, StyleSheet, Image, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '../../../assets/images';
import { height, isAndroid } from '../../utils';

interface WrapperProps {
  children: ReactNode;
  showBackground?: boolean; // New prop to control the background visibility
  header?: boolean; // New prop to control the header title
  enableSearch?: boolean; // New prop to control the search bar visibility
  noSafeArea?: boolean; // New prop to control the safe area insets
  onRefresh?: () => void; // New prop to control the onRefresh function for the FlatList
  isRefreshLoading?: boolean; // New prop to control the refreshing state for the FlatList
}

const Wrapper: React.FC<WrapperProps> = ({ children, showBackground = true, header, noSafeArea, onRefresh, isRefreshLoading}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      {/* Conditionally render the header image based on showBackground */}
      {showBackground && header && (
        <View style={styles.headerContainer}>
          <Image
            style={styles.headerImage}
            resizeMethod="resize"
            resizeMode="stretch"
            source={IMAGES.header}
          />
        </View>
      )}

      {/* FlatList Content */}
      <FlatList
        data={[0]} // Placeholder data
        automaticallyAdjustKeyboardInsets
        refreshControl={onRefresh? <RefreshControl onRefresh={onRefresh} refreshing={isRefreshLoading || false} /> : undefined}
        refreshing={isRefreshLoading || false}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={() => (
          <View
            style={{
              paddingTop: header || noSafeArea ? 0 : insets.top + (isAndroid ? 40 : 0),
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }}
          >
            {children}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // Ensure content and background are correctly layered
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%', // Adjust height of the header image
    zIndex: -1, // Ensure it's behind the content
    overflow: 'hidden',
  },
  headerImage: {
    width: '130%',
    marginLeft: '-25%',
    height: height * 0.20, // Ensure the image stretches to cover the height of the header
  },
});

export default Wrapper;
