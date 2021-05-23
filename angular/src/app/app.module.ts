import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RequestInterceptorService} from './utils/request-interceptor/request-interceptor.service';
import {NavbarModule} from './navbar/navbar.module';
import {SpinnerModule} from './utils/spinner/spinner.module';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NavbarModule,
        SpinnerModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptorService,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
