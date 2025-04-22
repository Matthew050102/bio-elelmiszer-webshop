import { Component, EventEmitter, Input, Output, inject, model } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileFormDialog } from '../../models/profile-form-dialog';

@Component({
  selector: 'app-profile-form',
  imports: [MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss'
})

export class ProfileFormComponent {
  @Input() initialData: any;
  @Output() profileUpdated = new EventEmitter<any>();

  profileForm: FormGroup;
  dialogRef = inject(MatDialogRef<ProfileFormComponent>);
  data = inject<ProfileFormDialog>(MAT_DIALOG_DATA);

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      surname: ['', Validators.required],
      firstname: ['', Validators.required],
      /*
      TODO: További adatok szerkeszthetők legyenek

      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]] 
      ...
      */
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.profileForm.patchValue(this.initialData);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.profileUpdated.emit(this.profileForm.value);
      this.dialogRef.close(this.profileForm.value);
    }
    
  }

}
