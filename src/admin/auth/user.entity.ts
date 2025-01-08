import { Column, Entity, BeforeInsert, OneToMany } from 'typeorm';
import * as crypto from 'crypto';
import { MasterFields } from 'src/common/master-fields.entity';


@Entity({ name: 'users' })
export class User extends MasterFields {
    
    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    role: string;

    @BeforeInsert()
    async hashPassword() {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto
            .pbkdf2Sync(this.password, this.salt, 1000, 64, `sha512`)
            .toString(`hex`);
    }
}
