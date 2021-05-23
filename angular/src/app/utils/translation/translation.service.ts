import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import '@angular/common/locales/global/it';
import '@angular/common/locales/global/en';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private data: any = {};
    private languageSubject: BehaviorSubject<string>;
    public language: Observable<string>;

    constructor(
        private http: HttpClient,
    ) {
        const lang = localStorage.getItem('lang') || 'it';
        this.languageSubject = new BehaviorSubject(lang);
        this.language = this.languageSubject.asObservable();
        this.use(lang).then();
    }

    public get currentLanguage(): string {
        return this.languageSubject.value;
    }

    public get localeId(): string {
        if (this.currentLanguage === 'it') {
            return 'it-IT';
        } else {
            return 'en-US';
        }
    }

    public get(key: string): string {
        return this.data[key] || key;
    }

    public use(lang: string): Promise<{}> {
        localStorage.setItem('lang', lang);
        return new Promise<{}>((resolve, _) => {
            moment.locale(lang);
            const langPath = `assets/i18n/${lang}.json`;
            this.http.get<object>(langPath).toPromise().then(translation => {
                this.data = Object.assign({}, translation || {});
                this.languageSubject.next(lang);
                resolve(this.data);
            }).catch(error => {
                console.error(error);
                this.data = {};
                this.languageSubject.next(lang);
                resolve(this.data);
            });
        });
    }
}
