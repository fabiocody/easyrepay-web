import {Component, Input, OnInit} from '@angular/core';
import {TransactionDto} from '../../../../../src/model/dto/transaction.dto';
import {TransactionType} from '../../../../../src/model/transaction-type';
import * as moment from 'moment';

@Component({
    selector: 'app-transaction-card',
    templateUrl: './transaction-card.component.html',
    styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit {
    @Input() public transaction: TransactionDto = {
        id: 0,
        type: TransactionType.CREDIT,
        amount: 0,
        description: '',
        completed: false,
        date: moment().toDate(),
        personId: 0,
    };

    constructor() {
    }

    ngOnInit(): void {
    }

    public get signedAmount(): number {
        return [TransactionType.CREDIT, TransactionType.SETTLE_DEBT].includes(this.transaction.type) ?
            this.transaction.amount : -this.transaction.amount;
    }
}
