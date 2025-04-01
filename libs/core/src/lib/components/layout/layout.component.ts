import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type InputSignal,
  linkedSignal,
  type Signal,
} from '@angular/core';
import { computedFromObservable } from '@namnguyen191/common-angular-helper';
import { parentContains } from '@namnguyen191/common-js-helper/dom-utils';

import { LayoutTemplateService } from '../../services/templates/layout-template.service';
import type {
  GridConfigs,
  LayoutTemplateWithStatus,
  UIElementInstance,
  UIElementPositionAndSize,
} from '../../services/templates/layout-template-interfaces';
import { CORE_LAYOUT_CONFIG } from './layout.interface';
import { UiElementWrapperComponent } from './ui-element-wrapper/ui-element-wrapper.component';

type GridItem = {
  id: string;
  trackById: string;
  elementInstance: UIElementInstance;
  positionAndSize: UIElementPositionAndSize;
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

const DEFAULT_UI_ELEMENT_COLS: UIElementPositionAndSize['cols'] = 4;
const DEFAULT_UI_ELEMENT_ROWS: UIElementPositionAndSize['rows'] = 20;
const DEFAULT_GRID_ITEM_POSITION_AND_SIZE: UIElementPositionAndSize = {
  cols: DEFAULT_UI_ELEMENT_COLS,
  rows: DEFAULT_UI_ELEMENT_ROWS,
};

@Component({
  selector: 'dj-ui-layout',
  imports: [CommonModule, UiElementWrapperComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  host: {
    '[attr.layoutId]': 'layoutId()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  readonly #layoutService = inject(LayoutTemplateService);
  readonly #elementRef = inject(ElementRef);

  layoutId: InputSignal<string> = input.required<string>();

  layoutConfig: Signal<LayoutTemplateWithStatus | undefined> = computedFromObservable(() => {
    const layoutId = this.layoutId();
    return this.#layoutService.getTemplate(layoutId);
  });

  gridItems = linkedSignal<GridItem[] | null>(() => {
    const layoutConfig = this.layoutConfig();
    if (!layoutConfig || !layoutConfig.config) {
      return null;
    }

    return layoutConfig.config.uiElementInstances.map((eI) => {
      const { positionAndSize } = eI;
      return {
        id: eI.id,
        elementInstance: eI,
        trackById: `LAYOUT: ${layoutConfig.id} - ELEMENT: ${eI.id}`,
        positionAndSize: {
          ...DEFAULT_GRID_ITEM_POSITION_AND_SIZE,
          ...positionAndSize,
        },
      };
    });
  });

  isInfinite: Signal<boolean> = computed(() => {
    const layoutId = this.layoutId();
    const curEle = this.#elementRef.nativeElement as HTMLElement;

    const isInfinite = parentContains({
      ele: curEle,
      attrName: 'layoutId',
      attrValue: layoutId,
    });

    if (isInfinite) {
      console.error(`Layout with id ${layoutId} has already existed in parents`);
    }

    return isInfinite;
  });

  layoutGridConfigs: Signal<GridConfigs | null> = computed(() => {
    const layoutConfig = this.layoutConfig();
    if (layoutConfig?.status !== 'loaded') {
      return null;
    }
    const gridConfigs = layoutConfig.config.gridConfigs ?? {};
    return {
      ...DEFAULT_GRID_CONFIGS,
      ...gridConfigs,
    };
  });

  layoutLoadingComponent = inject(CORE_LAYOUT_CONFIG, { optional: true })?.layoutLoadingComponent;
}
