import '@angular/compiler';

import * as fs from 'fs';
import { ZodType } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { ZCardUIESchema } from './shared/src/lib/card.interface';
import { ZImagesCarouselUIESchema } from './shared/src/lib/images-carousel.interface';
import { ZSimpleImageUIESchema } from './shared/src/lib/simple-image.interface';
import { ZSimpleTableUIESchema } from './shared/src/lib/simple-table.interface';
import { ZSimpleTextUIESchema } from './shared/src/lib/simple-text.interface';

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
  ZImagesCarouselUIESchema,
  ZCardUIESchema,
]);
