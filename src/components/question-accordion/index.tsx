import React, { FC, useCallback, useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { ANIMATION_DURATION_FAST } from 'src/config/animation';
import { useAnimationInterpolate } from 'src/hooks/use-animation-interpolate.hook';
import { useAnimationRef } from 'src/hooks/use-animation-ref.hook';
import { useUpdateAnimation } from 'src/hooks/use-update-animation.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';

import { Divider } from '../divider/divider';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableWithAnalytics } from '../touchable-with-analytics';
import { useQuestionAccordionStyles } from './styles';

interface Props extends TestIdProps {
  question: string;
}

export const QuestionAccordion: FC<Props> = ({ question, children, testID, testIDProperties }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const styles = useQuestionAccordionStyles();
  const animation = useAnimationRef(isAccordionOpen);

  const toggleAccordion = useCallback(() => setIsAccordionOpen(state => !state), []);
  useUpdateAnimation(animation, isAccordionOpen, { duration: ANIMATION_DURATION_FAST, useNativeDriver: false });
  const rotate = useAnimationInterpolate(animation, { outputRange: ['180deg', '0deg'] }, [isAccordionOpen]);

  return (
    <View style={styles.container}>
      <TouchableWithAnalytics
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
      {isAccordionOpen && <View style={styles.answer}>{children}</View>}
    </View>
  );
};
