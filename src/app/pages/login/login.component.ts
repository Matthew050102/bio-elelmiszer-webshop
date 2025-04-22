import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/AuthGuard/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm: FormGroup;
  authService: AuthService;
  router: Router;
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor(fb: FormBuilder, authService: AuthService, router: Router) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.authService = authService;
    this.router = router;
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, "Mégse");
  }

  closeSnackBar(): void {
    this.snackBar.dismiss();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.authService.login(email, password)) {
        if (this.snackBar) {
          this.closeSnackBar();
        }
        this.router.navigateByUrl("/");
      } else {
        this.openSnackBar("Hibás adatok!");
      }
    }
  }
}
