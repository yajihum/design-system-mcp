import React from 'react';
import {
  Text as RACText,
  type TextProps as RACTextProps,
} from 'react-aria-components';
import { tv, type VariantProps } from 'tailwind-variants';

const text = tv({
  base: 'font-sans',
  variants: {
    variant: {
      'headline-xl': 'text-4xl font-bold',
      'headline-lg': 'text-3xl font-bold',
      'headline-md': 'text-2xl font-bold',
      'body-md': 'text-base',
      'body-sm': 'text-sm',
      'label-md': 'text-base font-medium',
      'label-sm': 'text-sm font-medium',
    },
  },
  defaultVariants: {
    variant: 'body-md',
  },
});

type TextVariants = VariantProps<typeof text>;

export interface TextProps extends RACTextProps, TextVariants {
  children?: React.ReactNode;
}

export function Text(props: TextProps) {
  return (
    <RACText
      {...props}
      className={text({
        variant: props.variant,
        className: props.className,
      })}
    >
      {props.children}
    </RACText>
  );
}
