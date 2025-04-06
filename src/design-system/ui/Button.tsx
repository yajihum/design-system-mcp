import React from 'react';
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
  composeRenderProps,
} from 'react-aria-components';
import { tv, VariantProps } from 'tailwind-variants';

const button = tv({
  base: 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none cursor-pointer',
  variants: {
    variant: {
      primary:
        'bg-semantic-primary-default text-semantic-text-inverse hover:bg-semantic-primary-hover active:bg-semantic-primary-active border-none rounded-md',
      secondary:
        'bg-transparent text-semantic-primary-default border border-semantic-primary-default hover:bg-semantic-primary-lighter active:bg-semantic-primary-light rounded-md',
      tertiary:
        'bg-transparent text-semantic-primary-default border-none hover:bg-semantic-primary-lighter active:bg-semantic-primary-light rounded-md',
    },
    size: {
      sm: 'text-xs px-xs py-xs',
      md: 'text-md px-md py-sm',
      lg: 'text-lg px-lg py-sm',
    },
    isDisabled: {
      true: 'opacity-50 cursor-not-allowed',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps extends RACButtonProps, ButtonVariants {
  children?: React.ReactNode;
}

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({
          ...renderProps,
          variant: props.variant,
          size: props.size,
          className,
        })
      )}
    >
      {props.children}
    </RACButton>
  );
}
