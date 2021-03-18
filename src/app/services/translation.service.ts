import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public data: any = {};
  private languageSubject = new BehaviorSubject<string>('it');
  public language = this.languageSubject.asObservable();

  constructor(
    private http: HttpClient,
  ) {
    const lang = localStorage.getItem('lang') || 'it';
    this.use(lang).then();
  }

  public get currentLanguage(): string {
    return this.languageSubject.value;
  }

  public use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
      moment.locale(lang);
      const langPath = `assets/i18n/${lang}.json`;
      this.http.get<{}>(langPath).subscribe(translation => {
        this.data = Object.assign({}, translation || {});
        this.languageSubject.next(lang);
        resolve(this.data);
      }, error => {
        console.error(error);
        this.data = {};
        this.languageSubject.next(lang);
        resolve(this.data);
      });
    });
  }
}
