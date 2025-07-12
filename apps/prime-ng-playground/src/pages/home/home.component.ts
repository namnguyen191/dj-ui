import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { UIElementRendererDirective } from '@dj-ui/core';
import type { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-home',
  imports: [UIElementRendererDirective, MenuModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly #document = inject(DOCUMENT);

  items: MenuItem[] = [
    {
      label: 'Introduction',
      items: [
        {
          label: 'Welcome to DJ-UI',
          command: (): void => {
            this.scrollToElement('3');
          },
        },
      ],
    },
    {
      label: 'Installation',
      items: [
        {
          label: 'Requirements & commands',
          command: (): void => {
            this.scrollToElement('4');
          },
        },
      ],
    },
    {
      label: 'Simple setup',
      items: [
        {
          label: 'Fetchers and component loaders',
          command: (): void => {
            this.scrollToElement('5');
          },
        },
        {
          label: 'Js runner',
          command: (): void => {
            this.scrollToElement('home-simple-setup-guide.PRIME_NG_SIMPLE_TEXT.js-runner');
          },
        },
        {
          label: 'Extension lib integration',
          command: (): void => {
            this.scrollToElement('home-simple-setup-guide.PRIME_NG_SIMPLE_TEXT.lib-integration');
          },
        },
        {
          label: 'Basic usage',
          command: (): void => {
            this.scrollToElement('home-simple-setup-guide.PRIME_NG_SIMPLE_TEXT.basic-usage');
          },
        },
      ],
    },
  ];

  scrollToElement(id: string): void {
    const element = this.#document.getElementById(id);

    if (!element) {
      console.warn(`Trying to scroll to element with id ${id} but could not find it on the page`);
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
