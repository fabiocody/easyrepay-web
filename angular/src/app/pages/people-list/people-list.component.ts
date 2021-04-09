import {Component, OnDestroy, OnInit} from '@angular/core';
import {PersonDetailDto} from '../../../../../src/model/dto/person-detail.dto';
import {ApiService} from '../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {AddPersonComponent} from '../../dialogs/add-person/add-person.component';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-people-list',
    templateUrl: './people-list.component.html',
    styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit, OnDestroy {
    public people: PersonDetailDto[] = [];
    public loading = false;
    private subs = new SubSink();

    constructor(
        private apiService: ApiService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.updatePeople();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    private updatePeople(): void {
        this.apiService.getPeople()
            .then(people => this.people = people)
            .catch(error => console.error(error))
            .finally(() => this.loading = false);
    }

    public addPerson(): void {
        this.subs.sink = this.dialog.open(AddPersonComponent, {
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.updatePeople();
            }
        });
    }
}
