import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleGridLayoutComponent } from './simple-grid-layout.component';

describe('SimpleGridLayoutComponent', () => {
  let component: SimpleGridLayoutComponent;
  let fixture: ComponentFixture<SimpleGridLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleGridLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleGridLayoutComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('layoutId', 'layout-123');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
