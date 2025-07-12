import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'dj-ui-carbon-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  isOpenSig = input<boolean>(false, {
    alias: 'isOpen',
  });

  closeDialog = output();

  dialogElementSig = viewChild<string, ElementRef<HTMLDialogElement>>('dialogEle', {
    read: ElementRef,
  });

  constructor() {
    effect(() => {
      const dialogElement = this.dialogElementSig();

      if (!dialogElement) {
        return;
      }

      const dialog = dialogElement.nativeElement;

      const isOpen = this.isOpenSig();

      if (isOpen && !dialog.open) {
        dialog.showModal();
      }
    });
  }

  closeModalWithMouseClick(e: MouseEvent): void {
    const dialog = this.dialogElementSig()?.nativeElement;
    if (!dialog || e.target !== dialog) {
      return;
    }

    dialog.close();
  }

  closeModalWithKeyPress(): void {
    // we don't really need to do anything as dialog natively support closing on Esc key press
    // only adding this to keep eslint happy
    return;
  }
}
