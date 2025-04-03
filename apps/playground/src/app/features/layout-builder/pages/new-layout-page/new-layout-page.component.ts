import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  type AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  ButtonModule,
  DropdownModule,
  InlineLoadingModule,
  InlineLoadingState,
  InputModule,
  LoadingModule,
} from 'carbon-components-angular';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

import {
  type CreateAppLayoutTemplatePayload,
  LayoutTemplatesAPIService,
} from '../../../../services/layout-templates-api.service';
import { LayoutTemplatesStore } from '../../../../state-store/layoutTemplates.store';

export type NewLayoutForm = {
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
};

const isLayoutIdUnique = (): AsyncValidatorFn => {
  const layoutTemplatesAPIService = inject(LayoutTemplatesAPIService);
  return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() => layoutTemplatesAPIService.fetchLayoutTemplate(control.value)),
      map(() => ({ idNotUnique: true })),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 404) {
            return of(null);
          }
        }
        return of({ idNotUnique: true });
      })
    );
  };
};

@Component({
  selector: 'namnguyen191-new-layout-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    ButtonModule,
    LoadingModule,
    DropdownModule,
    InlineLoadingModule,
    RouterModule,
  ],
  templateUrl: './new-layout-page.component.html',
  styleUrl: './new-layout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewLayoutPageComponent {
  #layoutTemplatesStore = inject(LayoutTemplatesStore);
  loadingSig = this.#layoutTemplatesStore.isPending;
  #router = inject(Router);

  newLayoutForm = new FormGroup<NewLayoutForm>({
    id: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
      asyncValidators: [isLayoutIdUnique()],
    }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  getFieldErrorMessage(field: keyof NewLayoutForm): string {
    const formControl = this.newLayoutForm.controls[field];

    // If the field hasn't been interacted with then we will ignore all errors
    if (!formControl.touched) {
      return '';
    }

    const errors = formControl.errors;
    if (errors === null) {
      return '';
    }

    const errorMsg: string[] = [];
    for (const errorName in errors) {
      switch (errorName) {
        case 'required':
          errorMsg.push('This field is required');
          break;
        case 'idNotUnique':
          errorMsg.push('This ID is not unique');
          break;
        default:
          errorMsg.push(`Unknown error: ${errorName}`);
          break;
      }
    }

    return errorMsg.join('. ');
  }

  getIdFieldState(): InlineLoadingState {
    const idField = this.newLayoutForm.controls.id;
    if (idField.pristine) {
      return InlineLoadingState.Hidden;
    }

    if (idField.pending) {
      return InlineLoadingState.Active;
    }

    if (idField.invalid) {
      return InlineLoadingState.Error;
    }

    return InlineLoadingState.Finished;
  }

  async onSubmit(): Promise<void> {
    const newLayoutPayload: CreateAppLayoutTemplatePayload = {
      ...this.newLayoutForm.getRawValue(),
      uiElementInstances: [],
    };
    const createdTemplate = await this.#layoutTemplatesStore.add(newLayoutPayload);
    void this.#router.navigateByUrl(`layout-builder/edit/${createdTemplate.id}`);
  }
}
