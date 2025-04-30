import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { setupDefault } from '@dj-ui/common';

@Component({
  selector: 'prime-ng-playground-builder-feat-builder',
  imports: [RouterModule],
  templateUrl: './builder.component.html',
})
export class BuilderComponent {
  constructor() {
    setupDefault();
  }
}
