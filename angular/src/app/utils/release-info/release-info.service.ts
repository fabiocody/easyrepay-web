import {Injectable} from '@angular/core';
import {ReleaseInfoModule} from './release-info.module';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: ReleaseInfoModule
})
export class ReleaseInfoService {
    constructor(private http: HttpClient) {
    }

    public async getReleaseInfo(): Promise<any> {
        return this.http.get('/api/utils/release-info').toPromise();
    }
}
