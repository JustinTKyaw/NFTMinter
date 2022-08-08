import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
@Injectable()
export class ResponseService {

    private readonly logger: Logger = new Logger(ResponseService.name);
    constructor() { }

    response(res: Response, message: string, data: any, dataKeyName?: string, httpStatus?: HttpStatus): Response {
        let code: number = 0;
        const SUCCESS_CODES: HttpStatus[] = [200, 201, 202];
        if (!httpStatus) httpStatus = 200;
        const isIncludeInSuccessCodes: boolean = SUCCESS_CODES.some((e, i) => { return e == httpStatus });
        isIncludeInSuccessCodes ? code = 0 : code = 1;

        // const currentHttpStatus: number = 200;
        if (!dataKeyName) dataKeyName = "data";
        var ret = {
            code: code,
            message: message
        }

        ret[dataKeyName] = data

        return res.status(200).send(ret);
    }
}
