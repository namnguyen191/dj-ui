import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { registerSingleFileUploadDataFetcher, setupDefault } from '@dj-ui/common';
import { ActionHookService } from '@dj-ui/core';
import {
  HeaderModule,
  NotificationModule,
  ThemeModule,
  ToastContent,
} from 'carbon-components-angular';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, NotificationModule, ThemeModule, HeaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly #actionHookService = inject(ActionHookService);

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
      handler: () => this.#showNotification(),
    });
  }

  #showNotification(): void {
    this.isNotificationDisplayed.set(true);
  }
}
