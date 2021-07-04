import {Get, JsonController} from 'routing-controllers';

@JsonController('/utils')
export class UtilsController {
    @Get('/release-info')
    public releaseInfo(): any {
        return JSON.parse(process.env.RELEASE_INFO ?? '{}');
    }
}
