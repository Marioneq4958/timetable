import { db } from '@/db';
import APIService from '@/api/services/timetableVersion.service';

export default {
  getAvaliableTimetableVersionsBySchool: async function (schoolRspoId: number) {
    return await db.timetableVersions.where('schoolRspoId').equals(schoolRspoId).toArray();
  },
  downloadTimetableVersionDataById: async function (timetableVersionId: string) {
    const data = await APIService.getTimetableVersionDataById(timetableVersionId);
    await db.timetableVersions.update(timetableVersionId, { data });
    return data;
  },
  deleteSavedTimetableVersionsBySchool: async function (schoolRspoId: number) {
    return await db.timetableVersions.where('schoolRspoId').equals(schoolRspoId).delete();
  },
};
