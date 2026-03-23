import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { MissionService } from './mission.service';
import type { CreateMission } from './mission.interface';
@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('summary')
  getSummary() {
    return this.missionService.getSummary();
  }

  @Get()
  findAll() {
    return this.missionService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('clearance') clearance: string = 'STANDARD',
  ) {
    return this.missionService.findOne(id, clearance);
  }

  @Post()
  create(@Body() body: CreateMission) {
    return this.missionService.create(body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.missionService.delete(id);
  }
}
