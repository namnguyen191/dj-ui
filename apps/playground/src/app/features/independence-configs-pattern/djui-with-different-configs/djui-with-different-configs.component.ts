import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIElementRendererDirective } from '@dj-ui/core';

import { DJUIConfigModule } from '../dj-ui-config.module';

@Component({
  selector: 'app-djui-with-different-configs',
  imports: [DJUIConfigModule, UIElementRendererDirective],
  templateUrl: './djui-with-different-configs.component.html',
  styleUrl: './djui-with-different-configs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DjuiWithDifferentConfigsComponent {}
