import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
  Pressable,
} from 'react-native';
import NText from '../../components/ui/NText';
import { AppColor } from '../../constants/theme';
import { IMAGES } from '../../../assets/images';
import NPressable from '../../components/ui/NPressable';
import { navigate, resetAndNavigate } from '../../utils/navigationUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native-gesture-handler'

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  image: any;
}

const data: Slide[] = [
  {
    id: '1',
    title: 'Effective Communication',
    description: 'Ensure messages remain child-centered and free of miscommunication with AI mediation.',
    bgColor: 'bg-orange-200',
    textColor: 'text-orange-600',
    image: IMAGES.effectiveCommunication,
  },
  {
    id: '2',
    title: 'Shared Calender',
    description: 'Infused with AI assistance to keep everyone informed and ensure smooth coordination of events.',
    bgColor: 'bg-blue-200',
    textColor: 'text-blue-600',
    image: IMAGES.sharedCalandar,
  },
  // {
  //   id: '3',
  //   title: 'User Privacy',
  //   description: 'Infused with AI assistance to keep everyone informed and ensure smooth coordination of events.',
  //   bgColor: 'bg-green-200',
  //   textColor: 'text-green-600',
  //   image: IMAGES.userPrivacy,
  // },
];

const ContentSlider: React.FC = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={{ width, height: '100%' }}>
      <View className="flex-1 justify-center items-center">
        <Image
          source={item.image}
          resizeMethod="resize"
          resizeMode="contain"
          style={{
            height: '50%',
          }}
        />
      </View>
      <View className="items-center px-8 flex-[0.5] bg-light justify-center">
        <NText variant="h1" fontFamily="Medium">
          {item.title}
        </NText>
        <View className='h-2' />
        <NText style={{ fontSize: 16, color: 'gray', textAlign: 'center' }}>
          {item.description}
        </NText>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: AppColor.secondary }}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        horizontal
        bounces={false}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScrollEnd}
      />
      <View className="bg-light pb-5">
        {/* Pagination Dots */}
        <View className='bg-white' style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {data.map((_, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [8, 40, 8],
              extrapolate: 'clamp',
            });

            const dotColor = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: ['#ccc', '#ff6347', '#ccc'],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={{
                  height: 8,
                  width: dotWidth,
                  backgroundColor: dotColor,
                  borderRadius: 4,
                  marginHorizontal: 4,
                }}
              />
            );
          })}
        </View>
        {/* Next Button */}
        <View className="mx-8 mb-6 mt-16">
          <NPressable
            title={'Next'}
            variant={"outline"}
            borderColor='dark90'
            textColor={'dark'}
            icon={undefined}
            iconPosition='right'
            iconColor='light'
            onPress={() => {
              const nextIndex = currentIndex + 1;
              if (nextIndex < data.length) {
                flatListRef.current?.scrollToIndex({ index: nextIndex });
              } else {
                navigate('/welcome')
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ContentSlider;
