import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  ButtonModule,
  Table,
  TableHeaderItem,
  TableItem,
  TableModel,
  TableModule,
} from 'carbon-components-angular';

import { TemplateInfo } from '../../../../shared/dj-ui-app-template';
import { LayoutTemplatesStore } from '../../../../state-store/layoutTemplates.store';

@Component({
  selector: 'namnguyen191-layouts-list-page',
  imports: [CommonModule, TableModule, ButtonModule, RouterModule],
  templateUrl: './layouts-list-page.component.html',
  styleUrl: './layouts-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutsListPageComponent {
  readonly #layoutTemplatesStore = inject(LayoutTemplatesStore);
  readonly #cdr = inject(ChangeDetectorRef);
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);

  loadingSig = this.#layoutTemplatesStore.isPending;
  allLayoutsInfoSig = this.#layoutTemplatesStore.allLayoutTemplatesInfo;
  tableModel = new TableModel();
  tableSkeletonModel = Table.skeletonModel(20, 3);

  constructor() {
    this.tableModel.header = this.#constructTableHeader();

    effect(() => {
      const allLayoutsInfo = this.allLayoutsInfoSig();
      this.tableModel.data = this.#constructTableRows(allLayoutsInfo);
      this.#cdr.detectChanges();
    });
  }

  onRowClick(e: number): void {
    const currentId = this.tableModel.data[e]?.[1]?.data as string;
    this.#router.navigate(['edit', currentId], {
      relativeTo: this.#activatedRoute,
    });
  }

  #constructTableHeader(): TableHeaderItem[] {
    return [
      new TableHeaderItem({
        data: 'Name',
      }),
      new TableHeaderItem({
        data: 'ID',
      }),
      new TableHeaderItem({
        data: 'Created at',
      }),
      new TableHeaderItem({
        data: 'Updated at',
      }),
    ];
  }

  #constructTableRows(templatesInfo: TemplateInfo[]): TableItem[][] {
    const dateFormatter = new Intl.DateTimeFormat('en-US');
    return templatesInfo.map(({ name, id, createdAt, updatedAt }) => {
      const createdAtDate = new Date(createdAt);
      const formattedCreatedAtDate = dateFormatter.format(createdAtDate);
      const updatedAtDate = updatedAt ? new Date(updatedAt) : null;
      const formattedUpdatedAtDate = updatedAtDate
        ? dateFormatter.format(updatedAtDate)
        : 'Newly created';
      return [
        new TableItem({
          data: name,
        }),
        new TableItem({
          data: id,
        }),
        new TableItem({
          data: formattedCreatedAtDate,
        }),
        new TableItem({
          data: formattedUpdatedAtDate,
        }),
      ];
    });
  }
}
