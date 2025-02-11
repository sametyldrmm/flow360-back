import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags("User")
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
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
  findAll() {
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
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
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
  @ApiBody({
    schema: {
      example: {
        firstName: 'Mehmet',
        lastName: 'Öz'
      }
    }
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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  //@UseGuards(JwtAuthGuard)
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı sil' })
  @ApiParam({
    name: 'id',
    description: 'Kullanıcı ID',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı başarıyla silindi'
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
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
    try {
        await this.userService.verifyPasswordResetCode(email, code);
    } catch (error) {
      console.log("statusCode: 401");
      return { statusCode: 401, message: 'Hata' };  
    }

    console.log("statusCvvffode: 200");
    return { statusCode: 200, message: 'Kod doğrulandı' };
  }

  @Get('email/:email')
  async getUserIdByEmail(@Param('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      return { id: user.id };
    } catch (error) {
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
    try {
        await this.userService.updatePassword(email, password);
        return { statusCode: 200, message: 'Kod doğrulandı' };
      } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }
      throw new InternalServerErrorException('Şifre güncellenirken bir hata oluştu');
    }
  }
}
