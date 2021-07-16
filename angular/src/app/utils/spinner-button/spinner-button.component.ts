import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
    selector: 'app-spinner-button',
    templateUrl: './spinner-button.component.html',
    styleUrls: ['./spinner-button.component.scss'],
})
export class SpinnerButtonComponent implements OnInit {
    @Input() public loading = false;
    @Input() public disabled = false;
    @Input() public text = '';
    @Input() public color: ThemePalette = 'primary';
    @Output() public btnClick = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    public onClick(): void {
        this.btnClick.emit();
    }
}
