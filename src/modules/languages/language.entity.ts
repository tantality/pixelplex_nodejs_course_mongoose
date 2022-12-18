import { Entity, Column, Index } from 'typeorm';
import { CommonEntity } from '../../entities';
import { MAX_NAME_LENGTH, MAX_CODE_LENGTH } from './languages.constants';

@Entity('languages')
@Index(['createdAt'])
export class Lang extends CommonEntity {
  @Column({ type: 'varchar', length: MAX_NAME_LENGTH })
    name!: string;

  @Column({ type: 'varchar', length: MAX_CODE_LENGTH, unique: true })
    code!: string;
}
