import {Component, OnDestroy, OnInit} from '@angular/core';
import {PersonDetailDto} from '../../../../src/model/dto/person-detail.dto';
import {PeopleService} from './people.service';
import {AddPersonComponent} from './add-person/add-person.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit, OnDestroy {
    public people: PersonDetailDto[] = [];
    public loading = false;
    private subs = new SubSink();

    constructor(private peopleService: PeopleService, private dialog: MatDialog, private router: Router) {}

    ngOnInit(): void {
        this.loading = true;
        this.updatePeople();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    private updatePeople(): void {
        this.peopleService
            .getPeople()
            .then(people => (this.people = people))
            .catch(error => console.error(error))
            .finally(() => (this.loading = false));
    }

    public addPerson(): void {
        this.subs.sink = this.dialog
            .open(AddPersonComponent, {
                autoFocus: false,
            })
            .afterClosed()
            .subscribe(value => {
                if (value) {
                    this.updatePeople();
                }
            });
    }

    public openPerson(person: PersonDetailDto): void {
        this.router.navigate(['/transactions'], {state: {person}}).then();
    }
}
