import {Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output} from '@angular/core';
import {TransactionDto} from '../../../../../src/model/dto/transaction.dto';
import {TransactionsService} from '../transactions.service';
import {TransactionDialogComponent} from '../transaction-dialog/transaction-dialog.component';
import {InfoDialogComponent, InfoDialogData} from '../../utils/info-dialog/info-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Location} from '@angular/common';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-transaction-form-buttons',
    templateUrl: './transaction-form-buttons.component.html',
    styleUrls: ['./transaction-form-buttons.component.scss']
})
export class TransactionFormButtonsComponent implements OnInit, OnDestroy {
    @Input() public transaction: TransactionDto | null = null;
    @Input() public formValid = true;
    @Output() public transactionError = new EventEmitter<string>();
    @Input() public showDelete = false;
    public saving = false;
    public deleting = false;
    private subs = new SubSink();

    constructor(
        private dialog: MatDialog,
        private location: Location,
        private transactionsService: TransactionsService,
        @Optional() private dialogRef?: MatDialogRef<TransactionDialogComponent>,
    ) {}

    ngOnInit(): void {
    }


    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public cancel(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        } else {
            this.location.back();
        }
    }

    public saveTransaction(): void {
        this.saving = true;
        this.transactionsService.saveTransaction(this.transaction!).then(_ => {
            this.saving = false;
            if (this.dialogRef) {
                this.dialogRef.close(true);
            } else {
                this.location.back();
            }
        }).catch(error => {
            console.error(error);
            this.saving = false;
            this.transactionError.emit('ERROR_GENERIC');
        });
    }

    public deleteTransaction(): void {
        const dialogData: InfoDialogData = {
            title: 'DELETE_TRANSACTION_TITLE',
            body: 'DELETE_TRANSACTION_BODY',
            okBtnText: 'DELETE',
            cancelBtnText: 'CANCEL',
            okBtnColor: 'warn'
        };
        this.subs.sink = this.dialog.open(InfoDialogComponent, {
            data: dialogData,
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.deleting = true;
                this.transactionsService.deleteTransaction(this.transaction!.personId, this.transaction!.id).then(_ => {
                    this.deleting = false;
                    if (this.dialogRef) {
                        this.dialogRef.close(true);
                    } else {
                        this.location.back();
                    }
                }).catch(error => {
                    console.error(error);
                    this.transactionError.emit('ERROR_GENERIC');
                });
            }
        });
    }
}
