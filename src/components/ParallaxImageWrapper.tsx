import { ReactNode, use } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { HEADER_HEIGHT, ScrollContext } from "./ShowHeaderBackground";

interface Props {
  children: ReactNode;
}

export function ParallaxImageWrapper({ children }: Props) {
  "use no memo";

  const ref = use(ScrollContext);
  const scrollOffset = useScrollViewOffset(ref);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
            "clamp"
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: HEADER_HEIGHT,
        },
        headerAnimatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}
