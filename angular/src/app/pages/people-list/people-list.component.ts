import {Component, OnInit} from '@angular/core';
import {PersonDetailDto} from '../../../../../src/model/dto/person-detail.dto';
import {ApiService} from '../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {AddPersonComponent} from '../../dialogs/add-person/add-person.component';

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
    public people: PersonDetailDto[] = [];
    public loading = false;

    constructor(
        private apiService: ApiService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.updatePeople();
    }

    private updatePeople(): void {
        this.apiService.getPeople().subscribe(people => {
            this.people = people;
            this.loading = false;
        });
    }

    public addPerson(): void {
        this.dialog.open(AddPersonComponent, {
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.updatePeople();
            }
        });
    }
}
