import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Documents } from './documents.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryHelper } from 'src/common/helper/query.helper';
import { TimeHelper } from 'src/common/helper/time.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Documents,
    ]),
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    QueryHelper,
    TimeHelper
  ]
})
export class DocumentsModule {}
