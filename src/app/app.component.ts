import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Opcional, se gerou com rotas
import { LandingComponent } from './landing/landing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LandingComponent],
  template: `<app-landing></app-landing>`, 
  styles: [] 
})
export class AppComponent {
  title = 'save-the-date';
}