import { ComponentLoadersMap } from '@dj-ui/common';
import {
  SimpleImageElementType,
  SimpleTableElementType,
  SimpleTextElementType,
} from '@dj-ui/prime-ng-ext/shared';

export const PrimeNgComponentLoader: ComponentLoadersMap = {
  [SimpleTextElementType]: () =>
    import('@dj-ui/prime-ng-ext/simple-text').then((m) => m.SimpleTextComponent),
  [SimpleImageElementType]: () =>
    import('@dj-ui/prime-ng-ext/simple-image').then((m) => m.SimpleImageComponent),
  [SimpleTableElementType]: () =>
    import('@dj-ui/prime-ng-ext/simple-table').then((m) => m.SimpleTableComponent),
};
