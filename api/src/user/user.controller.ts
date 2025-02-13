import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, NotFoundException, InternalServerErrorException, Request, ForbiddenException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StateService } from '../state/state.service';

@ApiTags("User")
@ApiBearerAuth()
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly stateService: StateService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Yeni kullanıcı oluştur' })
  @ApiResponse({
    status: 201,
    description: 'Kullanıcı başarıyla oluşturuldu',
    schema: {
      example: {
        id: 1,
        name: "Ahmet",
        surname: "Yılmaz",
        nickname: "ahmet123",
        email: "ahmet@example.com",
        tel: "+905551234567",
        tc: "12345678901",
        birthDate: "1990-01-01",
        city: "İstanbul",
        kvkk: true,
        socialMedia: "@ahmet123",
        youtube: "@ahmet_youtube",
        createdAt: "2024-03-19T10:00:00Z"
      }
    }
  })
  @ApiBody({
    schema: {
      required: [
        'name',
        'surname',
        'nickname',
        'email',
        'password',
        'tel',
        'tc',
        'birthDate',
        'city',
        'kvkk'
      ],
      example: {
        // Zorunlu alanlar
        name: "Ahmet",
        surname: "Yılmaz",
        nickname: "ahmet123",
        email: "ahmet@example.com",
        password: "Sifre123!",
        tel: "+905551234567",
        tc: "12345678901",
        birthDate: "1990-01-01",
        city: "İstanbul",
        kvkk: true,
        // Opsiyonel alanlar
        socialMedia: "@ahmet123",
        youtube: "@ahmet_youtube"
      }
    }
  })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Yeni kullanıcı oluşturma isteği: ${createUserDto.email}`);
    const user = await this.userService.create(createUserDto);
    await this.stateService.create(user.id);
    return user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm kullanıcıları listele' })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı listesi başarıyla getirildi',
    schema: {
      example: [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'ornek@email.com',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        createdAt: '2024-03-19T10:00:00Z'
      }]
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Bu işlem için yetkiniz yok'
  })
  async findAll(@Request() req: Request) {
    this.logger.log('Tüm kullanıcıları listeleme isteği');
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
      const user = await this.userService.findOne(+decoded.id);
  
      if (user.role !== 'admin') {
        throw new ForbiddenException('Bu işlem için yetkiniz yok');
      }
      
      return this.userService.findAll();
    } catch (error) {
      this.logger.error(`Kullanıcılar listelenirken hata: ${error.message}`);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Kullanıcılar listelenirken bir hata oluştu');
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ID ile kullanıcı getir' })
  @ApiParam({
    name: 'id',
    description: 'Kullanıcı ID',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla getirildi',
    schema: {
      example: {
        id: 1,
        email: 'ornek@email.com',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        createdAt: '2024-03-19T10:00:00Z'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Yetkisiz erişim'
  })
  async findOne(@Request() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    this.logger.log(`Kullanıcı kendi bilgilerini görüntüleme isteği. Kullanıcı ID: ${decoded.id}`);
    return this.userService.findOne(+decoded.id);
  }
  @Get("fake_all_get")
  async fakeAllGet() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ID ile kullanıcı getir' })
  @ApiParam({
    name: 'id',
    description: 'Kullanıcı ID',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla getirildi',
    schema: {
      example: {
        id: 1,
        email: 'ornek@email.com',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        createdAt: '2024-03-19T10:00:00Z'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Yetkisiz erişim'
  })
  async findOnebyId(@Param('id') id: string, @Request() req: Request) {
    this.logger.log(`ID ile kullanıcı görüntüleme isteği. İstenen ID: ${id}`);
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const user = await this.userService.findOne(+decoded.id);

    if (user.role !== 'admin') {
      throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }
        
    return await this.userService.findOne(+id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateMe(@Body() updateUserDto: UpdateUserDto, @Request() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    this.logger.log(`Kullanıcı kendi bilgilerini güncelleme isteği. Kullanıcı ID: ${decoded.id}`);
    return this.userService.update(+decoded.id, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı bilgilerini güncelle' })
  @ApiParam({
    name: 'id',
    description: 'Kullanıcı ID',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla güncellendi',
    schema: {
      example: {
        id: 1,
        email: 'ornek@email.com',
        firstName: 'Mehmet',
        lastName: 'Öz',
        updatedAt: '2024-03-19T11:00:00Z'
      }
    }
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: Request) {
    this.logger.log(`Kullanıcı güncelleme isteği. Güncellenecek ID: ${id}`);
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const user = await this.userService.findOne(+decoded.id);

    if (user.role !== 'admin') {
      throw new ForbiddenException('Bu işlem için yetkiniz yok');
    }

    return this.userService.update(+decoded.id, updateUserDto);
  }
  

  


  @Post('password-reset/request')
  @HttpCode(200)
  @ApiOperation({ summary: 'Şifre sıfırlama kodu talep et' })
  @ApiResponse({ status: 200, description: 'Şifre sıfırlama kodu gönderildi' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com'
        }
      }
    }
  })
  async requestPasswordReset(@Body('email') email: string) {
    this.logger.log(`Şifre sıfırlama kodu talebi. Email: ${email}`);
    await this.userService.requestPasswordReset(email);
    return { message: 'Şifre sıfırlama kodu email adresinize gönderildi' };
  }

  @Post('password-reset/verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Şifre sıfırlama kodunu doğrula' })
  @ApiResponse({ status: 200, description: 'Kod başarıyla doğrulandı' })
  @ApiResponse({ status: 401, description: 'Geçersiz veya süresi dolmuş kod' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com'
        },
        code: {
          type: 'string',
          example: '123456'
        }
      }
    }
  })

  async verifyPasswordResetCode(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    this.logger.log(`Şifre sıfırlama kodu doğrulama isteği. Email: ${email}`);
    try {
        await this.userService.verifyPasswordResetCode(email, code);
    } catch (error) {
      this.logger.error(`Kod doğrulama hatası: ${error.message}`);
      console.log("statusCode: 401");
      return { statusCode: 401, message: 'Hata' };  
    }

    console.log("statusCvvffode: 200");
    return { statusCode: 200, message: 'Kod doğrulandı' };
  }

  @Get('email/:email')
  async getUserIdByEmail(@Param('email') email: string) {
    this.logger.log(`Email ile kullanıcı ID sorgulama. Email: ${email}`);
    try {
      const user = await this.userService.findByEmail(email);
      return { id: user.id };
    } catch (error) {
      this.logger.error(`Email ile kullanıcı sorgulama hatası: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Bu email adresi ile kayıtlı kullanıcı bulunamadı');
      }
      throw new InternalServerErrorException('Kullanıcı bilgileri alınırken bir hata oluştu');
    }
  }

  @Patch('password/:email')
  @ApiOperation({ summary: 'Şifre güncelle' })
  async updatePassword(
    @Param('email') email: string,
    @Body('password') password: string
  ) {
    this.logger.log(`Şifre güncelleme isteği. Email: ${email}`);
    try {
        await this.userService.updatePassword(email, password);
        return { statusCode: 200, message: 'Şifre güncellendi' };
      } catch (error) {
      this.logger.error(`Şifre güncelleme hatası: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }
      throw new InternalServerErrorException('Şifre güncellenirken bir hata oluştu');
    }
  }

  @Delete('all')
  @ApiOperation({ summary: 'Tüm kullanıcıları ve stateleri sil' })
  @ApiResponse({
    status: 200,
    description: 'Tüm kullanıcılar ve stateler başarıyla silindi'
  })
  async deleteAll() {
    this.logger.log('Tüm kullanıcıları ve stateleri silme isteği');
    try {
      // Önce tüm stateleri sil
      //await this.stateService.removeAll();
      // Sonra tüm kullanıcıları sil
      await this.userService.removeAll();
      return { message: 'Tüm kullanıcılar ve stateler başarıyla silindi' };
    } catch (error) {
      this.logger.error(`Toplu silme işleminde hata: ${error.message}`);
      throw new InternalServerErrorException('Silme işlemi sırasında bir hata oluştu');
    }
  }

}
