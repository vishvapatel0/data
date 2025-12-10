import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './users/users.entity';
import { Ride } from './rides/rides.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { RidesController } from './rides/rides.controller';
import { RidesService } from './rides/rides.service';
import { RideOwnerGuard } from './common/guards/ride-owner.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [User, Ride],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Ride]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'demo-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, RidesController],
  providers: [AuthService, JwtStrategy, RidesService, RideOwnerGuard],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Ride)
    private ridesRepository: Repository<Ride>,
  ) {}

  async onModuleInit() {
    const count = await this.usersRepository.count();
    if (count === 0) {
      await this.seedDatabase();
    }
  }

  private async seedDatabase() {
    const users = [
      { email: 'admin@example.com', password: 'admin123', fullName: 'Admin User', role: 'admin' },
      { email: 'user1@example.com', password: 'user123', fullName: 'Passenger One', role: 'passenger' },
      { email: 'attacker@example.com', password: 'attacker123', fullName: 'Test Account', role: 'passenger' },
      { email: 'driver1@example.com', password: 'driver123', fullName: 'Driver One', role: 'driver' },
    ];

    for (const u of users) {
      const user = this.usersRepository.create({
        email: u.email,
        password: bcrypt.hashSync(u.password, 10),
        fullName: u.fullName,
        role: u.role,
      });
      await this.usersRepository.save(user);
    }

    const rides = [
      { passengerId: 2, pickupLocation: '123 Main St', dropoffLocation: '456 Oak Ave', fare: 25.50, status: 'pending' },
      { passengerId: 2, driverId: 4, pickupLocation: '789 Pine Rd', dropoffLocation: '321 Elm St', fare: 18.75, status: 'in_progress' },
      { passengerId: 3, pickupLocation: '555 Cedar Ln', dropoffLocation: '777 Maple Dr', fare: 32.00, status: 'pending' },
    ];

    for (const r of rides) {
      const ride = this.ridesRepository.create(r);
      await this.ridesRepository.save(ride);
    }
  }
}
