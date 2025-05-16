import { Component, Inject } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-form',
  imports: [MatFormField, MatLabel, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ProductFormComponent>) {

    this.productForm = this.fb.group({
      id: [this.data['id']],
      name: [this.data['name'], [Validators.required]],
      category: [this.data['category'], [Validators.required]],
      price: [this.data['price'], [Validators.required]],
      description: [this.data['description'], [Validators.required]],
    });
    
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    } else {
    }
  }
  

}
