import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {TransactionDto} from '../../../../../src/model/dto/transaction.dto';
import {TransactionType} from '../../../../../src/model/common/transaction-type';
import {FormBuilder, Validators} from '@angular/forms';
import {SubSink} from 'subsink';
import * as moment from 'moment';

@Component({
    selector: 'app-transaction-form',
    templateUrl: './transaction-form.component.html',
    styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit, OnDestroy, OnChanges {
    public readonly TRANSACTION_TYPES = Object.values(TransactionType);
    @Input() public transaction: TransactionDto | null = null;
    @Output() public transactionChange = new EventEmitter<TransactionDto | null>();
    @Input() public personId = -1;
    @Input() public error: string | null = null;
    public timeSlots: string[] = [];
    private initialized = false;
    private subs = new SubSink();

    public form = this.fb.group({
        type: ['', Validators.required],
        amount: [null, Validators.required],
        description: ['', Validators.required],
        completed: [false, Validators.required],
        date: [moment().startOf('day').toDate(), Validators.required],
        time: [TransactionFormComponent.roundTime(new Date().toTimeString().slice(0, 5)), Validators.required],
    });

    constructor(private fb: FormBuilder) {
        this.createTimeSlots();
    }

    private static roundTime(time: string): string {
        const hours = time.split(':')[0];
        let minutes = parseInt(time.split(':')[1], 10);
        minutes -= minutes % 15;
        return hours + ':' + (minutes === 0 ? '00' : minutes);
    }

    ngOnInit(): void {
        this.form.valueChanges.subscribe(val => {
            const hours = parseInt(val.time.split(':')[0], 10);
            const minutes = parseInt(val.time.split(':')[1], 10);
            const date: Date = val.date;
            date.setHours(hours, minutes);
            const transaction: TransactionDto = {
                id: this.transaction ? this.transaction.id : -1,
                type: val.type,
                amount: val.amount,
                description: val.description,
                completed: val.completed,
                date,
                personId: this.personId,
            };
            this.transactionChange.emit(transaction);
        });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ngOnChanges(changes: SimpleChanges): void {
        if (!this.initialized && this.transaction) {
            const date = moment(this.transaction.date);
            this.form.get('type')!.setValue(this.transaction.type);
            this.form.get('amount')!.setValue(this.transaction.amount);
            this.form.get('description')!.setValue(this.transaction.description);
            this.form.get('completed')!.setValue(this.transaction.completed);
            this.form.get('date')!.setValue(date.startOf('minute').toDate());
            this.form
                .get('time')!
                .setValue(TransactionFormComponent.roundTime(date.toDate().toTimeString().slice(0, 5)));
            this.initialized = true;
        }
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
