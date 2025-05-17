import { Directive, output } from '@angular/core';

@Directive({
  selector: '[djuiCommonEmitOnClick]',
  host: {
    '(click)': 'onClick($event)',
  },
})
export class EmitOnClickDirective {
  hostClicked = output();

  onClick(): void {
    this.hostClicked.emit();
  }
}
