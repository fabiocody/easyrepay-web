import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TransactionDto} from '../../../../../src/model/dto/transaction.dto';

export interface TransactionDialogData {
    transaction: TransactionDto | null;
    personId: number;
}

@Component({
    selector: 'app-transaction-dialog',
    templateUrl: './transaction-dialog.component.html',
    styleUrls: ['./transaction-dialog.component.scss'],
})
export class TransactionDialogComponent implements OnInit {
    public error: string | null = null;

    constructor(@Inject(MAT_DIALOG_DATA) public data: TransactionDialogData) {}

    ngOnInit(): void {}
}
