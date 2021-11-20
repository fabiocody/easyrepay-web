import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ReleaseInfoDto} from '../model/dto/release-info.dto';

@Injectable()
export class UtilsService {
    constructor(private configService: ConfigService) {}

    public getEnvironment(): string {
        return this.configService.get<string>('NODE_ENV', 'development');
    }

    public isDev(): boolean {
        return this.getEnvironment() === 'development';
    }

    public dateComparator(a: Date, b: Date): number {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }

    public getReleaseInfo(): ReleaseInfoDto {
        const releaseInfo = {
            branch: this.configService.get<string>('GIT_BRANCH'),
            commit: this.configService.get<string>('GIT_COMMIT'),
            date: this.configService.get<string>('RELEASE_DATE'),
        };
        return new ReleaseInfoDto(releaseInfo);
    }
}
