import { Injectable, Logger } from '@nestjs/common';
import { MintService } from './core/services/mintService/mint.service';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  mintNft(file: Express.Multer.File): void{
    //Call Mint Service to create new mint process app -> mint service
  }


}
