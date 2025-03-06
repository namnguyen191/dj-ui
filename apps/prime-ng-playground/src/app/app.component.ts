import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { setupDefault } from '@dj-ui/common';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    setupDefault();
  }
}
