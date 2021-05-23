import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationPipe} from './translation.pipe';
import {TranslationService} from './translation.service';
import {DynamicLocaleId} from './translation.utils';


@NgModule({
    declarations: [TranslationPipe],
    imports: [
        CommonModule
    ],
    exports: [TranslationPipe],
    providers: [
        TranslationService,
        {
            provide: LOCALE_ID,
            deps: [TranslationService],
            useClass: DynamicLocaleId
        }
    ]
})
export class TranslationModule {
}
