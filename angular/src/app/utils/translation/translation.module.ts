import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationPipe} from './translation.pipe';


@NgModule({
    declarations: [TranslationPipe],
    imports: [
        CommonModule
    ],
    exports: [TranslationPipe],
})
export class TranslationModule {
}
