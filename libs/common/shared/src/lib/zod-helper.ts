import { z } from 'zod';

export const parseZodWithDefault = <T>(zodType: z.ZodType, val: unknown, defaultVal: T): T => {
  try {
    const result = zodType.parse(val) as T;
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(
        `Receiving: ${JSON.stringify(val)} which is an invalid option: ${error.message}. The default value: ${JSON.stringify(defaultVal)} will be used instead.`
      );
    } else {
      console.warn(
        `An unknown error has occured while trying to interpolate ${JSON.stringify(val)}. The default value: ${JSON.stringify(defaultVal)} will be used instead.`
      );
    }

    return defaultVal;
  }
};

export const ZodNonEmptyPrimitive = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.bigint(),
  z.symbol(),
]);

export const ZodObjectType = z.record(z.string(), z.any(), {
  error: 'must be an object with key-value',
});
