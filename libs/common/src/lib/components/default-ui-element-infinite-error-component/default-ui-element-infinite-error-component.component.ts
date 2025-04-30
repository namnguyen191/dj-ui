import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dj-ui-common-default-ui-element-infinite-error-component',
  imports: [CommonModule],
  templateUrl: './default-ui-element-infinite-error-component.component.html',
  styleUrl: './default-ui-element-infinite-error-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultUiElementInfiniteErrorComponentComponent {}
