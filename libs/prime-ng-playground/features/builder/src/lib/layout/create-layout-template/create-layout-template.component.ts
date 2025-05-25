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
import {
  AllLayoutUIElementTypes,
  type LayoutUIElementTypes,
  UIElementTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';
import { capitalize } from 'lodash-es';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';

import { isAlphaNumericValidator, isUIETemplateIdUniqueValidator } from '../../shared/form-utils';

type CreateUIElementForm = {
  id: FormControl<string>;
  type: FormControl<LayoutUIElementTypes>;
  name: FormControl<string>;
  description: FormControl<string>;
};

@Component({
  selector: 'prime-ng-playground-builder-feat-create-layout-template',
  imports: [
    IftaLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    Select,
    Card,
    Button,
    TextareaModule,
    ProgressSpinner,
    Tooltip,
  ],
  templateUrl: './create-layout-template.component.html',
  styleUrl: './create-layout-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLayoytTemplateComponent {
  protected readonly uiElementTemplatesStore = inject(UIElementTemplatesStore);
  readonly #router = inject(Router);

  protected readonly createUIElementForm = new FormGroup<CreateUIElementForm>({
    id: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        isUIETemplateIdUniqueValidator(),
        isAlphaNumericValidator(),
        Validators.minLength(5),
        Validators.maxLength(50),
      ],
    }),
    type: new FormControl('SIMPLE_GRID_LAYOUT', { nonNullable: true }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(50)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(150)],
    }),
  });

  protected readonly uiElementTypes = Object.entries(AllLayoutUIElementTypes).map(
    ([typeKey, typeLabel]) => ({
      key: typeKey,
      label: typeLabel,
    })
  );

  protected async createUIElementTemplate(): Promise<void> {
    if (this.createUIElementForm.invalid) {
      return;
    }

    const createdUIETemplate = await this.uiElementTemplatesStore.add({
      ...this.createUIElementForm.getRawValue(),
      options: {},
    });

    await this.#router.navigate(['builder', 'layout', createdUIETemplate.id]);
  }

  getFieldLabel(formControlName: keyof CreateUIElementForm): string {
    const controlLabel = capitalize(formControlName);
    const formControl = this.createUIElementForm.controls[formControlName];
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
    if (!this.createUIElementForm.invalid) {
      return '';
    }

    const errorForAllFieldsMessages: string[] = [];
    for (const [formControlKey, formControl] of Object.entries(this.createUIElementForm.controls)) {
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
