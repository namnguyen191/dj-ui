import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  type OnDestroy,
  type OnInit,
  type Signal,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SimpleGridLayoutSymbol } from '@dj-ui/common/shared';
import { BaseUIElementWrapperComponent } from '@dj-ui/core';
import type { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'prime-ng-playground-builder-feat-layout-editor-context-menu',
  imports: [Menu],
  templateUrl: './layout-editor-context-menu.component.html',
  styleUrl: './layout-editor-context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutEditorContextMenuComponent
  extends BaseUIElementWrapperComponent
  implements OnInit, OnDestroy
{
  static override readonly EXCLUDED_ELEMENTS = new Set<symbol>([SimpleGridLayoutSymbol]);

  readonly #document = inject(DOCUMENT);
  readonly #router = inject(Router);

  protected readonly menuItemsSig = signal<MenuItem[]>([]);

  readonly isContextMenuShow = signal<boolean>(false);

  private _contextMenuEleSig: Signal<ElementRef<HTMLDivElement> | undefined> = viewChild(
    'contextMenu',
    { read: ElementRef }
  );

  #preventDefaultContextMenu = (e: MouseEvent): void => {
    if (this.#isWithinUIElementArea(e)) {
      e.preventDefault();
    }
  };

  displayMenu(e: MouseEvent): void {
    if (this.#isRightClickInsideUIElementArea(e)) {
      e.stopPropagation();

      const contextMenuEle = untracked(this._contextMenuEleSig)?.nativeElement;

      if (!contextMenuEle) {
        console.error('Something is wrong. Context menu element is not found!');
        return;
      }
      const contextMenuX = `${e.clientX}px`;
      const contextMenuY = `${e.clientY}px`;

      contextMenuEle.style.setProperty('--pos-x', contextMenuX);
      contextMenuEle.style.setProperty('--pos-y', contextMenuY);
      this.isContextMenuShow.set(true);
      const uieTemplateId = untracked(this.uiElementTemplate).id;
      this.menuItemsSig.set([
        {
          label: `Edit ${uieTemplateId}`,
          icon: 'pi pi-cog',
          command: (): void => {
            void this.#router.navigate(['builder', 'ui-element', uieTemplateId]);
          },
        },
      ]);
    }
  }

  #hideContextMenu = (e: MouseEvent): void => {
    if (this.#isLeftClickOutsideControlMenuArea(e)) {
      this.isContextMenuShow.set(false);
      return;
    }
  };

  ngOnInit(): void {
    this.#document.addEventListener('contextmenu', this.#preventDefaultContextMenu);
    this.#document.addEventListener('mouseup', this.#hideContextMenu, { passive: true });
  }

  ngOnDestroy(): void {
    this.#document.removeEventListener('contextmenu', this.#preventDefaultContextMenu);
    this.#document.removeEventListener('mouseup', this.#hideContextMenu);
  }

  #getUIElementArea(e: MouseEvent): HTMLElement | null {
    const uiElementUID = untracked(this.uiElementComponentRef).instance.uid;

    let clickedElement = e.target as HTMLElement;

    while (clickedElement.parentElement) {
      if (clickedElement.getAttribute('uid') === uiElementUID) {
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
