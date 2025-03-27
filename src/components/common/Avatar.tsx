import { View, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import NText from '../ui/NText';
import { IMAGES } from '../../../assets/images';

interface IProps {
  name: string;
  size?: number;
  source?: string;
  edit?: boolean;
  classname?: string;
  backgroundColor?: string;
}

const Avatar: React.FC<IProps> = ({
  name,
  size = 40,
  source,
  edit,
  classname = '',
  backgroundColor = '#F5F5F5',
}) => {
  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.length > 1
      ? words[0][0]?.toUpperCase() + words[1]?.[0]?.toUpperCase()
      : words[0]?.[0]?.toUpperCase();
  };

  const initials = getInitials(name);

  const [isError, setIsError] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor,
          borderRadius: size / 2,
        },
      ]}
      className={classname}
    >
      {source && !isError ? (
        <Image
          onError={() =>
            setIsError(true)
          }
          source={{ uri: source }}
          alt={initials}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <NText
          classname="text-center text-dark90"
          style={{ fontSize: size / 2.2, lineHeight: size / 1.5, color: '#000' }}
        >
          {initials}
        </NText>
      )}

      {edit ? <View className='absolute w-full bg-primary/80 bottom-0 justify-center items-center'>
        <NText classname='text-center text-dark90'>Edit</NText>
      </View> :  null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default Avatar;
