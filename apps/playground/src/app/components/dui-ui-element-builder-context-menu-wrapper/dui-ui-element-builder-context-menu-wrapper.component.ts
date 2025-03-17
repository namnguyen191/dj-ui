import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import Edit16 from '@carbon/icons/es/edit/16';
import SettingsView16 from '@carbon/icons/es/settings--view/16';
import { UIElementExtraWrapperBaseComponent } from '@dj-ui/core';
import { ContainedListModule } from 'carbon-components-angular/contained-list';
import { IconModule, IconService } from 'carbon-components-angular/icon';

@Component({
  selector: 'namnguyen191-dui-ui-element-builder-context-menu-wrapper',
  imports: [CommonModule, ContainedListModule, IconModule],
  templateUrl: './dui-ui-element-builder-context-menu-wrapper.component.html',
  styleUrl: './dui-ui-element-builder-context-menu-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuiUIElementBuilderContextMenuWrapperComponent
  extends UIElementExtraWrapperBaseComponent
  implements OnInit, OnDestroy
{
  readonly #document = inject(DOCUMENT);
  readonly #iconService = inject(IconService);

  isContextMenuShow = signal<boolean>(false);

  private _contextMenuEleSig: Signal<ElementRef<HTMLDivElement> | undefined> = viewChild(
    'contextMenu',
    { read: ElementRef }
  );

  #preventDefaultContextMenu = (e: MouseEvent): void => {
    if (this.#isWithinUIElementArea(e)) {
      e.preventDefault();
    }
  };

  #toggleContextMenu = (e: MouseEvent): void => {
    if (this.#isLeftClickOutsideControlMenuArea(e)) {
      this.isContextMenuShow.set(false);
      return;
    }

    if (this.#isRightClickInsideUIElementArea(e) && !this.#isWithinContextMenuArea(e)) {
      const contextMenuEle = untracked(this._contextMenuEleSig)?.nativeElement;

      if (!contextMenuEle) {
        console.error('Something is wrong. Context menu element is not found!');
        return;
      }

      // Already right clicked on this area so it has to exists
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const uiElementArea = this.#getUIElementArea(e)!;

      const uiElementAreaRect = uiElementArea.getBoundingClientRect();
      const contextMenuX = `${e.clientX - uiElementAreaRect.left}px`;
      const contextMenuY = `${e.clientY - uiElementAreaRect.top}px`;

      contextMenuEle.style.setProperty('--pos-x', contextMenuX);
      contextMenuEle.style.setProperty('--pos-y', contextMenuY);
      this.isContextMenuShow.set(true);
    }
  };

  constructor() {
    super();
    this.#iconService.registerAll([Edit16, SettingsView16]);
  }

  ngOnInit(): void {
    this.#document.addEventListener('contextmenu', this.#preventDefaultContextMenu);
    this.#document.addEventListener('mouseup', this.#toggleContextMenu, { passive: true });
  }

  ngOnDestroy(): void {
    this.#document.removeEventListener('contextmenu', this.#preventDefaultContextMenu);
    this.#document.removeEventListener('mouseup', this.#toggleContextMenu);
  }

  #getUIElementArea(e: MouseEvent): HTMLElement | null {
    const uiElementId = untracked(this.uiElementInstance)?.id;

    if (!uiElementId) {
      throw new Error('Element instance ID has not been received');
    }

    let clickedElement = e.target as HTMLElement;

    while (clickedElement.parentElement) {
      if (clickedElement.className === 'grid-item' && clickedElement.id === uiElementId) {
        return clickedElement;
      }

      clickedElement = clickedElement.parentElement;
    }

    return null;
  }

  #isWithinContextMenuArea(e: MouseEvent): boolean {
    let clickedElement = e.target as HTMLElement;

    while (clickedElement.parentElement) {
      if (clickedElement.id === 'context-menu') {
        return true;
      }

      clickedElement = clickedElement.parentElement;
    }

    return false;
  }

  #isWithinUIElementArea(e: MouseEvent): boolean {
    return !!this.#getUIElementArea(e);
  }

  #isRightClickInsideUIElementArea(e: MouseEvent): boolean {
    return e.button === 2 && this.#isWithinUIElementArea(e);
  }

  #isLeftClickOutsideControlMenuArea(e: MouseEvent): boolean {
    return e.button === 0 && !this.#isWithinContextMenuArea(e);
  }
}
