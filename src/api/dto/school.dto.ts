import type { OptivumVersionMetaDTO } from './versionMeta.dto';

export interface SchoolDTO {
  rspo_id: number;
  name: string;
  teryt: string;
  geo_lat: number;
  geo_long: number;
  parent_rspo_id: number | null;
  address_street: string;
  address_building_number: string;
  address_apartament_number: string;
  address_zip_code: string;
  address_town: string;
  website_url: string | null;
}

export type SchoolWithVersionsDTO = SchoolDTO & { optivum_versions: OptivumVersionMetaDTO[] };
