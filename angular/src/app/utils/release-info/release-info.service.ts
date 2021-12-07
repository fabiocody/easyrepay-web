import {Injectable} from '@angular/core';
import {ReleaseInfoModule} from './release-info.module';
import {HttpClient} from '@angular/common/http';
import {ReleaseInfoDto} from '../../../model/release-info.dto';

@Injectable({
    providedIn: ReleaseInfoModule,
})
export class ReleaseInfoService {
    constructor(private http: HttpClient) {}

    public async getReleaseInfo(): Promise<ReleaseInfoDto> {
        return this.http.get<ReleaseInfoDto>('/api/utils/release-info').toPromise();
    }
}
