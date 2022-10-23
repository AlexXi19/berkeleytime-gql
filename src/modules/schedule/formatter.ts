import { ScheduleModule } from "./generated-types/module-types";
import { ScheduleType } from "./model";

export function formatSchedule(schedule: ScheduleType): ScheduleModule.Schedule {
  return {
    date_created: schedule.date_created.toString(),
    last_updated: schedule.last_updated.toString(),
    term: schedule.term.toString(),
  };
}