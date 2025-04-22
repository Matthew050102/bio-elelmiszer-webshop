import { Component, inject, model, signal } from '@angular/core';
import { AuthService } from '../../services/AuthGuard/auth.service';
import { User } from '../../models/user';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ProfileFormComponent } from '../../forms/profile-form/profile-form.component';

@Component({
  selector: 'app-profile',
  imports: [MatCard, MatCardContent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',

})

export class ProfileComponent {
  dialog = inject(MatDialog);
  authService: AuthService;
  currentUser: User | null = null;

  constructor(auth: AuthService) {
    this.authService = auth;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  }

  ngOnInit() {
    
  }

  onProfileUpdate(updatedData: any): void {
    this.currentUser = { ...this.currentUser, ...updatedData };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.authService.refresh();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfileFormComponent, {
      data: { surname: this.currentUser?.surname, firstname: this.currentUser?.firstname },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onProfileUpdate(result);
      }
    });
  }

}
