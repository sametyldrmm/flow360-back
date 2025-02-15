import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  @Get('.well-known/pki-validation/0A26C5FB77B4D9E26D291A254790194D.txt')
  async getSSLValidationFile(@Res() res: Response) {
    const filePath = path.join(__dirname, '0A26C5FB77B4D9E26D291A254790194D.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    res.send(fileContent);
  }
}
