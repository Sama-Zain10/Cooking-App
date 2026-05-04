import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
      },
    });
  }
}