import { Module } from '@nestjs/common';
import { MissionModule } from './mission/mission.module';
import { MissionController } from './mission/mission.controller';
import { MissionService } from './mission/mission.service';

@Module({
  imports: [MissionModule],
  controllers: [MissionController],
  providers: [MissionService],
})
export class AppModule {}
