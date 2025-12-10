import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { RidesService } from '../../rides/rides.service';

@Injectable()
export class RideOwnerGuard implements CanActivate {
  constructor(private readonly ridesService: RidesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rideId = request.params.id;
    const user = request.user;

    const ride = await this.ridesService.findOne(rideId);
    
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    if (user.role === 'admin') {
      return true;
    }

    return ride.passengerId === user.id || ride.driverId === user.id;
  }
}
