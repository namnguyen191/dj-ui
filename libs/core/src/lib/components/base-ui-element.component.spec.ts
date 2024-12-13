import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseUIElementComponent } from './base-ui-element.component';

@Component({
  selector: 'extend-base-test',
  imports: [],
  standalone: true,
  template: '<h1>Hello world</h1>',
})
export class ExtendBaseTestComponent extends BaseUIElementComponent {}

describe('BaseUIElementComponent', () => {
  let component: ExtendBaseTestComponent;
  let fixture: ComponentFixture<ExtendBaseTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendBaseTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtendBaseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
