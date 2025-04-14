import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { setupDefault } from '@dj-ui/common';
import type { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  imports: [RouterModule, MenubarModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  mainMenuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Builders',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'UI Element',
          icon: 'pi pi-chart-bar',
          routerLink: '/builders/ui-element',
        },
      ],
    },
  ];

  constructor() {
    setupDefault();
  }
}
