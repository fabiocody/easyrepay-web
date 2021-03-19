import { Component, OnInit } from '@angular/core';
import {Person} from '../../model/person';
import {ApiService} from '../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {AddPersonComponent} from '../../dialogs/add-person/add-person.component';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  public people: Person[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.apiService.getPeople().subscribe(people => {
      this.people = people;
    });
  }

  public addPerson(): void {
    console.log('add person');
    this.dialog.open(AddPersonComponent);
  }
}
