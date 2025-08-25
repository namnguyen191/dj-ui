import { Component, input } from '@angular/core';

@Component({
  selector: 'ccc-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  /** Text inside the button */
  label = input<string>('Default label');
}
