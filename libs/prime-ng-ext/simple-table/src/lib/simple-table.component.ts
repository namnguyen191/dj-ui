import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type InputSignal,
  output,
} from '@angular/core';
import {
  BaseUIElementComponent,
  type UIElementImplementation,
  UIElementRendererDirective,
} from '@dj-ui/core';
import {
  type PaginationChangedPayload,
  SimpleImageSymbol,
  SimpleTableElementType,
  SimpleTableSymbol,
  type SimpleTableUIEConfigs,
  type SimpleTableUIEEvents,
  type TableColumnsConfig,
  type TablePaginationConfigs,
  type TableRowsConfig,
  type TableStylesConfigs,
  ZSimpleTableUIEConfigs,
} from '@dj-ui/prime-ng-ext/shared';
import { parseZodWithDefault } from '@namnguyen191/types-helper';
import { isEmpty } from 'lodash-es';
import { PaginatorModule, type PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import type { UnknownRecord } from 'type-fest';

import { ColumnsTemplateTypeDirective } from './columns-type.directive';
import { RowsTemplateTypeDirective } from './rows-type.directive';

@Component({
  selector: 'dj-ui-prime-ng-simple-table',
  imports: [
    CommonModule,
    TableModule,
    ColumnsTemplateTypeDirective,
    RowsTemplateTypeDirective,
    PaginatorModule,
    UIElementRendererDirective,
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

  readonly #defaultTitle = 'Default title';
  readonly titleConfigOption: InputSignal<SimpleTableUIEConfigs['title']> = input(
    this.#defaultTitle,
    {
      alias: 'title',
      transform: (val) =>
        parseZodWithDefault(ZSimpleTableUIEConfigs.shape.title, val, this.#defaultTitle),
    }
  );

  readonly #defaultResizableColumns = false;
  readonly resizableColumnsConfigOption: InputSignal<SimpleTableUIEConfigs['resizableColumns']> =
    input(this.#defaultResizableColumns, {
      alias: 'resizableColumns',
      transform: (val) =>
        parseZodWithDefault(
          ZSimpleTableUIEConfigs.shape.resizableColumns,
          val,
          this.#defaultResizableColumns
        ),
    });

  readonly #defaultStripes = false;
  readonly stripesConfigOption: InputSignal<SimpleTableUIEConfigs['stripes']> = input(
    this.#defaultStripes,
    {
      alias: 'stripes',
      transform: (val) =>
        parseZodWithDefault(ZSimpleTableUIEConfigs.shape.stripes, val, this.#defaultStripes),
    }
  );

  readonly #defaultGridLines = false;
  readonly gridLinesConfigOption: InputSignal<SimpleTableUIEConfigs['stripes']> = input(
    this.#defaultGridLines,
    {
      alias: 'gridLines',
      transform: (val) =>
        parseZodWithDefault(ZSimpleTableUIEConfigs.shape.gridLines, val, this.#defaultGridLines),
    }
  );

  readonly columnsConfigOption: InputSignal<TableColumnsConfig> = input([], {
    alias: 'columns',
    transform: (val) =>
      parseZodWithDefault<TableColumnsConfig>(ZSimpleTableUIEConfigs.shape.columns, val, []),
  });

  readonly rowsConfigOption: InputSignal<TableRowsConfig> = input([], {
    alias: 'rows',
    transform: (val) =>
      parseZodWithDefault<TableRowsConfig>(ZSimpleTableUIEConfigs.shape.rows, val, []),
  });

  readonly #defaultPaginationPageSizes = [5, 10, 20];
  readonly paginationConfigOption: InputSignal<TablePaginationConfigs> = input(
    {},
    {
      alias: 'pagination',
      transform: (val) => {
        const result = parseZodWithDefault<TablePaginationConfigs>(
          ZSimpleTableUIEConfigs.shape.pagination,
          val,
          {
            pageSizes: this.#defaultPaginationPageSizes,
          }
        );
        return result;
      },
    }
  );
  protected readonly shouldDisplayPagination = computed(
    () => !isEmpty(this.paginationConfigOption())
  );

  readonly #defaultTableStyles: TableStylesConfigs = {};
  readonly stylesConfigOption: InputSignal<TableStylesConfigs> = input(this.#defaultTableStyles, {
    alias: 'styles',
    transform: (val) =>
      parseZodWithDefault<TableStylesConfigs>(
        ZSimpleTableUIEConfigs.shape.styles,
        val,
        this.#defaultTableStyles
      ),
  });

  protected tableCellSupportedTemplates = [SimpleImageSymbol];

  readonly paginationChanged = output<PaginationChangedPayload>();

  protected pageChange(e: PaginatorState): void {
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

  protected isUnknownRecord(input: unknown): input is UnknownRecord {
    return typeof input === 'object';
  }
}
