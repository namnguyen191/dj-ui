/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type ComponentLoadersMap, SimpleGridLayoutElementType } from '@dj-ui/common/shared';

export const CommonComponentLoader = {
  [SimpleGridLayoutElementType]: () =>
    import('@dj-ui/common/simple-grid-layout').then((m) => m.SimpleGridLayoutComponent),
} satisfies ComponentLoadersMap;
