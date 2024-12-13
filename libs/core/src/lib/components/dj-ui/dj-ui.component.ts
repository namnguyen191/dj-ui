import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'djui',
  imports: [CommonModule, LayoutComponent],
  templateUrl: './dj-ui.component.html',
  styleUrl: './dj-ui.component.scss',
})
export class DjuiComponent {
  layoutId: InputSignal<string> = input.required<string>();
}
