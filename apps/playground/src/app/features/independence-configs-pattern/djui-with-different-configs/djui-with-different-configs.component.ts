import { Component } from '@angular/core';

import { DJUIConfigModule } from '../dj-ui-config.module';

@Component({
  selector: 'app-djui-with-different-configs',
  imports: [DJUIConfigModule],
  templateUrl: './djui-with-different-configs.component.html',
  styleUrl: './djui-with-different-configs.component.scss',
})
export class DjuiWithDifferentConfigsComponent {}
