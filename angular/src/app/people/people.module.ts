import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PeopleRoutingModule} from './people-routing.module';
import {PeopleComponent} from './people.component';
import {PersonCardComponent} from './person-card/person-card.component';
import {AddPersonComponent} from './add-person/add-person.component';
import {TranslationModule} from '../utils/translation/translation.module';
import {SpinnerModule} from '../utils/spinner/spinner.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {AvatarComponent} from './avatar/avatar.component';
import {PeopleService} from './people.service';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SpinnerButtonModule} from '../utils/spinner-button/spinner-button.module';

@NgModule({
    declarations: [PeopleComponent, PersonCardComponent, AvatarComponent, AddPersonComponent],
    imports: [
        CommonModule,
        PeopleRoutingModule,
        TranslationModule,
        SpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        SpinnerButtonModule,
    ],
    providers: [PeopleService],
})
export class PeopleModule {}
