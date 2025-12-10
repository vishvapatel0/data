import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';
import { TenantGuard } from '../common/guards/tenant.guard';

@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  findAll(@Request() req) {
    return this.documentsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @UseGuards(TenantGuard)
  findOne(@Param('id') id: string) {
    const document = this.documentsService.findOne(parseInt(id));
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  @Post()
  create(@Body() data: any, @Request() req) {
    return this.documentsService.create(data, req.user);
  }

  @Delete(':id')
  @UseGuards(TenantGuard)
  delete(@Param('id') id: string) {
    const success = this.documentsService.delete(parseInt(id));
    if (!success) {
      throw new NotFoundException('Document not found');
    }
    return { message: 'Document deleted' };
  }
}
