import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutComponent } from '@dj-ui/core';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LayoutComponent, MenuModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  items = [
    {
      label: 'Introduction',
    },
    {
      label: 'Profile',
      items: [
        {
          label: 'Settings',
          icon: 'pi pi-cog',
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
        },
      ],
    },
  ];
}
