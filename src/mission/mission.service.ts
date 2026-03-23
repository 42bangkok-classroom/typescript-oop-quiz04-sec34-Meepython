import { Injectable, NotFoundException } from '@nestjs/common';
import { IMission, CreateMission } from './mission.interface';
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
    ) as IMission[];

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

  findOne(id: string, clearance: string) {
    const missions = JSON.parse(
      fs.readFileSync('data/missions.json', 'utf-8'),
    ) as IMission[];

    const mission = missions.find((m) => m.id === id);

    if (!mission) {
      throw new NotFoundException();
    }

    const isHighRisk =
      mission.riskLevel === 'HIGH' || mission.riskLevel === 'CRITICAL';
    const hasAccess = clearance === 'TOP_SECRET';

    return {
      ...mission,
      targetName:
        isHighRisk && !hasAccess ? '***REDACTED***' : mission.targetName,
    };
  }

  create(body: CreateMission) {
    const missions = JSON.parse(
      fs.readFileSync('data/missions.json', 'utf-8'),
    ) as IMission[];

    const lastID = missions[missions.length - 1].id;
    const newID = (Number(lastID) + 1).toString();

    const newMission: IMission = {
      id: newID,
      codename: body.codename,
      status: 'ACTIVE',
      targetName: body.targetName,
      riskLevel: body.riskLevel,
      startDate: body.startDate,
      endDate: null,
    };

    missions.push(newMission);

    fs.writeFileSync('data/missions.json', JSON.stringify(missions, null, 2));

    return newMission;
  }

  remove(id: string) {
    const missions = JSON.parse(
      fs.readFileSync('data/missions.json', 'utf-8'),
    ) as IMission[];

    const mission = missions.find((m) => m.id === id);

    if (!mission) {
      throw new NotFoundException();
    }

    const updatedMissions = missions.filter((m) => m.id !== id);

    fs.writeFileSync(
      'data/missions.json',
      JSON.stringify(updatedMissions, null, 2),
    );

    return { message: `Mission ID ${id} has been successfully deleted.` };
  }
}
