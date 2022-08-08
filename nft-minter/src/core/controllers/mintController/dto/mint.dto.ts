import {IsNotEmpty, IsString} from 'class-validator';

export class MintReqBody {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    fileIdentifier: string;
}