import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
    selector: 'app-spinner-button',
    templateUrl: './spinner-button.component.html',
    styleUrls: ['./spinner-button.component.scss'],
})
export class SpinnerButtonComponent {
    @Input() public loading = false;
    @Input() public disabled = false;
    @Input() public text = '';
    @Input() public color: ThemePalette = 'primary';
    @Output() public btnClick = new EventEmitter();

    public onClick(): void {
        this.btnClick.emit();
    }
}
