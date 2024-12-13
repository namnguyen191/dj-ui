import { Directive, output } from '@angular/core';

@Directive({
  selector: '[djuiCommonEmitOnClick]',
  host: {
    '(click)': 'onClick($event)',
  },
})
export class EmitOnClickDirective {
  hostClicked = output<void>();

  onClick(): void {
    this.hostClicked.emit();
  }
}
