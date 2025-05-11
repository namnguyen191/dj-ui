/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentLoadersMap } from '@dj-ui/common/shared';
import {
  CardElementType,
  ImagesCarouselElementType,
  SimpleImageElementType,
  SimpleTableElementType,
  SimpleTextElementType,
} from '@dj-ui/prime-ng-ext/shared';

export const PrimeNgComponentLoader = {
  [SimpleTextElementType]: () =>
    import('@dj-ui/prime-ng-ext/simple-text').then((m) => m.SimpleTextComponent),
  [SimpleImageElementType]: () =>
    import('@dj-ui/prime-ng-ext/simple-image').then((m) => m.SimpleImageComponent),
  [SimpleTableElementType]: () =>
    import('@dj-ui/prime-ng-ext/simple-table').then((m) => m.SimpleTableComponent),
  [ImagesCarouselElementType]: () =>
    import('@dj-ui/prime-ng-ext/images-carousel').then((m) => m.ImagesCarouselComponent),
  [CardElementType]: () => import('@dj-ui/prime-ng-ext/card').then((m) => m.CardComponent),
} satisfies ComponentLoadersMap;
