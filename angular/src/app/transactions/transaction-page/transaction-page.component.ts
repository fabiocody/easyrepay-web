import {Component} from '@angular/core';
import {TransactionDto} from '../../../../../src/model/dto/transaction.dto';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction-page.component.html',
    styleUrls: ['./transaction-page.component.scss'],
})
export class TransactionPageComponent {
    public transaction: TransactionDto | null;
    public personId: number;
    public showDelete: boolean;
    public loading = true;
    public error: string | null = null;

    constructor(private router: Router, public location: Location) {
        this.transaction = this.router.getCurrentNavigation()!.extras!.state!.transaction;
        this.personId = this.router.getCurrentNavigation()!.extras!.state!.personId;
        this.showDelete = !!this.transaction;
        const timeout = 75 + Math.random() * 50; // Random between 75 and 125
        setTimeout(() => (this.loading = false), timeout);
    }
}
