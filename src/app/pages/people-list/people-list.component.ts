import { Component, OnInit } from '@angular/core';
import {Person} from '../../model/person';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  public people: Person[] = [];

  constructor(
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.apiService.getPeople().subscribe(people => {
      this.people = people;
    });
  }
}
