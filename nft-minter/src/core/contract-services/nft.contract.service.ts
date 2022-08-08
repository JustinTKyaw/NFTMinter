import { Injectable, Logger } from "@nestjs/common";
import NFT from './abi/MintOZ.json';
import { ConfigService } from "@nestjs/config";
import { Web3Service } from "../utilities/web3/web3.service";
import { Contract } from "web3-eth-contract";

@Injectable()
export class NFTContractService {

    private readonly logger = new Logger(NFTContractService.name);

    constructor(
        private configService: ConfigService,
        private web3Service: Web3Service
    ){
        this.logger.debug(`Init the NFT-Contract Service`)
        this.logger.debug(`NFT Contract address: ${this.configService.get<string>("NFT_CONTRACT_ADDRESS")}`)
    }

    private async getContract(): Promise<Contract>{
        var abi: any = NFT.abi;
        const contractAddress = this.configService.get<string>('NFT_CONTRACT_ADDRESS');
        var web3 = await this.web3Service.getWeb3Ref();
        return new web3.eth.Contract(abi, contractAddress);
    }

    async mint(metadataCid){
        this.logger.debug(`Minting NFT with ${metadataCid} metadata cid link`)
        let contract = await this.getContract();
        var receipt = await contract.methods.mint(metadataCid)
        .send({
            from: this.web3Service.globalAccount
        })
        const tnxHash = receipt.transactionHash;
        const blockNum = receipt.blockNumber;
        const tokenId = receipt.events.Transfer.returnValues.tokenId; 
        this.logger.debug(`NFT has been minted successfully with ${tnxHash} in blockNo ${blockNum} with tokenId ${tokenId}`);

        return `NFT has been minted successfully with ${tnxHash} in blockNo ${blockNum} with tokenId ${tokenId}`;

    }

    async getTotalSupply(): Promise<number>{
        // Get the total supply
        let contract = await this.getContract();
        return await contract.methods.totalSupply().call()
    }

    async getTokenURI(tokenId: number): Promise<string> {
        // Get tokenURI by tokenId
        let contract = await this.getContract();
        return await contract.methods.tokenURI(tokenId).call();
    }

    async getTokenId(tokenIndex: number): Promise<number>{
        // Get tokenId by tokenIndex
        let contract = await this.getContract();
        return await contract.methods.tokenByIndex(tokenIndex).call();
    }

}