import {Component, Input} from '@angular/core';
import {PersonDetailDto} from '../../../../../src/model/dto/person-detail.dto';

@Component({
    selector: 'app-person-card',
    templateUrl: './person-card.component.html',
    styleUrls: ['./person-card.component.scss'],
})
export class PersonCardComponent {
    @Input() public person: PersonDetailDto = {
        id: 0,
        name: '',
        count: 0,
        total: 0,
    };
}
