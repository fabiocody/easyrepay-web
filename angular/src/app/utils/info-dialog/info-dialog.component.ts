import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ThemePalette} from '@angular/material/core';

export interface InfoDialogData {
    title: string;
    body: string;
    okBtnText?: string;
    cancelBtnText?: string;
    okBtnColor?: ThemePalette;
}

@Component({
    selector: 'app-info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: ['./info-dialog.component.scss'],
})
export class InfoDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: InfoDialogData) {}
}
