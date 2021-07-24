import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RequestInterceptorService} from './utils/request-interceptor/request-interceptor.service';
import {NavbarModule} from './navbar/navbar.module';
import {SpinnerModule} from './utils/spinner/spinner.module';
import {TranslationService} from './utils/translation/translation.service';
import {ReleaseInfoModule} from './utils/release-info/release-info.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NavbarModule,
        SpinnerModule,
        ReleaseInfoModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptorService,
            multi: true,
        },
        {
            provide: LOCALE_ID,
            deps: [TranslationService],
            useFactory: (translationService: TranslationService) => translationService.localeId,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
