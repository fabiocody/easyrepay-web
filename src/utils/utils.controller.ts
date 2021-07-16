import {Controller, Get} from '@nestjs/common';
import {UtilsService} from './utils.service';
import {ReleaseInfoDto} from '../model/dto/release-info.dto';

@Controller('utils')
export class UtilsController {
    constructor(private readonly utilsService: UtilsService) {}

    @Get('release-info')
    public getReleaseInfo(): ReleaseInfoDto {
        return this.utilsService.getReleaseInfo();
    }
}
