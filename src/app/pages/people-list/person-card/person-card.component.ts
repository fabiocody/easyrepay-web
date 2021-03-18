import {Component, Input, OnInit} from '@angular/core';
import {Person} from '../../../model/person';

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  @Input() public person: Person;

  constructor() {
    this.person = {
      name: '',
      count: 0,
      total: 0
    };
  }

  ngOnInit(): void {
  }
}
