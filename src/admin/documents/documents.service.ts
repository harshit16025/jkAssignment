import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import { Repository } from 'typeorm';
import { QueryHelper } from 'src/common/helper/query.helper';
import { TimeHelper } from 'src/common/helper/time.helper';
import { paginate, Pagination, paginateRaw, paginateRawAndEntities } from 'nestjs-typeorm-paginate';

@Injectable()
export class DocumentsService {

    private logger = new Logger(DocumentsService.name);
    constructor(
    @InjectRepository(Documents)
        private readonly documentsRepository: Repository<Documents>,
        private readonly queryHelper: QueryHelper,
        private readonly timeHelper: TimeHelper,
    ) {
    }    

    /**
   * 
   * @param user_id      
   * @returns 
   */

  async getAllDocuments(params): Promise<any> {
    if (!params.sort) {
      params.sort = 'created_at'
    }
    const options = {
      page: params.page,
      limit: params.limit
    };
    const queryBuilder = this.documentsRepository.createQueryBuilder('c1').where('c1.deleted_at is null');    
    queryBuilder.select('c1.*')
    let qb = await this.queryHelper.prepareSearch(params, queryBuilder);
    // handle pagination 
    let result: any = new Object();
    if (params.skip_pagination === true) {
      //get data with pagination
      result["items"] = await qb.execute();
    } else {
      //get data with pagination
      let totalCount = await qb.getCount();
      result = await paginateRaw<Documents>(qb, options);
      result['meta']['totalItems'] = totalCount;
      result['meta']['totalPages'] = Math.ceil(totalCount / options.limit);
    }
    return new Pagination(
      await Promise.all(
        result.items.map(async (item) => {
          item.created_at = await this.timeHelper.formatTimestamptoString(
            item.created_at,
            params.timezone
          );
          item.document_image =  "documents/" +  item.document_image;
          return item;
        })
      ),
      result.meta,
      result.links
    );
  }

  public async createDocument(documentDto): Promise<any> {
    
    const document = this.documentsRepository.create(documentDto);
        var result = await this.documentsRepository.save(document);
        return result;
  }

  async getDocumentDetail(id): Promise<any> {
    var params = {};
          const queryBuilder = this.documentsRepository.createQueryBuilder('c1').where('c1.deleted_at is null');        
          queryBuilder.andWhere('c1.id = :id', { id : id });
          queryBuilder.select('c1.*');
          let qb = await this.queryHelper.prepareSearch(params, queryBuilder);
          let result: any = new Object();
          result = await qb.execute();
          return result;
  }

  /*
   * @param user
   */
  public async updateDocument(userDto): Promise<any> {    
    console.log(userDto)
    return await this.documentsRepository.save(userDto);
  }

  /**
   * Delete a document by its ID.
   */
  async deleteDocument(id: string): Promise<any> {
    return await this.documentsRepository.delete(id); // Delete the document from the database
  }


}
