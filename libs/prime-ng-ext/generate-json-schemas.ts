import '@angular/compiler';

import * as fs from 'fs';
import { ZodType } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { ZSimpleImageUIESchema } from './simple-image/src/lib/simple-image.interface';
import { ZSimpleTableUIESchema } from './simple-table/src/lib/simple-table.interface';
import { ZSimpleTextUIESchema } from './simple-text/src/lib/simple-text.interface';

const generateJSONSchemaFromZodTypes = (zodTypes: ZodType[]): void => {
  for (const zt of zodTypes) {
    const jsonSchema = zodToJsonSchema(zt);
    const outFolder = `./generated-json-schemas`;
    const outFile = `${outFolder}/${zt.description ?? 'NoDescription'}.json`;
    if (!fs.existsSync(outFolder)) {
      fs.mkdirSync(outFolder);
    }
    fs.writeFileSync(outFile, JSON.stringify(jsonSchema, null, 2));
  }
};

generateJSONSchemaFromZodTypes([
  ZSimpleTextUIESchema,
  ZSimpleImageUIESchema,
  ZSimpleTableUIESchema,
]);
