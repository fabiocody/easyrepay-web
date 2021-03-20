import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Transaction, TransactionType} from '../../model/transaction';
import {FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';
import {InfoDialogComponent, InfoDialogData} from '../info-dialog/info-dialog.component';
import {ApiService} from '../../services/api.service';

export interface TransactionDialogData {
  transaction: Transaction;
  personId: number;
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  public saving = false;
  public deleting = false;
  public error: string | null = null;
  public readonly TRANSACTION_TYPES = Object.values(TransactionType);

  public form = this.fb.group({
    type: ['', Validators.required],
    amount: [null, Validators.required],
    description: ['', Validators.required],
    completed: [false, Validators.required],
    dateTime: [moment().toDate(), Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TransactionComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    if (this.data.transaction) {
      console.log('DATA PRESENT');
      this.form.get('type')!.setValue(this.data.transaction.type);
      this.form.get('amount')!.setValue(this.data.transaction.amount);
      this.form.get('description')!.setValue(this.data.transaction.description);
      this.form.get('completed')!.setValue(this.data.transaction.completed);
      this.form.get('dateTime')!.setValue(this.data.transaction.dateTime);
    }
  }

  public saveTransaction(): void {
    console.log('saveTransaction');
    this.saving = true;
    const transaction: Transaction = {
      id: this.data.transaction ? this.data.transaction.id : -1,
      type: this.form.get('type')!.value,
      amount: this.form.get('amount')!.value,
      description: this.form.get('description')!.value,
      completed: this.form.get('completed')!.value,
      dateTime: this.form.get('dateTime')!.value,
      person: this.data.personId,
    };
    console.log(transaction);
    this.apiService.saveTransaction(transaction).subscribe(_ => {
      this.saving = false;
      this.dialogRef.close(true);
    }, error => {
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
    this.dialog.open(InfoDialogComponent, {
      data: dialogData,
      autoFocus: false,
    }).afterClosed().subscribe(value => {
      if (value) {
        this.deleting = true;
        this.apiService.deleteTransaction(this.data.personId, this.data.transaction.id).subscribe(_ => {
          this.deleting = false;
          this.dialogRef.close(true);
        }, error => {
          console.error(error);
          this.error = 'ERROR_GENERIC';
        });
      }
    });
  }
}
