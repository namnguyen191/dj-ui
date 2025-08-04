import '@angular/compiler';

import * as fs from 'fs';
import { z } from 'zod';

import {
  ZAppEditCardUIESchema,
  ZAppEditImagesCarouselUIESchema,
  ZAppEditRemoteResourceSchema,
  ZAppEditSimpleGridUIESchema,
  ZAppEditSimpleImageUIESchema,
  ZAppEditSimpleTableUIESchema,
  ZAppEditSimpleTextUIESchema,
} from './src/lib/app-template';

const generateJSONSchemaFromZodTypes = (zodTypes: z.ZodType[]): void => {
  for (const zt of zodTypes) {
    const jsonSchema = z.toJSONSchema(zt);
    const outFolder = `./generated-json-schemas`;
    const outFile = `${outFolder}/${zt.description ?? 'NoDescription'}.json`;
    if (!fs.existsSync(outFolder)) {
      fs.mkdirSync(outFolder);
    }
    fs.writeFileSync(outFile, JSON.stringify(jsonSchema, null, 2));
  }
};

generateJSONSchemaFromZodTypes([
  ZAppEditSimpleTableUIESchema,
  ZAppEditSimpleTextUIESchema,
  ZAppEditSimpleImageUIESchema,
  ZAppEditSimpleGridUIESchema,
  ZAppEditImagesCarouselUIESchema,
  ZAppEditCardUIESchema,
  ZAppEditRemoteResourceSchema,
]);
