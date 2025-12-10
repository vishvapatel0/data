import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RidesService } from './rides.service';
import { RideOwnerGuard } from '../common/guards/ride-owner.guard';

class CreateRideDto {
  pickupLocation: string;
  dropoffLocation: string;
}

@Controller('rides')
@UseGuards(AuthGuard('jwt'))
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get()
  async findAll(@Request() req) {
    return this.ridesService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @UseGuards(RideOwnerGuard)
  async findOne(@Param('id') id: number) {
    const ride = await this.ridesService.findOne(id);
    if (!ride) {
      throw new NotFoundException('Ride not found');
    }
    return ride;
  }

  @Post()
  async create(@Request() req, @Body() createRideDto: CreateRideDto) {
    return this.ridesService.create(req.user.id, createRideDto);
  }

  @Put(':id/accept')
  @UseGuards(AuthGuard('jwt'))
  async accept(@Param('id') id: number, @Request() req) {
    if (req.user.role !== 'driver' && req.user.role !== 'admin') {
      throw new ForbiddenException('Only drivers can accept rides');
    }
    return this.ridesService.acceptRide(id, req.user.id);
  }

  @Put(':id/complete')
  @UseGuards(RideOwnerGuard)
  async complete(@Param('id') id: number, @Request() req) {
    const ride = await this.ridesService.findOne(id);
    if (ride.driverId !== req.user.id && req.user.role !== 'admin') {
      throw new ForbiddenException('Only the assigned driver can complete this ride');
    }
    return this.ridesService.completeRide(id);
  }

  @Delete(':id')
  @UseGuards(RideOwnerGuard)
  async cancel(@Param('id') id: number, @Request() req) {
    const ride = await this.ridesService.findOne(id);
    if (ride.passengerId !== req.user.id && req.user.role !== 'admin') {
      throw new ForbiddenException('Only the passenger can cancel this ride');
    }
    return this.ridesService.cancelRide(id);
  }
}
