import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type InputSignal,
} from '@angular/core';
import {
  type GridConfigOption,
  SimpleGridLayoutElementType,
  SimpleGridLayoutSymbol,
  type SimpleGridLayoutUIEConfigs,
  type SimpleGridUIElementPositionAndSize,
  type UIElementInstanceConfigOption,
  ZGridConfigOption,
  ZSimpleGridLayoutUIEConfigs,
} from '@dj-ui/common/shared';
import { parseZodWithDefault } from '@dj-ui/common/shared';
import {
  BaseUIElementComponent,
  type UIElementImplementation,
  UIElementRendererDirective,
} from '@dj-ui/core';

type GridItem = {
  id: string;
  trackById: string;
  elementInstance: UIElementInstanceConfigOption;
};

const DEFAULT_GRID_COLS: GridConfigOption['columns'] = 16;
const DEFAULT_GRID_ROW_HEIGHT: GridConfigOption['rowHeight'] = '1rem';
const DEFAULT_GRID_GAP: GridConfigOption['gap'] = '0px';
const DEFAULT_GRID_PADDING: GridConfigOption['padding'] = '0px';

@Component({
  selector: 'dj-ui-common-simple-grid-layout',
  imports: [UIElementRendererDirective],
  templateUrl: './simple-grid-layout.component.html',
  styleUrl: './simple-grid-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleGridLayoutComponent
  extends BaseUIElementComponent
  implements UIElementImplementation<SimpleGridLayoutUIEConfigs>
{
  static override readonly ELEMENT_TYPE = SimpleGridLayoutElementType;
  static override readonly ELEMENT_SYMBOL = SimpleGridLayoutSymbol;

  override getElementType(): string {
    return SimpleGridLayoutComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return SimpleGridLayoutComponent.ELEMENT_SYMBOL;
  }

  readonly #defaultGridConfigOption: GridConfigOption = {
    columns: DEFAULT_GRID_COLS,
    rowHeight: DEFAULT_GRID_ROW_HEIGHT,
    gap: DEFAULT_GRID_GAP,
    padding: DEFAULT_GRID_PADDING,
  };
  gridConfigOption: InputSignal<GridConfigOption> = input(this.#defaultGridConfigOption, {
    alias: 'grid',
    transform: (val) => {
      const userConfig = parseZodWithDefault<GridConfigOption>(
        ZGridConfigOption,
        val,
        this.#defaultGridConfigOption
      );
      return {
        ...this.#defaultGridConfigOption,
        ...userConfig,
      };
    },
  });

  uiElementInstancesConfigOption: InputSignal<UIElementInstanceConfigOption[]> = input([], {
    alias: 'uiElementInstances',
    transform: (val) =>
      parseZodWithDefault<UIElementInstanceConfigOption[]>(
        ZSimpleGridLayoutUIEConfigs.shape.uiElementInstances,
        val,
        []
      ),
  });

  readonly DEFAULT_UI_ELEMENT_COLS: SimpleGridUIElementPositionAndSize['cols'] = 4;
  readonly DEFAULT_UI_ELEMENT_ROWS: SimpleGridUIElementPositionAndSize['rows'] = 20;
  readonly DEFAULT_UI_ELEMENT_MAX_HEIGHT: SimpleGridUIElementPositionAndSize['maxHeight'] = 'auto';

  protected readonly gridItems = computed<GridItem[] | null>(() => {
    return this.uiElementInstancesConfigOption().map((eI) => {
      return {
        id: eI.id,
        elementInstance: eI,
        trackById: eI.id,
      };
    });
  });
}
