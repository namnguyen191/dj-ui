import { Injectable } from '@angular/core';

import { BaseTemplateService, MissingTemplateEvent } from './base-template.service';
import { LayoutTemplate } from './layout-template-interfaces';

@Injectable({
  providedIn: 'root',
})
export class LayoutTemplateService extends BaseTemplateService<LayoutTemplate> {
  protected override missingTemplateEvent: MissingTemplateEvent = 'MISSING_LAYOUT_TEMPLATE';
}
