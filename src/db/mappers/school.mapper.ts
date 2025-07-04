import type { SchoolDTO } from '@/api/dto/school.dto';
import type { SchoolEntity } from '../entities/school.entity';

export const mapSchoolDTOToEntity = (dto: SchoolDTO, lastSyncAt?: Date): SchoolEntity => ({
  rspoId: dto.rspo_id,
  name: dto.name,
  teryt: dto.teryt,
  geoLat: dto.geo_lat,
  geoLong: dto.geo_long,
  parentRspoId: dto.parent_rspo_id,
  addressStreet: dto.address_street,
  addressBuildingNumber: dto.address_building_number,
  addressApartamentNumber: dto.address_apartament_number,
  addressZipCode: dto.address_zip_code,
  addressTown: dto.address_town,
  websiteUrl: dto.website_url,
  lastOpenedAt: null,
  lastSyncAt: lastSyncAt ?? null,
});
