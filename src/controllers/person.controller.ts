import {Request, Response} from 'express';
import {UserEntity} from '../model/user.entity';
import {PersonService} from '../services/person.service';
import {PersonDto} from '../model/dto/person.dto';
import {PersonDetailDto} from '../model/dto/person-detail.dto';
import {validateOrReject, ValidationError} from 'class-validator';

export class PersonController {
    public static async getPeople(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as UserEntity;
            const people = await PersonService.getByUserId(user.id);
            const details = (await Promise.all(people.map(async p => await PersonService.getPersonDetailDto(p))))
                .map(d => new PersonDetailDto(d));
            res.send(details);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    public static async savePerson(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as UserEntity;
            const person = new PersonDto(req.body);
            await validateOrReject(person);
            await PersonService.save(person, user.id);
            res.send();
        } catch (e) {
            console.error(e);
            res.sendStatus((e instanceof ValidationError || e[0] instanceof ValidationError) ? 400 : 500);
        }
    }

    public static async getPerson(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            const person = new PersonDto(await PersonService.get(personId));
            res.send(person);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    public static async deletePerson(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            await PersonService.delete(personId);
            res.send();
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
}
