import React, { Component } from 'react';
import { Animated } from 'react-native';

import { Icon, IconProps } from './icon';

class IconClassComponent extends Component<IconProps> {
  constructor(props: IconProps) {
    super(props);
  }

  render() {
    return <Icon {...this.props} />;
  }
}

export const AnimatedIcon = Animated.createAnimatedComponent(IconClassComponent);
