import {TestBed} from '@angular/core/testing';

import {ReleaseInfoService} from './release-info.service';

describe('ReleaseInfoService', () => {
    let service: ReleaseInfoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ReleaseInfoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
