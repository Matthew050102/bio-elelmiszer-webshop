import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, MatProgressSpinnerModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  registerForm: FormGroup;
  snackBar: MatSnackBar = inject(MatSnackBar);

  isLoading = false;
  showForm = true;

  constructor(fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = fb.group({
      surname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      isAdmin: [false]
    });
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, "Mégse");
  }

  closeSnackBar(): void {
    this.snackBar.dismiss();
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const { surname, firstname, password, confirmPassword, email, phone, isAdmin } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.openSnackBar('A két jelszó nem egyezik meg!');
      return;
    }
    this.authService.register(surname, firstname, password, email, phone, isAdmin)
      .then(() => {
        this.isLoading = true;
        this.showForm = false;

        if (this.snackBar) {
          this.closeSnackBar();
        }

      })
      .catch((error) => {
        this.openSnackBar('Hiba történt a regisztráció során!');
        return;
      });
  }
}
