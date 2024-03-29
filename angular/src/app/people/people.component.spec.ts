import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PeopleComponent} from './people.component';

describe('PeopleListComponent', () => {
    let component: PeopleComponent;
    let fixture: ComponentFixture<PeopleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PeopleComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
