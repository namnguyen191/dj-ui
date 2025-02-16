import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-layout-template-loading-state',
  imports: [CommonModule],
  templateUrl: './layout-template-loading-state.component.html',
  styleUrl: './layout-template-loading-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutTemplateLoadingStateComponent {}
