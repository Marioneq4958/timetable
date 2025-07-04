import Dexie from 'dexie';
import type { SchoolsTable } from '@/db/entities/school.entity';
import type { TimetableVersionsTable } from './entities/timetableVersion.entity';

export const db = new Dexie('timetable-db') as Dexie & {
  schools: SchoolsTable;
  timetableVersions: TimetableVersionsTable;
};

db.version(1).stores({
  schools:
    'rspoId, name, teryt, geoLat, geoLong, parentRspoId, addressStreet, addressBuildingNumber, addressApartamentNumber, addressZipCode, addressTown, websiteUrl, lastOpenedAt, lastSyncAt',
  timetableVersions: 'id, schoolRspoId, generatedOn, data',
});
