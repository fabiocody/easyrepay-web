import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {PersonDetailDto} from '../../../../../src/model/dto/person-detail.dto';
import {Transaction, TransactionType} from '../../model/transaction';
import {MatDialog} from '@angular/material/dialog';
import {AddPersonComponent} from '../../dialogs/add-person/add-person.component';
import {InfoDialogComponent, InfoDialogData} from '../../dialogs/info-dialog/info-dialog.component';
import {Location} from '@angular/common';
import {TransactionComponent} from '../../dialogs/transaction/transaction.component';

@Component({
    selector: 'app-transactions-list',
    templateUrl: './transactions-list.component.html',
    styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
    public person: PersonDetailDto | null = null;
    public transactions: Transaction[] = [];
    public showCompleted = false;
    public loading = false;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private dialog: MatDialog,
        private apiService: ApiService,
    ) {}

    ngOnInit(): void {
        this.loading = true;
        const personId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
        this.apiService.getPerson(personId).subscribe(person => {
            console.log(person);
            this.person = person;
            this.updateTransactions();
        });
    }

    public updateTransactions(): void {
        this.apiService.getTransactions(this.person!.id, this.showCompleted).subscribe(transactions => {
            this.transactions = transactions;
            this.loading = false;
        });
    }

    public get total(): number {
        return this.totalCredit - this.totalDebt;
    }

    public get totalCredit(): number {
        return this.transactions
            .filter(t => t.type === TransactionType.CREDIT || t.type === TransactionType.SETTLE_DEBT)
            .map(t => t.amount)
            .reduce((acc, val) => acc + val, 0);
    }

    public get totalDebt(): number {
        return this.transactions
            .filter(t => t.type === TransactionType.DEBT || t.type === TransactionType.SETTLE_CREDIT)
            .map(t => t.amount)
            .reduce((acc, val) => acc + val, 0);
    }

    public navigateBack(): void {
        this.location.back();
    }

    public editPerson(): void {
        this.dialog.open(AddPersonComponent, {
            data: this.person,
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.apiService.getPerson(this.person!.id).subscribe(person => this.person = person);
            }
        });
    }

    public deletePerson(): void {
        const dialogData: InfoDialogData = {
            title: 'DELETE_PERSON_TITLE',
            body: 'DELETE_PERSON_BODY',
            okBtnText: 'DELETE',
            cancelBtnText: 'CANCEL',
            okBtnColor: 'warn'
        };
        this.dialog.open(InfoDialogComponent, {
            data: dialogData,
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.apiService.deletePerson(this.person!.id).subscribe(_ => this.navigateBack());
            }
        });
    }

    public openTransaction(transaction: Transaction | null): void {
        this.dialog.open(TransactionComponent, {
            data: {
                transaction,
                personId: this.person!.id,
            },
            maxWidth: '300px',
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.updateTransactions();
            }
        });
    }

    public completeAllTransactions(): void {
        const dialogData: InfoDialogData = {
            title: 'COMPLETE_ALL_TITLE',
            body: 'COMPLETE_ALL_BODY',
            okBtnText: 'CONFIRM',
            cancelBtnText: 'CANCEL',
        };
        this.dialog.open(InfoDialogComponent, {
            data: dialogData,
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.apiService.completeAllTransactions(this.person!.id).subscribe(_ => this.updateTransactions());
            }
        });
    }

    public deleteAllTransactions(): void {
        const dialogData: InfoDialogData = {
            title: 'DELETE_ALL_TITLE',
            body: 'DELETE_ALL_BODY',
            okBtnText: 'DELETE',
            cancelBtnText: 'CANCEL',
            okBtnColor: 'warn',
        };
        this.dialog.open(InfoDialogComponent, {
            data: dialogData,
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.apiService.deleteAllTransactions(this.person!.id).subscribe(_ => this.updateTransactions());
            }
        });
    }

    public deleteCompletedTransactions(): void {
        const dialogData: InfoDialogData = {
            title: 'DELETE_COMPLETED_TITLE',
            body: 'DELETE_COMPLETED_BODY',
            okBtnText: 'DELETE',
            cancelBtnText: 'CANCEL',
            okBtnColor: 'warn'
        };
        this.dialog.open(InfoDialogComponent, {
            data: dialogData,
            autoFocus: false,
        }).afterClosed().subscribe(value => {
            if (value) {
                this.apiService.deleteCompletedTransactions(this.person!.id).subscribe(_ => this.updateTransactions());
            }
        });
    }
}
