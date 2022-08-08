import { Injectable, Logger, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
import { existsSync, mkdirSync } from "fs";

@Injectable()
export class PinataService {
    private readonly logger = new Logger(PinataService.name);
    private pinata: any;

    constructor(@Optional() private configService: ConfigService) {
        const apiKey: string = this.configService.get<string>("PINATA_KEY");
        const secretApiKey: string = this.configService.get<string>("PINATA_SECRET_KEY");

        this.pinata = pinataSDK(apiKey, secretApiKey);
    }

    /**
     * 
     * @param file 
     * @returns https link along with cid hash on pinata
     */
    async pushFileToIPFS(filename: string): Promise<string> {
        try{

            this.logger.debug(`${PinataService.name} processing to upload ${filename}.`)

            const cacheDir: string = this.configService.get<string>("CACHE_DIR");

            if (!existsSync(cacheDir)) {
                mkdirSync(cacheDir);
            }
            
            const readStream = await fs.createReadStream(`${cacheDir}/${filename}`);            

            const options = {
                pinataMetadata: {
                    name: filename, 
                    keyvalues: {company: "Pinata"}
                },
                pinataOptions: {
                    cidVersion: 1
                }
            };

            return this.pinata.pinFileToIPFS(readStream, options).then((result) => {
                return this.getCidLink(result);
            }).catch((err) => {
                //handle error here
                this.logger.error(err)
            });            
        }
        catch(error: any){
            this.logger.error(error);
        }
    }

    /**
     * 
     * @param name 
     * @param description 
     * @param ipfsCidLink 
     * @returns metadata link on ipfs
     */
    async pushJSONToIPFS(name: string, description: string, ipfsCidLink: string): Promise<string> {
        try{
            this.logger.debug(`Uploading metadata on Pinata service with image cid.`)

            const body = {
                name: name,
                description: description,
                image: ipfsCidLink
            };
            const options = {
                pinataMetadata: {
                    name: name,
                },
                pinataOptions: {
                    cidVersion: 1
                }
            };
    
            return this.pinata.pinJSONToIPFS(body, options).then((result) => {
                return this.getCidLink(result);
            }).catch((err) => {
                //handle error here
                this.logger.error(err)
            });
        }
        catch(error: any) { this.logger.error(error) }
    }

    getCidLink(result): string{
        
        const pinataGatewayUri: string = this.configService.get<string>("PINATA_GATEWAY");

        this.logger.log(`IpfsHash: ${result.IpfsHash}`)
        this.logger.log(`Content avaliable on pinata via following gateway link: ${pinataGatewayUri}${result.IpfsHash}`)
        return pinataGatewayUri + result.IpfsHash; 
    }
}