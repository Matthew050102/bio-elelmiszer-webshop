import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/AuthGuard/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, MatProgressSpinnerModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  /*
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  */

  registerForm: FormGroup;
  authService: AuthService;
  router: Router;
  snackBar: MatSnackBar = inject(MatSnackBar);

  isLoading = false;
  showForm = true;

  constructor(fb: FormBuilder, authService: AuthService, router: Router) {
    this.registerForm = fb.group({
      surname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
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

  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    /*
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    */
    const { surname, firstname, password, confirmPassword, email, phone } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.openSnackBar('A két jelszó nem egyezik meg!');
      return;
    }

    this.isLoading = true;
    this.showForm = false;

    this.authService.register(surname, firstname, password, email, phone);
    if (this.snackBar) {
      this.closeSnackBar();
    }

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 2000);
  }
}
