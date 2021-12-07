import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TransactionsService} from './transactions.service';
import {PeopleService} from '../people/people.service';
import {PersonDetailDto} from '../../model/person-detail.dto';
import {MatDialog} from '@angular/material/dialog';
import {AddPersonComponent} from '../people/add-person/add-person.component';
import {InfoDialogComponent, InfoDialogData} from '../utils/info-dialog/info-dialog.component';
import {Location} from '@angular/common';
import {TransactionDialogComponent} from './transaction-dialog/transaction-dialog.component';
import {TransactionDto} from '../../model/transaction.dto';
import {TransactionType} from '../../model/transaction-type';
import {MediaObserver} from '@angular/flex-layout';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit, OnDestroy {
    public person: PersonDetailDto | null = null;
    public transactions: TransactionDto[] = [];
    public showCompleted = false;
    public loading = true;
    private subs = new SubSink();

    constructor(
        public location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private mediaObserver: MediaObserver,
        private transactionsService: TransactionsService,
        private peopleService: PeopleService,
    ) {
        this.person = this.router.getCurrentNavigation()!.extras!.state!.person;
    }

    public ngOnInit(): void {
        this.updateTransactions();
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public updateTransactions(): void {
        this.transactionsService
            .getTransactions(this.person!.id, this.showCompleted)
            .then(transactions => (this.transactions = transactions))
            .catch(error => console.error(error))
            .finally(() => (this.loading = false));
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

    public editPerson(): void {
        this.subs.sink = this.dialog
            .open(AddPersonComponent, {
                data: this.person,
                autoFocus: false,
                restoreFocus: false,
            })
            .afterClosed()
            .subscribe(value => {
                if (value) {
                    this.peopleService
                        .getPerson(this.person!.id)
                        .then(person => (this.person = person))
                        .catch(error => console.error(error));
                }
            });
    }

    public deletePerson(): void {
        const dialogData: InfoDialogData = {
            title: 'DELETE_PERSON_TITLE',
            body: 'DELETE_PERSON_BODY',
            okBtnText: 'DELETE',
            cancelBtnText: 'CANCEL',
            okBtnColor: 'warn',
        };
        this.subs.sink = this.dialog
            .open(InfoDialogComponent, {
                data: dialogData,
                autoFocus: false,
                restoreFocus: false,
            })
            .afterClosed()
            .subscribe(value => {
                if (value) {
                    this.peopleService
                        .deletePerson(this.person!.id)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .then(_ => this.location.back())
                        .catch(error => {
                            console.error(error);
                            const errorDialogData: InfoDialogData = {
                                title: 'ERROR',
                                body: 'ERROR_DELETE_PERSON',
                                okBtnText: 'OK',
                            };
                            this.dialog.open(InfoDialogComponent, {
                                data: errorDialogData,
                                autoFocus: false,
                                restoreFocus: false,
                            });
                        });
                }
            });
    }

    public openTransaction(transaction: TransactionDto | null): void {
        if (this.mediaObserver.isActive('xs')) {
            const personId = this.person!.id;
            this.router.navigate(['/transactions/transaction'], {state: {transaction, personId}}).then();
        } else {
            this.subs.sink = this.dialog
                .open(TransactionDialogComponent, {
                    data: {
                        transaction: transaction,
                        personId: this.person!.id,
                    },
                    maxWidth: '300px',
                    autoFocus: false,
                    restoreFocus: false,
                })
                .afterClosed()
                .subscribe(value => {
                    if (value) {
                        this.updateTransactions();
                    }
                });
        }
    }

    public completeAllTransactions(): void {
        const dialogData: InfoDialogData = {
            title: 'COMPLETE_ALL_TITLE',
            body: 'COMPLETE_ALL_BODY',
            okBtnText: 'CONFIRM',
            cancelBtnText: 'CANCEL',
        };
        this.subs.sink = this.dialog
            .open(InfoDialogComponent, {
                data: dialogData,
                autoFocus: false,
                restoreFocus: false,
            })
            .afterClosed()
            .subscribe(value => {
                if (value) {
                    this.transactionsService
                        .completeAllTransactions(this.person!.id)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .then(_ => this.updateTransactions())
                        .catch(error => console.error(error));
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
        this.subs.sink = this.dialog
            .open(InfoDialogComponent, {
                data: dialogData,
                autoFocus: false,
                restoreFocus: false,
            })
            .afterClosed()
            .subscribe(value => {
                if (value) {
                    this.transactionsService
                        .deleteAllTransactions(this.person!.id)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .then(_ => this.updateTransactions())
                        .catch(error => console.error(error));
                }
            });
    }

    public deleteCompletedTransactions(): void {
        const dialogData: InfoDialogData = {
            title: 'DELETE_COMPLETED_TITLE',
            body: 'DELETE_COMPLETED_BODY',
            okBtnText: 'DELETE',
            cancelBtnText: 'CANCEL',
            okBtnColor: 'warn',
        };
        this.subs.sink = this.dialog
            .open(InfoDialogComponent, {
                data: dialogData,
                autoFocus: false,
                restoreFocus: false,
            })
            .afterClosed()
            .subscribe(value => {
                if (value) {
                    this.transactionsService
                        .deleteCompletedTransactions(this.person!.id)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .then(_ => this.updateTransactions())
                        .catch(error => console.error(error));
                }
            });
    }
}
