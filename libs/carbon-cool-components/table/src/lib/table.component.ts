import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type Signal,
  untracked,
} from '@angular/core';
import { CDSTableModule } from '@dj-ui/ng-carbon-wcmp-bridge/data-table';
import {
  type ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  type Table,
} from '@tanstack/angular-table';

import { TableResizableCell } from './resizable-cell.directive';

export type Column = {
  id: string;
  label: string;
};

@Component({
  selector: 'ccc-table',
  imports: [FlexRenderDirective, CDSTableModule, TableResizableCell],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  data = input<unknown[]>([]);

  columns = input<Column[]>([]);
  readonly #tanstackColumns = computed<ColumnDef<unknown>[]>(() => {
    const cols = this.columns();
    return cols.map((col) => ({
      accessorKey: col.id,
      header: col.label,
    }));
  });

  protected readonly table: Table<unknown> & Signal<Table<unknown>> = createAngularTable(() => ({
    data: this.data(),
    columns: this.#tanstackColumns(),
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
  }));
  protected readonly columnSizing = computed(() => {
    return this.table.getState().columnSizing;
  });
  protected readonly currentResizingColumnId = computed<string | false>(() => {
    return this.table.getState().columnSizingInfo.isResizingColumn;
  });

  protected readonly columnSizeVars = computed(() => {
    this.columnSizing();

    const headers = untracked(() => this.table.getFlatHeaders());
    const colSizes: { [key: string]: number } = {};

    for (const header of headers) {
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }

    return colSizes;
  });
}
