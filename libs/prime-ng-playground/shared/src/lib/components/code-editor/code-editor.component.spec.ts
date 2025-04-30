import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorComponent, type CodeEditorConfigs } from './code-editor.component';

describe('CodeEditorComponent', () => {
  let component: CodeEditorComponent;
  let fixture: ComponentFixture<CodeEditorComponent>;

  const mockEditorConfigs: CodeEditorConfigs = {
    language: 'typescript',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeEditorComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('configs', mockEditorConfigs);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
