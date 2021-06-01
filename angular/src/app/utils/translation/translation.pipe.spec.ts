import {TranslationPipe} from './translation.pipe';
import {TranslationService} from './translation.service';
import {TestBed} from '@angular/core/testing';

describe('TranslationPipe', () => {
    let translationService: TranslationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        translationService = TestBed.inject(TranslationService);
    });

    it('create an instance', () => {
        const pipe = new TranslationPipe(translationService);
        expect(pipe).toBeTruthy();
    });
});
