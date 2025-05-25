import { CommonComponentLoader } from '@dj-ui/common';
import { PrimeNgComponentLoader } from '@dj-ui/prime-ng-ext';

export type UIElementType =
  | keyof typeof PrimeNgComponentLoader
  | keyof typeof CommonComponentLoader;
export type LayoutUIElementTypes = Extract<UIElementType, 'SIMPLE_GRID_LAYOUT'>;
export type NonLayoutUIElementTypes = Exclude<UIElementType, LayoutUIElementTypes>;

export const AlNonLayoutlUIElementTypes = {
  SIMPLE_TEXT: 'Simple text',
  SIMPLE_IMAGE: 'Simple image',
  SIMPLE_TABLE: 'Simple table',
  IMAGES_CAROUSEL: 'Images carousel',
  CARD: 'Card',
} as const satisfies {
  [K in NonLayoutUIElementTypes]: string;
};
export const AllLayoutUIElementTypes = {
  SIMPLE_GRID_LAYOUT: 'Simple grid layout',
} as const satisfies {
  [K in LayoutUIElementTypes]: string;
};
export const AllUIElementTypes = {
  ...AllLayoutUIElementTypes,
  ...AlNonLayoutlUIElementTypes,
} as const satisfies {
  [K in UIElementType]: string;
};
