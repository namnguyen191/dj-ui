import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ui-element-template-loading-state',
  imports: [CommonModule],
  templateUrl: './ui-element-template-loading-state.component.html',
  styleUrl: './ui-element-template-loading-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiElementTemplateLoadingStateComponent {}
