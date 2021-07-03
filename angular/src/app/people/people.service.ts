import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PersonDetailDto} from '../../../../src/model/dto/person-detail.dto';
import {PersonDto} from '../../../../src/model/dto/person.dto';

@Injectable()
export class PeopleService {
    constructor(
        private http: HttpClient,
    ) {}

    public getPeople(): Promise<PersonDetailDto[]> {
        return this.http.get<PersonDetailDto[]>('/api/people').toPromise();
    }

    public savePerson(personDto: PersonDto): Promise<object> {
        return this.http.post('/api/people', personDto).toPromise();
    }

    public getPerson(personId: number): Promise<PersonDetailDto> {
        return this.http.get<PersonDetailDto>(`/api/person/${personId}`).toPromise();
    }

    public deletePerson(personId: number): Promise<object> {
        return this.http.delete(`/api/person/${personId}`).toPromise();
    }
}
