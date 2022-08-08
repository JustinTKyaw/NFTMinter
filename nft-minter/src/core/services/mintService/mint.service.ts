import { Injectable, Logger } from '@nestjs/common';
import { NFTContractService } from 'src/core/contract-services/nft.contract.service';
import { MintReqBody } from 'src/core/controllers/mintController/dto/mint.dto';
import { PinataService } from 'src/core/utilities/ipfs/ipfs.service';
import axios from 'axios';
import { MintRetDto } from './dto/mint.ret.dto';


@Injectable()
export class MintService {

  private readonly logger = new Logger(MintService.name);
  constructor(
    private ipfsService: PinataService,
    private nftContractService: NFTContractService
  ){}

  async mintNft(reqBody: MintReqBody, filename: string): Promise<string>{
    try{
      // 1. Submit data on ipfs
      var cidLink = await this.ipfsService.pushFileToIPFS(filename);

      // 2. Create metadata json file
      // 3. Put Metadata json file on ipfs
      var metadataCidLink = await this.ipfsService.pushJSONToIPFS(
        reqBody.name,
        reqBody.description,
        cidLink
      );    

      // 4.Set the metadata JSON as parameter to mint() method
      return await this.nftContractService.mint(metadataCidLink);
    }
    catch(error){throw error}
  }

  /**
   * As defualt this function will return all of the minted nft by default global account.
   * For future improvement, it will return relevant nft list by user's wallet address.
   */
  async getMintedTokens(): Promise<MintRetDto[]>{
    try{
      // 1. Get the totalsupply
      const totalSupply = await this.nftContractService.getTotalSupply();

      // 2. Get the NFT Tokens.
      var nftList: MintRetDto[]= [];
      for (var i = 0; i < totalSupply; i++) {
        // Get the token ID by index
        const tokenId = await this.nftContractService.getTokenId(i);

        // get the tokenURI by using tokenID
        const tokenURI = await this.nftContractService.getTokenURI(tokenId);

        // Get the token metadata via tokenURI.
        var nftMetadata: MintRetDto = await this.getTokenMetadata<MintRetDto>(tokenURI);
        nftMetadata.tokenId = tokenId;

        nftList.push(nftMetadata);
      }

      return nftList;

    } catch(error){
      throw new Error("NFT contract is not avaliable on network.")
    }
  }

  async getMintedToken(tokenId: number): Promise<MintRetDto>{
    try{
      // get the tokenURI by using tokenID
      const tokenURI = await this.nftContractService.getTokenURI(tokenId);
      
      // Get the token metadata via tokenURI.
      var nftMetadata: MintRetDto = await this.getTokenMetadata<MintRetDto>(tokenURI);
      nftMetadata.tokenId = tokenId;

      return nftMetadata;

    } catch(error){
      throw error;
    }
  }

  private async getTokenMetadata<T>(url: string): Promise<T> {
    return fetch(url)
    .then(async response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json()
    })
  }
  
}
