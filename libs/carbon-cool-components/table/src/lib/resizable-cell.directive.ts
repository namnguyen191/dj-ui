import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: '[cccTableResizableCell]',
  host: {
    '[style.width]': 'width()',
  },
  standalone: true,
})
export class TableResizableCell {
  readonly cellId = input.required<string>({
    alias: 'cccTableResizableCell',
  });

  readonly width = computed(() => `calc(var(--col-${this.cellId()}-size) * 1px)`);
}
