import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type InputSignal,
  output,
} from '@angular/core';
import { BaseUIElementComponent, type UIElementImplementation } from '@dj-ui/core';
import { SimpleTableElementType, SimpleTableSymbol } from '@dj-ui/prime-ng-ext/shared';
import { parseZodWithDefault } from '@namnguyen191/types-helper';
import { isEmpty } from 'lodash-es';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

import { ColumnsTemplateTypeDirective } from './columns-type.directive';
import { RowsTemplateTypeDirective } from './rows-type.directive';
import {
  type PaginationChangedPayload,
  type SimpleTableUIEConfigs,
  type SimpleTableUIEEvents,
  type TableColumnsConfig,
  type TablePaginationConfigs,
  type TableRowsConfig,
  ZSimpleTableUIEConfigs,
} from './simple-table.interface';

@Component({
  selector: 'dj-ui-prime-ng-simple-table',
  imports: [
    CommonModule,
    TableModule,
    ColumnsTemplateTypeDirective,
    RowsTemplateTypeDirective,
    PaginatorModule,
  ],
  templateUrl: './simple-table.component.html',
  styleUrl: './simple-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleTableComponent
  extends BaseUIElementComponent
  implements UIElementImplementation<SimpleTableUIEConfigs, SimpleTableUIEEvents>
{
  static override readonly ELEMENT_TYPE = SimpleTableElementType;
  static override readonly ELEMENT_SYMBOL = SimpleTableSymbol;

  override getElementType(): string {
    return SimpleTableComponent.ELEMENT_TYPE;
  }

  override getSymbol(): symbol {
    return SimpleTableComponent.ELEMENT_SYMBOL;
  }

  defaultTitle = 'Default title';
  titleConfigOption: InputSignal<SimpleTableUIEConfigs['title']> = input(this.defaultTitle, {
    alias: 'title',
    transform: (val) =>
      parseZodWithDefault(ZSimpleTableUIEConfigs.shape.title, val, this.defaultTitle),
  });

  defaultResizableColumns = false;
  resizableColumnsConfigOption: InputSignal<SimpleTableUIEConfigs['resizableColumns']> = input(
    this.defaultResizableColumns,
    {
      alias: 'resizableColumns',
      transform: (val) =>
        parseZodWithDefault(
          ZSimpleTableUIEConfigs.shape.resizableColumns,
          val,
          this.defaultResizableColumns
        ),
    }
  );

  defaultStripes = false;
  stripesConfigOption: InputSignal<SimpleTableUIEConfigs['stripes']> = input(this.defaultStripes, {
    alias: 'stripes',
    transform: (val) =>
      parseZodWithDefault(ZSimpleTableUIEConfigs.shape.stripes, val, this.defaultStripes),
  });

  defaultGridLines = false;
  gridLinesConfigOption: InputSignal<SimpleTableUIEConfigs['stripes']> = input(
    this.defaultGridLines,
    {
      alias: 'gridLines',
      transform: (val) =>
        parseZodWithDefault(ZSimpleTableUIEConfigs.shape.gridLines, val, this.defaultGridLines),
    }
  );

  columnsConfigOption: InputSignal<TableColumnsConfig> = input([], {
    alias: 'columns',
    transform: (val) =>
      parseZodWithDefault<TableColumnsConfig>(ZSimpleTableUIEConfigs.shape.columns, val, []),
  });

  rowsConfigOption: InputSignal<TableRowsConfig> = input([], {
    alias: 'rows',
    transform: (val) =>
      parseZodWithDefault<TableRowsConfig>(ZSimpleTableUIEConfigs.shape.rows, val, []),
  });

  readonly DEFAULT_PAGINATION_PAGE_SIZES = [5, 10, 20];
  paginationConfigOption: InputSignal<TablePaginationConfigs> = input(
    {},
    {
      alias: 'pagination',
      transform: (val) => {
        const result = parseZodWithDefault<TablePaginationConfigs>(
          ZSimpleTableUIEConfigs.shape.pagination,
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

  paginationChanged = output<PaginationChangedPayload>();

  pageChange(e: PaginatorState): void {
    const { page, rows } = e;

    if (page === undefined || rows === undefined) {
      console.warn(`Pagination event trigger but with missing info.\nPage: ${page}\nRows: ${rows}`);
      return;
    }

    this.paginationChanged.emit({
      pageLength: rows,
      selectedPage: page,
    });
  }
}
