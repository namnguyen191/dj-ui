import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { registerSingleFileUploadDataFetcher, setupDefault } from '@dj-ui/common';
import { ActionHookService } from '@dj-ui/core';
import {
  HeaderModule,
  NotificationModule,
  ThemeModule,
  type ToastContent,
} from 'carbon-components-angular';

import { ResetLocalApiBtnComponent } from './components/reset-local-api-btn/reset-local-api-btn.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    NotificationModule,
    ThemeModule,
    HeaderModule,
    ResetLocalApiBtnComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #actionHookService = inject(ActionHookService);

  readonly ENABLE_LOCAL_API = ENABLE_LOCAL_API;

  isNotificationDisplayed = signal<boolean>(false);
  notificationConfig: ToastContent = {
    type: 'info',
    title: 'Custom hook toast',
    subtitle: 'This toast was triggered by a custom hook',
    caption:
      'Testing custom action hook by registering a hook that open this toast. If you are seeing this toast then it is working',
    showClose: true,
  };

  constructor() {
    setupDefault();
    registerSingleFileUploadDataFetcher();
    this.#actionHookService.registerHook({
      hookId: 'showTestNotification',
      handler: () => {
        this.#showNotification();
      },
    });
  }

  #showNotification(): void {
    this.isNotificationDisplayed.set(true);
  }
}
