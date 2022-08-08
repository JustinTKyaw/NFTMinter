import { Body, Controller, Get, Logger, Optional, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import {FileInterceptor} from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { multerOptions } from './config/multer.config';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService
  ) {}
}
