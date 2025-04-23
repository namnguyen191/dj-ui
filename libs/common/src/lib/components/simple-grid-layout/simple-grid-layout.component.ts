import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';
import { BaseLayoutDirective, UiElementWrapperComponent } from '@dj-ui/core';

import { COMMON_SETUP_CONFIG } from '../../core-setup-helpers';
import type {
  GridConfigs,
  SimpleGridLayoutTemplate,
  SimpleGridUIElementInstance,
  SimpleGridUIElementPositionAndSize,
} from './simple-grid-layout-interfaces';

type GridItem = {
  id: string;
  trackById: string;
  elementInstance: SimpleGridUIElementInstance;
};

const DEFAULT_GRID_COLS: GridConfigs['columns'] = 16;
const DEFAULT_GRID_ROW_HEIGHT: GridConfigs['rowHeight'] = '1rem';
const DEFAULT_GRID_GAP: GridConfigs['gap'] = '0px';
const DEFAULT_GRID_PADDING: GridConfigs['padding'] = '0px';
const DEFAULT_GRID_CONFIGS: GridConfigs = {
  columns: DEFAULT_GRID_COLS,
  rowHeight: DEFAULT_GRID_ROW_HEIGHT,
  gap: DEFAULT_GRID_GAP,
  padding: DEFAULT_GRID_PADDING,
};

@Component({
  selector: 'dj-ui-common-simple-grid-layout',
  imports: [CommonModule, UiElementWrapperComponent],
  templateUrl: './simple-grid-layout.component.html',
  styleUrl: './simple-grid-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: BaseLayoutDirective,
      inputs: ['layoutId'],
    },
  ],
})
export class SimpleGridLayoutComponent {
  readonly #baseLayoutDirective = inject(BaseLayoutDirective<SimpleGridLayoutTemplate>);
  layoutLoadingComponent = inject(COMMON_SETUP_CONFIG, { optional: true })?.layoutLoadingComponent;

  readonly DEFAULT_UI_ELEMENT_COLS: SimpleGridUIElementPositionAndSize['cols'] = 4;
  readonly DEFAULT_UI_ELEMENT_ROWS: SimpleGridUIElementPositionAndSize['rows'] = 20;
  readonly DEFAULT_UI_ELEMENT_MAX_HEIGHT: SimpleGridUIElementPositionAndSize['maxHeight'] = 'auto';

  protected readonly layoutConfigSig = this.#baseLayoutDirective.layoutConfig;
  protected readonly isInfiniteSig = this.#baseLayoutDirective.isInfinite;

  protected readonly gridItems = computed<GridItem[] | null>(() => {
    const layoutConfig = this.layoutConfigSig();
    if (!layoutConfig || !layoutConfig.config) {
      return null;
    }

    return layoutConfig.config.uiElementInstances.map((eI: SimpleGridUIElementInstance) => {
      return {
        id: eI.id,
        elementInstance: eI,
        trackById: `LAYOUT: ${layoutConfig.id} - ELEMENT: ${eI.id}`,
      };
    });
  });

  layoutGridConfigs: Signal<GridConfigs | null> = computed(() => {
    const layoutConfig = this.layoutConfigSig();
    if (layoutConfig?.status !== 'loaded') {
      return null;
    }
    const gridConfigs = layoutConfig.config.gridConfigs ?? {};
    return {
      ...DEFAULT_GRID_CONFIGS,
      ...gridConfigs,
    };
  });
}
