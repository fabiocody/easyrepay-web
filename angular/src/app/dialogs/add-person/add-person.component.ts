import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../services/api.service';
import {AddPersonDto} from '../../../../../src/model/dto/add-person.dto';
import {PersonDetailDto} from '../../../../../src/model/dto/person-detail.dto';

@Component({
    selector: 'app-add-person',
    templateUrl: './add-person.component.html',
    styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {
    public nameForm = this.fb.control('', Validators.required);
    public loading = false;
    public error: string | null = null;
    private edit = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public person: PersonDetailDto,
        private dialogRef: MatDialogRef<AddPersonComponent>,
        private fb: FormBuilder,
        private apiService: ApiService,
    ) {}

    ngOnInit(): void {
        if (this.person) {
            this.nameForm.setValue(this.person.name);
            this.edit = true;
        }
    }

    public addPerson(): void {
        this.loading = true;
        this.error = null;
        const personDto: AddPersonDto = {
            name: this.nameForm.value
        };
        const result = this.edit ? this.apiService.editPerson(this.person.id, personDto) : this.apiService.addPerson(personDto);
        result.subscribe(_ => {
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
