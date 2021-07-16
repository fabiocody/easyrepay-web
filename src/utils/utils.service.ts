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
        const releaseInfo = JSON.parse(this.configService.get<string>('RELEASE_INFO', '{}'));
        return new ReleaseInfoDto(releaseInfo);
    }
}
