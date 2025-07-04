import { mapSchoolDTOToEntity } from '@/db/mappers/school.mapper';
import APIService from '@/api/services/school.service';
import { db } from '@/db';
import { mapOptivumVersionMetaDTOToEntity } from '@/db/mappers/timetableVersion.mapper';

const syncSchoolById = async function (id: number) {
  const fetched = await APIService.getSchoolById(id);
  const mapped = mapSchoolDTOToEntity(fetched, new Date());

  if (await db.schools.get(id)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { lastOpenedAt, ...mappedWithoutOpenedAt } = mapped;
    await db.schools.update(id, mappedWithoutOpenedAt);
  } else db.schools.add(mapped);

  await Promise.all(
    fetched.optivum_versions.map(async (optivumVersionMeta) => {
      if (await db.timetableVersions.get(`optivum/${optivumVersionMeta.id}`)) return;
      await db.timetableVersions.add(
        mapOptivumVersionMetaDTOToEntity(optivumVersionMeta, fetched.rspo_id),
      );
    }),
  );

  return mapped;
};

export default {
  syncSchoolById,
  getSchoolById: async function (id: number) {
    const saved = await db.schools.get(id);
    if (saved) return saved;

    return await syncSchoolById(id);
  },
  openSchool: async function (id: number) {
    await db.schools.update(id, { lastOpenedAt: new Date() });
  },
  getRecentSchools: async function () {
    return await db.schools.orderBy('lastOpenedAt').reverse().toArray();
  },
  deleteSavedSchoolById: async function (id: number) {
    await db.schools.delete(id);
  },
};
