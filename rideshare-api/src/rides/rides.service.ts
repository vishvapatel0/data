import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from './rides.entity';

@Injectable()
export class RidesService {
  constructor(
    @InjectRepository(Ride)
    private ridesRepository: Repository<Ride>,
  ) {}

  async findAll(userId: number, role: string): Promise<Ride[]> {
    if (role === 'admin') {
      return this.ridesRepository.find({ relations: ['passenger', 'driver'] });
    }
    return this.ridesRepository.find({
      where: [{ passengerId: userId }, { driverId: userId }],
      relations: ['passenger', 'driver'],
    });
  }

  async findOne(id: number): Promise<Ride | null> {
    return this.ridesRepository.findOne({
      where: { id },
      relations: ['passenger', 'driver'],
    });
  }

  async create(passengerId: number, data: Partial<Ride>): Promise<Ride> {
    const ride = this.ridesRepository.create({
      ...data,
      passengerId,
      status: 'pending',
      fare: this.calculateFare(data.pickupLocation, data.dropoffLocation),
    });
    return this.ridesRepository.save(ride);
  }

  async acceptRide(id: number, driverId: number): Promise<Ride> {
    const ride = await this.findOne(id);
    if (!ride || ride.status !== 'pending') {
      throw new Error('Ride cannot be accepted');
    }
    ride.driverId = driverId;
    ride.status = 'in_progress';
    return this.ridesRepository.save(ride);
  }

  async completeRide(id: number): Promise<Ride> {
    const ride = await this.findOne(id);
    if (!ride || ride.status !== 'in_progress') {
      throw new Error('Ride cannot be completed');
    }
    ride.status = 'completed';
    ride.completedAt = new Date();
    return this.ridesRepository.save(ride);
  }

  async cancelRide(id: number): Promise<Ride> {
    const ride = await this.findOne(id);
    if (!ride || ride.status === 'completed') {
      throw new Error('Ride cannot be cancelled');
    }
    ride.status = 'cancelled';
    return this.ridesRepository.save(ride);
  }

  private calculateFare(pickup: string, dropoff: string): number {
    return Math.round((Math.random() * 30 + 10) * 100) / 100;
  }
}
