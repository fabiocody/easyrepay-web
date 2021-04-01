import {Request, Response} from 'express';
import {UserEntity} from '../model/user.entity';
import {PersonService} from '../services/person.service';
import {PersonDto} from '../model/dto/person.dto';

export class PersonController {
    public static async getPeople(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as UserEntity;
            const people = await PersonService.getByUserId(user.id);
            const details = await Promise.all(people.map(async p => await PersonService.getPersonDetailDto(p)));
            res.send(details);
        } catch {
            res.sendStatus(500);
        }
    }

    public static async savePerson(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as UserEntity;
            const person = req.body as PersonDto;
            await PersonService.save(person, user.id);
            res.send();
        } catch {
            res.sendStatus(500);
        }
    }

    public static async getPerson(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            const person = await PersonService.get(personId);
            res.send(person);
        } catch {
            res.sendStatus(500);
        }
    }

    public static async deletePerson(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            await PersonService.delete(personId);
            res.send();
        } catch {
            res.sendStatus(500);
        }
    }
}
