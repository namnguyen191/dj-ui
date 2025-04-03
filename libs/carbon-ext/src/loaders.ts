import {
  CarbonButtonElementType,
  CarbonCarouselCardElementType,
  CarbonCarouselElementType,
  CarbonSimpleTextElementType,
  CarbonTableElementType,
  CarbonTextCardElementType,
} from '@dj-ui/carbon-ext/shared';
import type { ComponentLoadersMap } from '@dj-ui/common';

export const CarbonComponentLoader: ComponentLoadersMap = {
  [CarbonButtonElementType]: () =>
    import('@dj-ui/carbon-ext/carbon-button').then((m) => m.CarbonButtonComponent),
  [CarbonTableElementType]: () =>
    import('@dj-ui/carbon-ext/carbon-table').then((m) => m.CarbonTableComponent),
  [CarbonTextCardElementType]: () =>
    import('@dj-ui/carbon-ext/carbon-text-card').then((m) => m.CarbonTextCardComponent),
  [CarbonCarouselElementType]: () =>
    import('@dj-ui/carbon-ext/carbon-carousel').then((m) => m.CarbonCarouselComponent),
  [CarbonCarouselCardElementType]: () =>
    import('@dj-ui/carbon-ext/carbon-carousel-card').then((m) => m.CarbonCarouselCardComponent),
  [CarbonSimpleTextElementType]: () =>
    import('@dj-ui/carbon-ext/carbon-simple-text').then((m) => m.CarbonSimpleTextComponent),
};
