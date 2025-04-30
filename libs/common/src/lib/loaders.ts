import { type ComponentLoadersMap, SimpleGridLayoutElementType } from '@dj-ui/common/shared';

export const CommonComponentLoader: ComponentLoadersMap = {
  [SimpleGridLayoutElementType]: () =>
    import('@dj-ui/common/simple-grid-layout').then((m) => m.SimpleGridLayoutComponent),
};
