import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProductModel } from '../../../models/product-model';

@Component({
  selector: 'app-basic-dialog',
  imports: [MatButtonModule],
  templateUrl: './basic-dialog.component.html',
  styleUrl: './basic-dialog.component.scss'
})
export class BasicDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<BasicDialogComponent>) { 

    }

  onSumbit() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close();
  }

}
