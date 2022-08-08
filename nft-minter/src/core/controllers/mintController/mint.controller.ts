import { Body, Controller, Get, Logger, Optional, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';

import {FileInterceptor} from '@nestjs/platform-express';
import { Response } from 'express';
import { multerOptions } from 'src/config/multer.config'; 
import { MintService } from 'src/core/services/mintService/mint.service';
import { ResponseService } from 'src/core/utilities/response/response.service';
import { MintReqBody } from './dto/mint.dto';

@Controller('nftmint')
export class MintController {
  private readonly logger = new Logger(MintController.name);

  constructor( 
    private mintService: MintService,
    private readonly responseService: ResponseService

  ){}

  @Post('mint')
    async mintNFT(@Res() res: Response, @Body() reqBody: MintReqBody) {
      try{
        var msg = await this.mintService.mintNft(reqBody, reqBody.fileIdentifier);
        this.responseService.response(res, msg, null, null, 200);
      }
      catch(error){
        this.responseService.response(res, "error", null, "MintNFTs", 500);
      }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    this.responseService.response(res, `Upload file done.`, null, null, 200);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async mintNFTApi(@Res() res: Response, @Body() reqBody: MintReqBody, @UploadedFile() file: Express.Multer.File) {
    await this.mintService.mintNft(reqBody, file.originalname);
    this.responseService.response(res, `NFT ${reqBody.name} is successfully minted on Blockchain network`, null, null, 200);
  }

  @Get()
  async getMintedTokens(@Res() res: Response){
    try{
      var nftList = await this.mintService.getMintedTokens();
      this.responseService.response(res, 'Successfully retrieved all minted tokens', nftList, "NFTs", 200);
    }
    catch(error){
      this.responseService.response(res, error, null, "NFTs", 500);
    }
  }

  @Get(':id')
  async getMintedToken(@Res() res: Response, @Param('id') id: number){
    try{
      var nft = await this.mintService.getMintedToken(id);
      this.responseService.response(res, `Retrieved token by using tokenId ${id}`, nft, "NFT", 200);
    }
    catch(error){
      this.responseService.response(res, "error", null, "NFTs", 500);
    }
  }
}
