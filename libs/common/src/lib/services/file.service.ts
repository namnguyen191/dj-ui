import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';

export type SelectFilesParam = {
  single?: boolean;
  extensions?: string[];
};

@Injectable({
  providedIn: 'root',
})
export class FileService {
  readonly #document = inject(DOCUMENT);
  readonly FILE_INPUT_ELE_ID = 'file_input_element';
  #fileInputEle: HTMLInputElement | null = null;
  #selectedFiles$ = new Subject<FileList | null>();

  #fileInputNotReadyError = new Error('File input element has not been initialized');

  constructor() {
    this.#setupFileInput();
  }

  selectFiles(params: SelectFilesParam = {}): Promise<FileList | null> {
    if (!this.#fileInputEle) {
      throw new Error('File input element has not been initialized');
    }

    const { single, extensions = [] } = params;

    if (single) {
      this.#setFileInputToSingle();
    } else {
      this.#setFileInputToMulti();
    }

    this.#setFileInputExtensions(extensions);

    this.#fileInputEle.click();

    return firstValueFrom(this.#selectedFiles$);
  }

  #setupFileInput(): void {
    const existingFileInput = this.#document.getElementById(
      this.FILE_INPUT_ELE_ID
    ) as HTMLInputElement | null;

    if (existingFileInput) {
      this.#fileInputEle = existingFileInput;
      return;
    }

    this.#fileInputEle = this.#document.createElement('input');

    this.#fileInputEle.setAttribute('id', this.FILE_INPUT_ELE_ID);
    this.#fileInputEle.setAttribute('type', 'file');
    this.#fileInputEle.setAttribute('multiple', '');
    this.#fileInputEle.style.display = 'none';

    this.#document.body.append(this.#fileInputEle);

    this.#fileInputEle.addEventListener('change', (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (!files) {
        return;
      }
      this.#selectedFiles$.next(files);
    });

    this.#fileInputEle.addEventListener('cancel', () => {
      this.#selectedFiles$.next(null);
    });
  }

  #setFileInputToSingle(): void {
    if (!this.#fileInputEle) {
      throw this.#fileInputNotReadyError;
    }

    this.#fileInputEle.removeAttribute('multiple');
  }

  #setFileInputToMulti(): void {
    if (!this.#fileInputEle) {
      throw this.#fileInputNotReadyError;
    }

    this.#fileInputEle.setAttribute('multiple', '');
  }

  #setFileInputExtensions(extensions: string[]): void {
    if (!this.#fileInputEle) {
      throw this.#fileInputNotReadyError;
    }

    if (extensions.length === 0) {
      this.#fileInputEle.removeAttribute('accept');
      return;
    }

    const accept: string = extensions.map((ext) => `.${ext}`).join(',');

    this.#fileInputEle.setAttribute('accept', accept);
  }
}
