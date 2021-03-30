import {db} from '../config/db';
import {PersonEntity} from "../model/person.entity";
import {PersonDetailDto} from "../model/dto/person-detail.dto";
import {TransactionService} from "./transaction.service";

export class PersonService {
    public static async getByUserId(userId: number): Promise<PersonEntity[]> {
        return db('person').where('userId', userId);
    }

    public static async getPersonDetailDto(person: PersonEntity): Promise<PersonDetailDto> {
        const transactions = await TransactionService.getTransactions(person.id);
        const personDetail = new PersonDetailDto();
        personDetail.id = person.id;
        personDetail.name = person.name;
        personDetail.count = transactions.length;
        personDetail.total = transactions
            .map(t => TransactionService.getSignedAmount(t))
            .reduce((acc, val) => acc + val, 0);
        return personDetail;
    }
}
