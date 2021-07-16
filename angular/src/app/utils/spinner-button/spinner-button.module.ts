import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpinnerButtonComponent} from './spinner-button.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslationModule} from '../translation/translation.module';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    declarations: [SpinnerButtonComponent],
    imports: [CommonModule, TranslationModule, MatProgressSpinnerModule, MatButtonModule],
    exports: [SpinnerButtonComponent],
})
export class SpinnerButtonModule {}
