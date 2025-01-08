import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
var moment = require('moment');

@Entity()
export abstract class MasterFields {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    created_at: number;
    
    @Column()
    updated_at: number;
    
    @Column({ select: false })
    deleted_at: number;

    @BeforeInsert()
    beforeInsertActions() {
        this.created_at = moment(Date.now()).unix();
        this.updated_at = moment(Date.now()).unix();
    }

    @BeforeUpdate()
    beforeUpdateActions() {
        this.updated_at = moment(Date.now()).unix();
    }
}