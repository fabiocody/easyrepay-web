import {NativeDateAdapter} from '@angular/material/core';
import {TranslationService} from './translation.service';


export class AppDateAdapter extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        return 1;
    }
}


export class DynamicLocaleId extends String {
    constructor(private translationService: TranslationService) {
        super();
    }

    public toString(): string {
        return this.translationService.localeId;
    }
}
