import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from '../../services/profile/profile.service';
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'app-profile',
  imports: [MatCard, MatCardContent, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',

})

export class ProfileComponent {
  dialog = inject(MatDialog);
  currentUserData: UserModel | null = null;

  selectedColor: 'empty' | 'green' = 'empty';

  constructor(private auth: AuthService, private profileService: ProfileService) {
    this.getProfileData();
  }

  getProfileData() {
    this.profileService.getUserProfileData().then((user) => {
      if (user) {
        this.currentUserData = user;
      }
    });
  }
}
