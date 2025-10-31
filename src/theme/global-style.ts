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
    background: '#30bd06',
    bgGradient: 'linear(268deg, rgba(48, 189, 6, 1) 0%, rgba(96, 166, 43, 1) 35%, rgba(255, 229, 0, 1) 100%)',
  },
  '.subscription-card-header-premium': {
    background: '#2A7B9B',
    bgGradient: 'linear-gradient(90deg, rgba(42, 123, 155, 1) 0%, rgba(78, 204, 130, 1) 50%, rgba(252, 227, 0, 1) 100%)',
  },
};
