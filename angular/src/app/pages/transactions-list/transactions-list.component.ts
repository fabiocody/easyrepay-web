import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {PersonDto} from '../../model/dto/person-dto';
import {Transaction} from '../../model/transaction';
import {MatDialog} from '@angular/material/dialog';
import {AddPersonComponent} from '../../dialogs/add-person/add-person.component';
import {InfoDialogComponent, InfoDialogData} from '../../dialogs/info-dialog/info-dialog.component';
import {Location} from "@angular/common";
import {TransactionComponent} from "../../dialogs/transaction/transaction.component";

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  public person: PersonDto | null = null;
  public transactions: Transaction[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.apiService.getPerson(id).subscribe(person => {
        this.person = person;
        this.updateTransactions();
      });
    }
  }

  private updateTransactions(): void {
    this.apiService.getTransactions(this.person!.id).subscribe(transactions => this.transactions = transactions);
  }

  public navigateBack(): void {
    this.location.back();
  }

  public editPerson(): void {
    this.dialog.open(AddPersonComponent, {
      data: this.person
    }).afterClosed().subscribe(value => {
      console.log('VALUE', value);
      if (value) {
        this.apiService.getPerson(this.person!.id).subscribe(person => this.person = person);
      }
    });
  }

  public deletePerson(): void {
    const data: InfoDialogData = {
      title: 'DELETE_PERSON_TITLE',
      body: 'DELETE_PERSON_BODY',
      okBtnText: 'CONFIRM',
      cancelBtnText: 'CANCEL',
      okBtnColor: 'warn'
    };
    this.dialog.open(InfoDialogComponent, {
      data
    }).afterClosed().subscribe(value => {
      if (value) {
        this.apiService.deletePerson(this.person!.id).subscribe(_ => this.navigateBack());
      }
    });
  }

  public openTransaction(transaction: Transaction | null): void {
    this.dialog.open(TransactionComponent, {
      data: transaction,
    }).afterClosed().subscribe(value => {
      console.log(value);
    });
  }
}
