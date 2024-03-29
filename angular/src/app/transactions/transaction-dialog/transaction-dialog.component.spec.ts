import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TransactionDialogComponent} from './transaction-dialog.component';

describe('TransactionComponent', () => {
    let component: TransactionDialogComponent;
    let fixture: ComponentFixture<TransactionDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TransactionDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TransactionDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
