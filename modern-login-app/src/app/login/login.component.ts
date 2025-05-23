import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; // Import NgIf

@Component({
  selector: 'app-login',
  standalone: true, // Assuming standalone based on Angular 19 defaults
  imports: [ReactiveFormsModule, NgIf], // Add NgIf here
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login form data:', this.loginForm.value);
      // Here you would typically call an authentication service
    } else {
      console.log('Login form is invalid');
      // Mark fields as touched to show errors
      this.loginForm.markAllAsTouched();
    }
  }
}
