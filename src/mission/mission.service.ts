import { Injectable } from '@nestjs/common';
import { IMission } from './mission.interface';
import * as fs from 'fs';
@Injectable()
export class MissionService {
  private readonly missions = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' },
  ];

  getSummary(): Record<string, number> {
    return this.missions.reduce(
      (acc, mission) => {
        const status = mission.status;
        if (acc[status]) {
          acc[status]++;
        } else {
          acc[status] = 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  findAll() {
    const missions: IMission[] = JSON.parse(
      fs.readFileSync('data/missions.json', 'utf-8'),
    );

    return missions.map((mission) => {
      let durationDays: number;

      if (mission.endDate === null) {
        durationDays = -1;
      } else {
        const start = new Date(mission.startDate);
        const end = new Date(mission.endDate);

        durationDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      }

      return {
        ...mission,
        durationDays,
      };
    });
  }
}
