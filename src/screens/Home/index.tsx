import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  timing,
} from 'react-native-reanimated';

import { Fontisto } from '@expo/vector-icons';

import { styles } from './styles';
import { theme } from '../../styles/theme';
import { Header } from '../components/Header';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const { width, height } = Dimensions.get('window');

const middleHeight = height / 10;

export function Home() {
  const [percentage, setPercentage] = useState<number>(0);
  const heightAnimated = useSharedValue(middleHeight);
  const waveAnimated = useSharedValue(5);
  const buttonBorderAnimated = useSharedValue(0);

  const buttonProps = useAnimatedProps(() => {
    return {
      cx: 60,
      cy: 60,
      r: 40,
      fill: theme.colors.blue100,
      strokeWidth: interpolate(
        buttonBorderAnimated.value,
        [0, 0.5, 1],
        [17, 40, 17]
      ),
      stroke: theme.colors.blue90,
      strokeOpacity: 0.5,
    };
  });

  const svgContainerProps = useAnimatedProps(() => {
    return {
      width,
      height: heightAnimated.value,
      viewBox: `0 0 ${width} ${heightAnimated.value}`,
    };
  });

  const firstWaveProps = useAnimatedProps(() => {
    return {
      d: `M 0 0 Q 45 ${waveAnimated.value} 90 0 T 180 0 T 270 0 T 360 0 T 900 0 T 540 0 V ${heightAnimated.value} H 0 Z `,
    };
  });

  const secondWaveProps = useAnimatedProps(() => {
    return {
      d: `M 0 0 Q 35 ${
        waveAnimated.value + 5
      } 70 0 T 140 0 T 210 0 T 280 0 T 350 0 T 420 0 V ${
        heightAnimated.value
      } H 0 Z `,
    };
  });

  useEffect(() => {
    console.log(heightAnimated.value);
  }, [heightAnimated.value]);

  const handleDrink = () => {
    buttonBorderAnimated.value = 0;
    waveAnimated.value = 5;

    buttonBorderAnimated.value = withTiming(1, {
      duration: 500,
      easing: Easing.ease,
    });

    waveAnimated.value = withRepeat(
      withTiming(17, {
        duration: 1000,
        easing: Easing.ease,
      }),
      2,
      true
    );

    heightAnimated.value = withTiming(
      heightAnimated.value + middleHeight + 65,
      {
        duration: 1000,
        easing: Easing.ease,
      }
    );

    setPercentage(percentage + 10);
  };

  const handleEmptyCup = () => {
    buttonBorderAnimated.value = 0;
    waveAnimated.value = 5;

    waveAnimated.value = withRepeat(
      withTiming(17, {
        duration: 1000,
        easing: Easing.ease,
      }),
      2,
      true
    );

    heightAnimated.value = withTiming(100, {
      duration: 1000,
      easing: Easing.ease,
    });

    setPercentage(0);
  };

  return (
    <View style={styles.container}>
      <Header
        ml={percentage === 0 ? 0 : percentage * 10}
        percent={percentage}
      />

      <AnimatedSvg animatedProps={svgContainerProps}>
        <AnimatedPath
          animatedProps={firstWaveProps}
          fill={theme.colors.blue100}
          transform={`translate(0, 10)`}
        />
        <AnimatedPath
          animatedProps={secondWaveProps}
          fill={theme.colors.blue70}
          transform={`translate(0, 15)`}
        />
      </AnimatedSvg>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (percentage < 100) {
              handleDrink();
            } else {
              Alert.alert('Completo', 'Seu copo já está cheio', [
                {
                  text: 'Esvaziar',
                  onPress: handleEmptyCup,
                },
                {
                  text: 'Cancelar',
                  style: 'cancel',
                },
              ]);
            }
          }}
        >
          <Svg width={120} height={120}>
            <AnimatedCircle animatedProps={buttonProps} />
          </Svg>

          <Fontisto
            name='blood-drop'
            size={32}
            color={theme.colors.blue90}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
