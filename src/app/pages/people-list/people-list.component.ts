import { Component, OnInit } from '@angular/core';
import {PersonDto} from '../../model/dto/person-dto';
import {ApiService} from '../../services/api.service';
import {MatDialog} from '@angular/material/dialog';
import {AddPersonComponent} from '../../dialogs/add-person/add-person.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  public people: PersonDto[] = [];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.updatePeople();
  }

  private updatePeople(): void {
    this.apiService.getPeople().subscribe(people => {
      this.people = people;
    });
  }

  public addPerson(): void {
    console.log('add person');
    this.dialog.open(AddPersonComponent).afterClosed().subscribe(value => {
      if (value) {
        this.updatePeople();
      }
    });
  }

  public selectPerson(person: PersonDto): void {
    console.log(person);
  }
}
