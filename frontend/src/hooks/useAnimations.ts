import { useInView } from 'framer-motion';
import { useRef } from 'react';

export type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export const useAnimations = (direction: AnimationDirection = 'up', once: boolean = true) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once });

  const getAnimationProps = () => {
    const baseProps = {
      initial: { opacity: 0 },
      animate: isInView ? { opacity: 1 } : { opacity: 0 },
      transition: { duration: 0.5 },
      ref
    };

    switch (direction) {
      case 'up':
        return {
          ...baseProps,
          initial: { ...baseProps.initial, y: 50 },
          animate: isInView ? { ...baseProps.animate, y: 0 } : { ...baseProps.animate, y: 50 }
        };
      case 'down':
        return {
          ...baseProps,
          initial: { ...baseProps.initial, y: -50 },
          animate: isInView ? { ...baseProps.animate, y: 0 } : { ...baseProps.animate, y: -50 }
        };
      case 'left':
        return {
          ...baseProps,
          initial: { ...baseProps.initial, x: 50 },
          animate: isInView ? { ...baseProps.animate, x: 0 } : { ...baseProps.animate, x: 50 }
        };
      case 'right':
        return {
          ...baseProps,
          initial: { ...baseProps.initial, x: -50 },
          animate: isInView ? { ...baseProps.animate, x: 0 } : { ...baseProps.animate, x: -50 }
        };
      case 'none':
      default:
        return baseProps;
    }
  };

  const staggerContainerProps = {
    initial: "hidden",
    animate: isInView ? "visible" : "hidden",
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    ref
  };

  const staggerItemProps = {
    variants: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5
        }
      }
    }
  };

  return {
    ref,
    isInView,
    animationProps: getAnimationProps(),
    staggerContainerProps,
    staggerItemProps
  };
}; 