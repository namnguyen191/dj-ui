import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SimpleGridLayoutComponent } from '@dj-ui/common';

import { DJUIConfigModule } from '../dj-ui-config.module';

@Component({
  selector: 'app-djui-with-different-configs',
  imports: [DJUIConfigModule, SimpleGridLayoutComponent],
  templateUrl: './djui-with-different-configs.component.html',
  styleUrl: './djui-with-different-configs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DjuiWithDifferentConfigsComponent {}
