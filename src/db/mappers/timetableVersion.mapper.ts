import type { OptivumVersionMetaDTO } from '@/api/dto/versionMeta.dto';
import type { TimetableVersionEntity } from '../entities/timetableVersion.entity';

export const mapOptivumVersionMetaDTOToEntity = (
  dto: OptivumVersionMetaDTO,
  schoolRspoId: number,
  data?: string,
): TimetableVersionEntity => ({
  id: `optivum/${dto.id}`,
  generatedOn: dto.generated_on,
  schoolRspoId,
  data: data ?? null,
});
