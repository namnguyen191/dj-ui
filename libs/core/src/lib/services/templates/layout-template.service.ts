import { Injectable } from '@angular/core';

import { BaseTemplateService, type MissingTemplateEvent } from './base-template.service';
import type { LayoutTemplate } from './layout-template-interfaces';

@Injectable({
  providedIn: 'root',
})
export class LayoutTemplateService extends BaseTemplateService<LayoutTemplate> {
  protected override missingTemplateEvent: MissingTemplateEvent = 'MISSING_LAYOUT_TEMPLATE';
}
