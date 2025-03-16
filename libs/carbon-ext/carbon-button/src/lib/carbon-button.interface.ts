import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

export const ZodButtonTypeConfig = z.enum([
  'primary',
  'secondary',
  'tertiary',
  'ghost',
  'danger',
  'danger--primary',
  'danger--tertiary',
  'danger--ghost',
]);
export type ButtonTypeConfig = z.input<typeof ZodButtonTypeConfig>;

export const ZodButtonFilesSelectorConfig = z.strictObject({
  enabled: z.boolean().default(true),
  single: z.boolean().optional(),
  acceptedExtensions: z.array(z.string()).optional(),
});
export type ButtonFilesSelectorConfig = z.input<typeof ZodButtonFilesSelectorConfig>;

export const ZodCarbonButtonUIElementComponentConfigs = z.strictObject({
  text: z.string(),
  type: ZodButtonTypeConfig,
  filesSelector: ZodButtonFilesSelectorConfig,
});

export type CarbonButtonUIElementComponentConfigs = z.input<
  typeof ZodCarbonButtonUIElementComponentConfigs
>;

export type CarbonButtonUIElementComponentEvents = {
  buttonClicked: void;
  filesSelected: {
    files: FileList;
  };
};

export const ZCarbonButtonForJsonSchema = createUIElementTemplateSchema(
  ZodCarbonButtonUIElementComponentConfigs,
  ['buttonClicked', 'filesSelected']
);

export type CarbonButtonTypeForJsonSchema = z.infer<typeof ZCarbonButtonForJsonSchema>;
