import { Injectable, InternalServerErrorException, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from 'path';
import Web3 from "web3";
import * as bip39 from 'bip39';

const HDWalletProvider = require("@truffle/hdwallet-provider");

@Injectable()
export class Web3Service {
    private readonly logger = new Logger(Web3Service.name);
    private web3: Web3;

    globalAccount: string;

    private WALLET_DIR_NAME: string = "wallet";
    private SEED_FILE_NAME: string = "seeders";
    private WORD_STRENGHT: number = 128; // this could be multiple of 8 but here we used 128

    constructor(@Optional() private configService: ConfigService) {
        this.logger.debug('Init the Web3 Service');
    }
    
    async buildConnection(): Promise<void> {
        try {
            this.logger.log(`Web3 service initialization process start`)
            
            let provider = await this.setupWallet();

            const web3Ref: Web3 = new Web3(provider);
            const connection: boolean = await web3Ref.eth.net.isListening().catch((error: Error) => {
                throw new InternalServerErrorException("Cannont connect to Node RPC endpoint.")
            })
            if (connection) {
                this.logger.log(`Connection established between Node RPC and nft-minter endpoint ${this.configService.get<string>("WEB3_URL")}`);
                this.web3 = web3Ref;
            }

            const [account0, _] = await this.web3.eth.getAccounts()
            this.logger.debug(`Apps will use ${account0} as default account.`)

            this.globalAccount = account0;

        } catch (error: any) {
            this.logger.error(error.message);
        }
    }

    private async setupWallet(): Promise<any>{
        try{
            const web3Url: string = this.configService.get<string>("WEB3_URL");

            // Create folder if doesn't exist
            // Generate new mnemonic and save under wallet.
            if (!existsSync(`./${this.WALLET_DIR_NAME}`)) {
                mkdirSync(this.WALLET_DIR_NAME);
                this.logger.debug(`Wallet folder setup done with folder name '${this.WALLET_DIR_NAME}'`);

                // Generate bip39 words seed.
                const wordList: string[] = bip39.wordlists.english;
                const mnemonicStr: string = bip39.generateMnemonic(this.WORD_STRENGHT, undefined, wordList);
                this.logger.debug(`Generating new mnemonic words seed: ${mnemonicStr}.`);

                // Write into file
                writeFileSync(join(`./${this.WALLET_DIR_NAME}`, this.SEED_FILE_NAME), mnemonicStr, {
                    flag: 'w',
                });

                return new HDWalletProvider({
                    mnemonic: {
                      phrase: mnemonicStr
                    },
                    providerOrUrl: web3Url
                });
            }
            else{
                this.logger.debug(`Using existing mnemonic words as default.`)
                const mnemonicStr = readFileSync(join(`./${this.WALLET_DIR_NAME}`, this.SEED_FILE_NAME), 'utf-8');

                return new HDWalletProvider({
                    mnemonic: {
                      phrase: mnemonicStr
                    },
                    providerOrUrl: web3Url
                });   
            }
        }
        catch(error: any) {this.logger.error(error)}
    }
    
    async getWeb3Ref(): Promise<Web3> {
        await this.web3.eth.net.isListening().catch((error: Error) => {
            throw new InternalServerErrorException("Cannont connect to Node RPC endpoint.");
        });

        return this.web3;
    }
}
