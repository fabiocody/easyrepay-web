import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, Validators} from '@angular/forms';
import {InfoDialogComponent, InfoDialogData} from '../info-dialog/info-dialog.component';
import {ApiService} from '../../services/api.service';
import {TransactionType} from '../../../../../src/model/transaction-type';
import {TransactionDto} from '../../../../../src/model/dto/transaction.dto';
import {SubSink} from 'subsink';
import * as moment from 'moment';

export interface TransactionDialogData {
    transaction: TransactionDto;
    personId: number;
}

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit, OnDestroy {
    public saving = false;
    public deleting = false;
    public error: string | null = null;
    public readonly TRANSACTION_TYPES = Object.values(TransactionType);
    private subs = new SubSink();
    public timeSlots: string[] = [];

    public form = this.fb.group({
        type: ['', Validators.required],
        amount: [null, Validators.required],
        description: ['', Validators.required],
        completed: [false, Validators.required],
        date: [moment().startOf('day').toDate(), Validators.required],
        time: [TransactionComponent.roundTime(new Date().toTimeString().slice(0, 5)), Validators.required],
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<TransactionComponent>,
        private fb: FormBuilder,
        private apiService: ApiService,
    ) {
        this.createTimeSlots();
    }

    private static roundTime(time: string): string {
        const hours = time.split(':')[0];
        let minutes = parseInt(time.split(':')[1], 10);
        minutes -= minutes % 15;
        return hours + ':' + (minutes === 0 ? '00' : minutes);
    }

    ngOnInit(): void {
        if (this.data.transaction) {
            const date = moment(this.data.transaction.date);
            this.form.get('type')!.setValue(this.data.transaction.type);
            this.form.get('amount')!.setValue(this.data.transaction.amount);
            this.form.get('description')!.setValue(this.data.transaction.description);
            this.form.get('completed')!.setValue(this.data.transaction.completed);
            this.form.get('date')!.setValue(date.startOf('minute').toDate());
            this.form.get('time')!.setValue(TransactionComponent.roundTime(date.toDate().toTimeString().slice(0, 5)));
        }
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public saveTransaction(): void {
        this.saving = true;
        const hours = parseInt(this.form.get('time')!.value.split(':')[0], 10);
        const minutes = parseInt(this.form.get('time')!.value.split(':')[1], 10);
        const date: Date = this.form.get('date')!.value;
        date.setHours(hours, minutes);
        const transaction: TransactionDto = {
            id: this.data.transaction ? this.data.transaction.id : -1,
            type: this.form.get('type')!.value,
            amount: this.form.get('amount')!.value,
            description: this.form.get('description')!.value,
            completed: this.form.get('completed')!.value,
            date,
            personId: this.data.personId,
        };
        this.apiService.saveTransaction(transaction).then(_ => {
            this.saving = false;
            this.dialogRef.close(true);
        }).catch(error => {
            console.error(error);
            this.saving = false;
            this.error = 'ERROR_GENERIC';
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
                this.apiService.deleteTransaction(this.data.personId, this.data.transaction.id).then(_ => {
                    this.deleting = false;
                    this.dialogRef.close(true);
                }).catch(error => {
                    console.error(error);
                    this.error = 'ERROR_GENERIC';
                });
            }
        });
    }

    private createTimeSlots(): void {
        this.timeSlots = [];
        for (let i = 0; i < 24; i++) {
            const hour = ('0' + i).slice(-2);
            const slots = [hour + ':00', hour + ':15', hour + ':30', hour + ':45'];
            this.timeSlots.push(...slots);
        }
    }
}
