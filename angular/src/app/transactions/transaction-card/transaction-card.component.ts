import {Component, Input} from '@angular/core';
import {TransactionDto} from '../../../model/transaction.dto';
import {TransactionType} from '../../../model/transaction-type';
import * as moment from 'moment';

@Component({
    selector: 'app-transaction-card',
    templateUrl: './transaction-card.component.html',
    styleUrls: ['./transaction-card.component.scss'],
})
export class TransactionCardComponent {
    @Input() public transaction: TransactionDto = {
        id: 0,
        type: TransactionType.CREDIT,
        amount: 0,
        description: '',
        completed: false,
        date: moment().toDate(),
        personId: 0,
    };

    public get signedAmount(): number {
        return [TransactionType.CREDIT, TransactionType.SETTLE_DEBT].includes(this.transaction.type)
            ? this.transaction.amount
            : -this.transaction.amount;
    }
}
