import Dexie, { type EntityTable } from "dexie";

export interface DBTimetableVersion {
  id: string;
  data: string;
}

export const db = new Dexie("timetable-db") as Dexie & {
  versions: EntityTable<DBTimetableVersion, "id">;
};
db.version(1).stores({
  versions: "id, data",
});
