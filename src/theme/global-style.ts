import { SystemStyleObject } from '@chakra-ui/react';
import tokens from '@contentful/f36-tokens';

export const globalStyle: SystemStyleObject = {
  'html, body': {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minHeight: '100%',
    color: tokens.gray800,
    overflowX: 'hidden',
  },
  '#__next': {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  body: {
    fontDisplay: 'swap',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  '.subscription-card': {
    borderWidth: '1px',
    borderRadius: 'lg',
    overflow: 'hidden',
    p: 6,
    flex: 1,
    position: 'relative',
    maxW: { base: 'md', md: 'sm' },
    mx: 'auto',
  },
  '.most-popular-banner': {
    position: 'absolute',
    top: '-1px',
    left: '-1px',
    right: '-1px',
    bg: 'red.500',
    color: 'white',
    textAlign: 'center',
    py: 1,
    borderTopRadius: 'lg',
  },
  '.subscription-card-header': {
    p: 4,
    borderRadius: 'md',
    color: 'white',
  },
  '.subscription-card-header-basic': {
    background: '#30bd06',
    bgGradient: 'linear(to-r, rgba(48, 189, 6, 1) 0%, rgba(96, 166, 43, 1) 35%, rgba(255, 229, 0, 1) 100%)',
  },
  '.subscription-card-header-standard': {
    bgGradient: 'linear(to-r, purple.600, blue.500)',
  },
  '.subscription-card-header-premium': {
    bgGradient: 'linear(to-r, red.400, purple.500)',
  },
};
