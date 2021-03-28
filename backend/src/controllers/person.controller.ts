import {Request, Response} from "express";
import {UserEntity} from "../model/user.entity";
import {PersonService} from "../services/person.service";
import {PersonDto} from "../../../common/dto/person.dto";

export class PersonController {
    public static getPeople(req: Request, res: Response): void {
        const user = req.user as UserEntity;
        PersonService.getByUserId(user.id)
            .then(people => res.send(people.map(p => p as PersonDto)));
    }

    public static addPerson(req: Request, res: Response): void {
        res.send();
    }

    public static getPerson(req: Request, res: Response): void {
        res.send();
    }

    public static updatePerson(req: Request, res: Response): void {
        res.send();
    }

    public static deletePerson(req: Request, res: Response): void {
        res.send();
    }
}
