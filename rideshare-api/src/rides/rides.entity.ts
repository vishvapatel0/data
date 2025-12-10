import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity('rides')
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  passengerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'passengerId' })
  passenger: User;

  @Column({ nullable: true })
  driverId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driverId' })
  driver: User;

  @Column()
  pickupLocation: string;

  @Column()
  dropoffLocation: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fare: number;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}
