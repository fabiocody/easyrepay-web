import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../services/api.service';
import {AddPersonDto} from '../../model/dto/add-person-dto';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {
  public nameForm = this.fb.control('', Validators.required);
  public loading = false;
  public error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddPersonComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
  }

  public addPerson(): void {
    this.loading = true;
    this.error = null;
    const personDto: AddPersonDto = {
      name: this.nameForm.value
    };
    this.apiService.addPerson(personDto).subscribe(_ => {
      this.loading = false;
      this.dialogRef.close(true);
    }, error => {
      console.error(error);
      this.loading = false;
      if (error.status === 409) {
        this.error = 'ERROR_NAME_ALREADY_PRESENT';
      } else {
        this.error = 'ERROR_GENERIC';
      }
    });
  }
}
