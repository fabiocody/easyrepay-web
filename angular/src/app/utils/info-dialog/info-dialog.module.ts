import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InfoDialogComponent} from './info-dialog.component';
import {TranslationModule} from '../translation/translation.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [InfoDialogComponent],
    imports: [
        CommonModule,
        TranslationModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [InfoDialogComponent]
})
export class InfoDialogModule {
}
