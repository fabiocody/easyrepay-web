import {UserEntity} from '../model/user.entity';
import {PersonService} from '../services/person.service';
import {PersonDto} from '../model/dto/person.dto';
import {PersonDetailDto} from '../model/dto/person-detail.dto';
import {Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post} from 'routing-controllers';

@JsonController()
export class PersonController {
    @Authorized()
    @Get('/people')
    public async getPeople(@CurrentUser() user: UserEntity): Promise<PersonDetailDto[]> {
        const people = await PersonService.getByUserId(user.id);
        return Promise.all(people.map(async p => await PersonService.getPersonDetailDto(p)));
    }

    @Authorized()
    @Post('/people')
    public async savePerson(@CurrentUser() user: UserEntity, @Body() person: PersonDto): Promise<void> {
        await PersonService.save(person, user.id);
    }

    @Authorized()
    @Get('/person/:id')
    public async getPerson(@Param('id') personId: number): Promise<PersonDto> {
        return new PersonDto(await PersonService.get(personId));
    }

    @Authorized()
    @Delete('/person/:id')
    public async deletePerson(@Param('id') personId: number): Promise<void> {
        await PersonService.delete(personId);
    }
}
