import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useCallback, useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { ANIMATION_DURATION } from 'src/config/animation';
import { useAnimationInterpolate } from 'src/hooks/use-animation-interpolate.hook';
import { useAnimationRef } from 'src/hooks/use-animation-ref.hook';
import { useUpdateAnimation } from 'src/hooks/use-update-animation.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';

import { useQuestionAccordionStyles } from './styles';

interface Props extends TestIdProps {
  question: string;
}

const ANIMATION_CONFIGURATION = { duration: ANIMATION_DURATION, useNativeDriver: false };
const CHEVRON_ANIMATION_INTERPOLATION = { outputRange: ['180deg', '0deg'] };

export const QuestionAccordion: FC<Props> = ({ question, children, testID, testIDProperties }) => {
  const [isOpen, setIsOpen] = useState(false);
  const styles = useQuestionAccordionStyles();
  const animation = useAnimationRef(isOpen);

  const toggleAccordion = useCallback(() => setIsOpen(state => !state), []);
  useUpdateAnimation(animation, isOpen, ANIMATION_CONFIGURATION);
  const rotate = useAnimationInterpolate(animation, CHEVRON_ANIMATION_INTERPOLATION, [isOpen]);

  return (
    <View style={styles.container}>
      <TouchableWithAnalytics
        Component={TouchableOpacity}
        testID={testID}
        testIDProperties={testIDProperties}
        style={styles.switcher}
        onPress={toggleAccordion}
      >
        <Icon name={IconNameEnum.HelpCircle} style={styles.helpIcon} />
        <Divider size={formatSize(8)} />
        <Text style={styles.question}>{question}</Text>
        <Divider size={formatSize(8)} />
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon name={IconNameEnum.ChevronUp} strokeWidth={4} />
        </Animated.View>
      </TouchableWithAnalytics>
      {isOpen && <View style={styles.answer}>{children}</View>}
    </View>
  );
};
