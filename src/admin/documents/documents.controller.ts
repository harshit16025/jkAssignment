import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import  { extname } from 'path';
import { diskStorage } from 'multer';
import { AddDocumentsDto } from './dto/add-documnets.dto';
const fs = require("fs-extra");

@ApiBearerAuth()
@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {

    private readonly logger = new Logger(DocumentsController.name);

    constructor(
        private readonly documentsService: DocumentsService,
        
    ) { 

    }

    /**
     * API to list all the documents 
     * @param params 
     */
    @Get()
    @ApiOperation({ summary: 'Get All Documents' })
    @ApiResponse({
        status: 200,
        description: 'Documents listed successfully',
    })
    @ApiQuery({ name: 'queryterm', type: 'string', required: false })
    async getAllDocuments(@Query() params): Promise<IResponse> {
        try {
            // 
            const documentsList = await this.documentsService.getAllDocuments(params);
            return new ResponseSuccess('Documents listed successfully', documentsList);

        } catch (error) {
            this.logger.error(`Error in fetching documents list ${error}`);
            return new ResponseError(
                error.message || 'Something went wrong',
                error.data || {},
                error.statusCode
            );
        }
    }


    /**
   *
   * @param AddDocumentDto
   */
    @Post()
    @ApiConsumes("multipart/form-data")
    @ApiOperation({ summary: "Upload Documents" })
    @ApiResponse({ 
            status: 200,
            description: 'Documents added successfully', 
          })
    @ApiBody({
      schema: {
        type: "object",
        properties: {
          file: {
            type: "string",
            format: "binary",
          },
        },
      },
    })

    @UseInterceptors(
      FileInterceptor("file", {
        fileFilter: (req: any, file: any, cb: any) => {
          const allowedExt = [".pdf",".csv",".txt"];
          if (allowedExt.includes(extname(file.originalname))) {
            cb(null, true);
          } else {
            cb(
              new HttpException(
                {
                  file: `Unsupported file type! Please upload file in allowed formats only (.pdf , .csv , .txt)`,
                },
                HttpStatus.UNPROCESSABLE_ENTITY
              ),
              false
            );
          }
        },
        storage: diskStorage({
          destination: (req, file, callback) => {
            const path =
              process.env.FILE_UPLOAD_PATH +  "documents";
            fs.mkdirsSync(path, { recursive: true });
            callback(null, path);
          },
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            //Calling the callback passing the random name generated with the original extension name
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      })
    )
    async addDocument(
      @UploadedFile() file,
      @Req() req,
      @Body() addDocumentDto : AddDocumentsDto,
    ) {
      try {

        if (!file) {
           
           throw new HttpException(
                {
                  file: `File is required! Please upload a file.`,
                },
                HttpStatus.UNPROCESSABLE_ENTITY
              )
          }

        addDocumentDto['document_image'] = file.filename;
        addDocumentDto['status'] = 1;
        const result = await this.documentsService.createDocument(addDocumentDto); 
        return new ResponseSuccess(
          'Document Created Successfully',
          result,
          HttpStatus.OK,
        );
      } catch (error) {
        this.logger.error(error);
        return new ResponseError(
          error.message,
          error,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }


    /**
     * API to fetch detail of a particular document
     * @param params 
     */
  @Get(":id")
  @ApiOperation({ summary: 'Get documents detail for particular id.' })
  @ApiResponse({
      status: 200,
      description: 'Documents detail listed successfully',
  })
  async getDocumentsDetail(@Param("id") id: number,@Query() params): Promise<IResponse> {
      try {
          const expieryDate = await this.documentsService.getDocumentDetail(id);
          // const expieryDate = {}
          return new ResponseSuccess('Documents detal fetched successfully', expieryDate);
        } catch (error) {
          this.logger.error(
            `Documents detail fetching failed: ${error?.message}`
          );
          return new ResponseError(
            error?.message || "Something went wrong",
            error.data || {},
            error.statusCode
          );
      }
  }

  /**
   * Update a document (PDF, CSV, TXT) file.
   * 
   * 
   */
  @Put(':id')
@ApiConsumes("multipart/form-data")
@ApiOperation({ summary: "Upload File" })
@ApiResponse({ 
        status: 200,
        description: 'Blogs added successfully', 
      })
@ApiBody({
  schema: {
    type: "object",
    properties: {
      file: {
        type: "string",
        format: "binary",
      },
    },
  },
})

@UseInterceptors(
  FileInterceptor("file", {
    fileFilter: (req: any, file: any, cb: any) => {
      const allowedExt = [".pdf",".csv",".txt"];
      if (allowedExt.includes(extname(file.originalname))) {
        cb(null, true);
      } else {
        cb(
          new HttpException(
            {
              file: `Unsupported file type! Please upload file in allowed formats only (.pdf , .csv , .txt)`,
            },
            HttpStatus.UNPROCESSABLE_ENTITY
          ),
          false
        );
      }
    },
    storage: diskStorage({
      destination: (req, file, callback) => {
        const path =
          process.env.FILE_UPLOAD_PATH +  "documents";
        fs.mkdirsSync(path, { recursive: true });
        callback(null, path);
      },
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  })
)
  async updateDocument(
    @Param('id') id: string, 
    @UploadedFile() file,   
    @Body() updateDocumentDto: AddDocumentsDto,
  ) {
    try {
        
      const result = await this.documentsService.getDocumentDetail(id);
      const existingDocument= result[0]
      console.log(existingDocument)
      if (!existingDocument) {
        throw new HttpException(
          {
            message: 'Document not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (file) {
        const oldFilePath = process.env.FILE_UPLOAD_PATH + '/documents/' + existingDocument.document_image;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Delete the old file
        }
        updateDocumentDto['id'] = existingDocument.id
        updateDocumentDto['document_image'] = file.filename;
      } else {
        updateDocumentDto['document_image'] = existingDocument.document_image;
      }
      updateDocumentDto['status'] = existingDocument.status; // Keep the same status as the existing document
      console.log(updateDocumentDto)
      const updatedDocument = await this.documentsService.updateDocument(JSON.parse(JSON.stringify(updateDocumentDto)));

      // Return the updated document
      return new ResponseSuccess(
        'Document Updated Successfully',
        updatedDocument,
        HttpStatus.OK,
      );
    } catch (error) {
      // Log error and return an error response
      console.error(error);
      return new ResponseError(
        error.message,
        error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a document and its associated file
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Document' })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Document not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async deleteDocument(@Param('id') id: string) {
    try {
      // Find the document by ID
      const result = await this.documentsService.getDocumentDetail(id);
      const document = result[0];
      if (!document) {
        throw new HttpException(
          { message: 'Document not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Delete the file from the server (if it exists)
      const filePath = process.env.FILE_UPLOAD_PATH +  "documents/" + document.document_image;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }

      // Call the service to delete the document from the database
      await this.documentsService.deleteDocument(id);

      return new ResponseSuccess(
        'Document deleted successfully',
        {},
        HttpStatus.OK,
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        { message: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}




