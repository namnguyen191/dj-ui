import { CommonComponentLoader } from '@dj-ui/common';
import { PrimeNgComponentLoader } from '@dj-ui/prime-ng-ext';

export type UIElementType =
  | keyof typeof PrimeNgComponentLoader
  | keyof typeof CommonComponentLoader;

export const AllUIElementTypes = {
  SIMPLE_TEXT: 'Simple text',
  SIMPLE_IMAGE: 'Simple image',
  SIMPLE_TABLE: 'Simple table',
  IMAGES_CAROUSEL: 'Images carousel',
  CARD: 'Card',
  SIMPLE_GRID_LAYOUT: 'Simple grid layout',
} as const satisfies {
  [K in UIElementType]: string;
};
