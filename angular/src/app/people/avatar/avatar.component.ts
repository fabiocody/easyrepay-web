import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
    @Input() public color = '';
    @Input() public name = '';
    public initials = '';

    constructor() {}

    ngOnInit(): void {
        this.createInitials();
    }

    private createInitials(): void {
        this.initials = '';
        const splits = this.name.split(' ').slice(0, 2);
        for (const s of splits) {
            this.initials += s[0].toUpperCase();
        }
    }
}
