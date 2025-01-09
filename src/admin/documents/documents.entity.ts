import { MasterFields } from 'src/common/master-fields.entity';
import { Column, Entity} from 'typeorm';

@Entity({ name: 'documents' })
export class Documents extends MasterFields {
    
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: number;

    @Column()
    document_image: string;
    
}
