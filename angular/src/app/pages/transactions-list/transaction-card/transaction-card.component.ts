import {Component, Input, OnInit} from '@angular/core';
import {Transaction, TransactionType} from '../../../model/transaction';
import * as moment from 'moment';

@Component({
    selector: 'app-transaction-card',
    templateUrl: './transaction-card.component.html',
    styleUrls: ['./transaction-card.component.scss']
})
export class TransactionCardComponent implements OnInit {
    @Input() public transaction: Transaction = {
        id: 0,
        type: TransactionType.CREDIT,
        amount: 0,
        description: '',
        completed: false,
        dateTime: moment().toDate(),
        person: 0,
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
