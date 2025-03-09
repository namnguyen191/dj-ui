import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { setupDefault } from '@dj-ui/common';
import { MenubarModule } from 'primeng/menubar';

@Component({
  imports: [RouterModule, MenubarModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  mainMenuItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: 'home',
    },
  ];

  constructor() {
    setupDefault();
  }
}
