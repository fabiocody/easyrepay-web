import {Request, Response} from "express";
import {UserEntity} from "../model/user.entity";
import {PersonService} from "../services/person.service";

export class PersonController {
    public static async getPeople(req: Request, res: Response): Promise<void> {
        const user = req.user as UserEntity;
        const people = await PersonService.getByUserId(user.id);
        const details = await Promise.all(people.map(async p => await PersonService.getPersonDetailDto(p)));
        res.send(details);
    }

    public static addPerson(req: Request, res: Response): void {
        console.log(req.body)
        res.send();
    }

    public static getPerson(req: Request, res: Response): void {
        console.log(req.params)
        res.send();
    }

    public static updatePerson(req: Request, res: Response): void {
        console.log(req.params, req.body)
        res.send();
    }

    public static deletePerson(req: Request, res: Response): void {
        console.log(req.params)
        res.send();
    }
}
