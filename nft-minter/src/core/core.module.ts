import { Module } from '@nestjs/common';
import { NFTContractService } from './contract-services/nft.contract.service';
import { MintController } from './controllers/mintController/mint.controller';
import { MintService } from './services/mintService/mint.service';
import { PinataService } from './utilities/ipfs/ipfs.service';

import { ResponseService } from './utilities/response/response.service';
import { Web3Service } from './utilities/web3/web3.service';

@Module({
  imports: [],
  providers: [
    ResponseService,
    Web3Service,
    PinataService,
    MintService,
    NFTContractService
  ],
  controllers: [
    MintController
  ]
})
export class CoreModule {
  constructor(private web3Service: Web3Service){}

  onModuleInit() {
    this.initSetup();
  }

  async initSetup() {
    await this.web3Service.buildConnection();
  }
}