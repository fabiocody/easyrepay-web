import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {PersonDetailDto} from '../model/dto/person-detail.dto';
import {PersonService} from './person.service';
import {PersonDto} from '../model/dto/person.dto';

@Controller('people')
export class PersonController {
    constructor(private personService: PersonService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    public async getPeople(@Req() req): Promise<PersonDetailDto[]> {
        const people = await this.personService.getByUserId(req.user);
        const detailPromises = people.map(async p => this.personService.getPersonDetailDto(p));
        return Promise.all(detailPromises);
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    public async savePerson(@Req() req, @Body() person: PersonDto): Promise<void> {
        await this.personService.save(person, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    public async getPerson(@Req() req, @Param('id') id: number): Promise<PersonDto> {
        await this.personService.checkUser(id, req.user);
        const person = await this.personService.get(id);
        return person.toDto();
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    public async deletePerson(@Req() req, @Param('id') id: number): Promise<void> {
        await this.personService.checkUser(id, req.user);
        return this.personService.delete(id);
    }
}
