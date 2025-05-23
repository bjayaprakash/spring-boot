import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Import LoginComponent

@Component({
  selector: 'app-root',
  standalone: true, // Ensure AppComponent is also standalone
  imports: [RouterOutlet, LoginComponent], // Add LoginComponent here
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'modern-login-app';
}
