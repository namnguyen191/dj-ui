import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  output,
  Signal,
  untracked,
} from '@angular/core';
import {
  CarbonButtonSymbol,
  CarbonTableElementType,
  CarbonTableSymbol,
} from '@dj-ui/carbon-ext/shared';
import {
  BaseUIElementComponent,
  UIElementImplementation,
  UiElementWrapperComponent,
} from '@dj-ui/core';
import { parseZodWithDefault } from '@namnguyen191/types-helper';
import {
  PaginationModel,
  PaginationModule,
  TableHeaderItem,
  TableItem,
  TableModel,
  TableModule,
} from 'carbon-components-angular';
import { isEmpty } from 'lodash-es';

import {
  CarbonTableUIElementComponentConfigs,
  CarbonTableUIElementComponentEvents,
  PaginationChangedPayload,
  TableDescriptionConfig,
  TableHeadersConfig,
  TablePaginationConfigs,
  TableRowsConfig,
  ZodCarbonTableUIElementComponentConfigs,
} from './carbon-table.interface';

@Component({
  selector: 'dj-ui-carbon-table',
  imports: [CommonModule, TableModule, PaginationModule, UiElementWrapperComponent],
  templateUrl: './carbon-table.component.html',
  styleUrl: './carbon-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonTableComponent
  extends BaseUIElementComponent
  implements
    UIElementImplementation<
      CarbonTableUIElementComponentConfigs,
      CarbonTableUIElementComponentEvents
    >
{
  static override readonly ELEMENT_TYPE = CarbonTableElementType;
  static override readonly ELEMENT_SYMBOL = CarbonTableSymbol;

  override getElementType(): string {
    return CarbonTableComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return CarbonTableComponent.ELEMENT_SYMBOL;
  }

  defaultTitle = 'Default title';
  titleConfigOption: InputSignal<string> = input(this.defaultTitle, {
    alias: 'title',
    transform: (val) =>
      parseZodWithDefault(
        ZodCarbonTableUIElementComponentConfigs.shape.title,
        val,
        this.defaultTitle
      ),
  });

  primaryButtonIdConfigOption: InputSignal<string> = input('', {
    alias: 'primaryButtonId',
    transform: (val) =>
      parseZodWithDefault(ZodCarbonTableUIElementComponentConfigs.shape.primaryButtonId, val, ''),
  });

  headersConfigOption: InputSignal<TableHeadersConfig> = input([], {
    alias: 'headers',
    transform: (val) =>
      parseZodWithDefault<TableHeadersConfig>(
        ZodCarbonTableUIElementComponentConfigs.shape.headers,
        val,
        []
      ),
  });

  descriptionConfigOption: InputSignal<TableDescriptionConfig> = input('', {
    alias: 'description',
    transform: (val) =>
      parseZodWithDefault<TableDescriptionConfig>(
        ZodCarbonTableUIElementComponentConfigs.shape.description,
        val,
        ''
      ),
  });

  rowsConfigOption: InputSignal<TableRowsConfig> = input([], {
    alias: 'rows',
    transform: (val) =>
      parseZodWithDefault<TableRowsConfig>(
        ZodCarbonTableUIElementComponentConfigs.shape.rows,
        val,
        []
      ),
  });

  tableModel: Signal<TableModel> = computed(() => {
    const headerConfig = this.headersConfigOption();
    const rowsConfig = this.rowsConfigOption();

    const model = new TableModel();
    model.header = headerConfig.map((headerName) => new TableHeaderItem({ data: headerName }));
    model.data = rowsConfig.map((row) => row.map((item) => new TableItem({ data: item })));

    return model;
  });

  readonly DEFAULT_PAGINATION_PAGE_SIZES = [5, 10, 20];
  paginationConfigOption: InputSignal<TablePaginationConfigs> = input(
    {},
    {
      alias: 'pagination',
      transform: (val) => {
        const result = parseZodWithDefault<TablePaginationConfigs>(
          ZodCarbonTableUIElementComponentConfigs.shape.pagination,
          val,
          {
            pageSizes: this.DEFAULT_PAGINATION_PAGE_SIZES,
          }
        );
        return result;
      },
    }
  );
  shouldDisplayPagination = computed(() => !isEmpty(this.paginationConfigOption()));
  paginationModel = computed<PaginationModel>(() => {
    const paginationConfig = this.paginationConfigOption();
    const pageLength = paginationConfig.pageSizes?.[0] ?? this.DEFAULT_PAGINATION_PAGE_SIZES[0];
    const totalDataLength = paginationConfig.totalDataLength;
    const pgModel = new PaginationModel();
    pgModel.currentPage = 1;
    pgModel.pageLength = pageLength;
    pgModel.totalDataLength = totalDataLength ?? 0;
    return pgModel;
  });

  paginationChanged = output<PaginationChangedPayload>();

  carbonButtonSymbol = CarbonButtonSymbol;

  selectPage(selectedPage: number): void {
    const paginationModel = untracked(this.paginationModel);
    paginationModel.currentPage = selectedPage;

    const pageLength = paginationModel.pageLength ?? 0;

    this.paginationChanged.emit({ pageLength, selectedPage });
  }
}
