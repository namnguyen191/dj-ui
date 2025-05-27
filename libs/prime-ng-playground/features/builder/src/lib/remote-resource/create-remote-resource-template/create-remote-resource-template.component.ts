/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RemoteResourceTemplatesStore } from '@dj-ui/prime-ng-playground/shared';
import { capitalize } from 'lodash-es';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TextareaModule } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import { isAlphaNumericValidator, isRRTemplateIdUniqueValidator } from '../../shared/form-utils';

type CreateRemoteResourceForm = {
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
};

@Component({
  selector: 'prime-ng-playground-builder-feat-create-remote-resource-template',
  imports: [
    IftaLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    Card,
    Button,
    TextareaModule,
    ProgressSpinner,
    Tooltip,
  ],
  templateUrl: './create-remote-resource-template.component.html',
  styleUrl: './create-remote-resource-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRemoteResourceTemplateComponent {
  protected readonly remoteResourceTemplatesStore = inject(RemoteResourceTemplatesStore);
  readonly #router = inject(Router);

  protected readonly createRemoteResourceForm = new FormGroup<CreateRemoteResourceForm>({
    id: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        isRRTemplateIdUniqueValidator(),
        isAlphaNumericValidator(),
        Validators.minLength(5),
        Validators.maxLength(50),
      ],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(50)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(150)],
    }),
  });

  protected async createRemoteResourceTemplate(): Promise<void> {
    if (this.createRemoteResourceForm.invalid) {
      return;
    }

    const createdUIETemplate = await this.remoteResourceTemplatesStore.add({
      ...this.createRemoteResourceForm.getRawValue(),
      options: {
        requests: [],
      },
    });

    await this.#router.navigate(['builder', 'remote-resource', createdUIETemplate.id]);
  }

  getFieldLabel(formControlName: keyof CreateRemoteResourceForm): string {
    const controlLabel = capitalize(formControlName);
    const formControl = this.createRemoteResourceForm.controls[formControlName];
    const validationErrors = formControl.errors;
    if ((formControl.untouched && formControl.pristine) || !validationErrors) {
      return controlLabel;
    }

    if (formControl.pristine) {
      formControl.markAsDirty();
    }

    const errorMessages = this.#getValidationErrorMessage(validationErrors);

    return `${controlLabel}: Errors: ${errorMessages.join(', ')}`;
  }

  protected getFormSubmitButtonTooltip(): string {
    if (!this.createRemoteResourceForm.invalid) {
      return '';
    }

    const errorForAllFieldsMessages: string[] = [];
    for (const [formControlKey, formControl] of Object.entries(
      this.createRemoteResourceForm.controls
    )) {
      if (!formControl.errors) {
        continue;
      }
      const errorMessages = this.#getValidationErrorMessage(formControl.errors);
      errorForAllFieldsMessages.push(
        `Field ${formControlKey} has the following errors:\n ${errorMessages.join('\n')}`
      );
    }
    return errorForAllFieldsMessages.join('\n');
  }

  protected navigateToViewAllPage(): Promise<boolean> {
    return this.#router.navigate(['builder', 'remote-resource']);
  }

  #getValidationErrorMessage(validationErrors: ValidationErrors): string[] {
    const errorMessages: string[] = [];
    for (const [errorKey, errorObj] of Object.entries(validationErrors)) {
      switch (errorKey) {
        case 'required': {
          errorMessages.push('This field is required');
          break;
        }
        case 'minlength': {
          errorMessages.push(
            `This field needs to be at least ${(errorObj as { requiredLength: number }).requiredLength} characters long`
          );
          break;
        }
        case 'maxlength': {
          errorMessages.push(
            `This field cannot exceed ${(errorObj as { requiredLength: number }).requiredLength} characters long`
          );
          break;
        }
        case 'idNotUnique': {
          errorMessages.push('This ID has already been taken');
          break;
        }
        case 'isAlphaNumeric': {
          errorMessages.push('This field must be alphanumeric');
          break;
        }
        default: {
          errorMessages.push('Unknown validation errors. Please try again later');
          console.warn(`${errorKey} is an unknown validation error that does not have any handler`);
        }
      }
    }

    return errorMessages;
  }
}
