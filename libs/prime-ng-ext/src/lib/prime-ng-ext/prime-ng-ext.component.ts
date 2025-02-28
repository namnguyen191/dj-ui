import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dj-ui-prime-ng-ext',
  imports: [CommonModule],
  templateUrl: './prime-ng-ext.component.html',
  styleUrl: './prime-ng-ext.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimeNgExtComponent {}
