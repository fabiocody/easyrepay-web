import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import '@angular/common/locales/global/it';
import '@angular/common/locales/global/en';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private readonly _lang: string;
    private data: any = {};

    constructor(private http: HttpClient) {
        this._lang = localStorage.getItem('lang') || 'it';
        this.load(this._lang).then();
    }

    public get lang(): string {
        return this._lang;
    }

    public get localeId(): string {
        if (this.lang === 'it') {
            return 'it-IT';
        } else {
            return 'en-US';
        }
    }

    public get(key: string): string {
        return this.data[key] || key;
    }

    public async use(lang: string): Promise<any> {
        localStorage.setItem('lang', lang);
        document.location.reload();
    }

    private async load(lang: string): Promise<void> {
        localStorage.setItem('lang', lang);
        const translation = await this.http.get(`/assets/i18n/${lang}.json`).toPromise();
        this.data = Object.assign({}, translation || {});
        moment.locale(lang);
    }
}
