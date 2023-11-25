import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm';
import { IsInt, IsString, IsOptional, IsNumber } from 'class-validator';

@Entity('userTable')
export class UserTable {
    @PrimaryGeneratedColumn()
    @IsInt()
    id: number;

    @Column({unique: true})
    @IsString()
    username: string;

    @Column()
    @IsString()
    password: string;

    @Column({default: 0})
    @IsInt()
    isActive: number;

    @Column({ default: 0 })
    @IsNumber()
    isVerified: number;

    @Column({nullable: true})
    @IsString()
    token: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({default: 1})
    @IsInt()
    createdBy: number;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({default: 1})
    @IsInt()
    updatedBy: number;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ nullable: true })
    @IsInt()
    deletedBy: number;

}
