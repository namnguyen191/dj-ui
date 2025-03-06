import { ComponentLoadersMap } from '@dj-ui/common';
import { SimpleTextElementType } from '@dj-ui/prime-ng-ext/shared';

export const PrimeNgComponentLoader: ComponentLoadersMap = {
  [SimpleTextElementType]: () =>
    import('@dj-ui/prime-ng-ext/simple-text').then((m) => m.SimpleTextComponent),
};
