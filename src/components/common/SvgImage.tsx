import React from 'react';
import { SvgProps } from 'react-native-svg';
import { SVGS } from '../../../assets/images';

interface ISvgImageProps extends SvgProps {
  svg: keyof typeof SVGS;
}

const SvgImage: React.FC<ISvgImageProps> = ({ svg, ...props }) => {
  const SvgComponent = SVGS[svg];

  if (!SvgComponent) {
    return null;
  }

  return <SvgComponent {...props} />;
};

export default SvgImage;
