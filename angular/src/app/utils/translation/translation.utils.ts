import {Injectable} from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        return this.locale === 'it-IT' ? 1 : super.getFirstDayOfWeek();
    }
}
