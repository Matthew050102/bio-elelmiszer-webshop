import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  snackBar: MatSnackBar = inject(MatSnackBar);
  authSubscription?: Subscription;

  constructor(fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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

      this.authService.login(email, password)
      .then(() => {
        this.router.navigateByUrl('/');
      })
      .catch((error) => {
        this.openSnackBar('Hibás bejelentkezési adatok!');
      });

    }
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}
