import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../common/roles.enum';

@ApiTags('Files')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('uploadImage/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cargar imagen del producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Imagen cargada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la carga de la imagen',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseUUIDPipe) productId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'Supera el peso máximo de 200kb',
          }),
          new FileTypeValidator({
            fileType: /.jpg|.jpeg|.png|.webp|svg/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileUploadService.uploadImage(file, productId);
  }
}
