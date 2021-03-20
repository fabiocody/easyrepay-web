import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Transaction} from '../../model/transaction';
import {FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  public loading = false;
  public error: string | null = null;

  public form = this.fb.group({
    type: ['', Validators.required],
    amount: [null, Validators.required],
    description: [''],
    completed: [false, Validators.required],
    dateTime: [moment(), Validators.required],
  });

  public readonly TRANSACTION_TYPES = [
    {label: 'CREDIT', value: 'C'},
    {label: 'DEBT', value: 'D'},
    {label: 'SETTLE_CREDIT', value: 'SC'},
    {label: 'SETTLE_DEBT', value: 'SD'},
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public transaction: Transaction,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    // TODO: Initialize form with values from transaction
  }

  public saveTransaction(): void {
    console.log('saveTransaction');
  }
}
