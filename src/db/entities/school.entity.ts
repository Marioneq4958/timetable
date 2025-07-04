import type { EntityTable } from 'dexie';

export interface SchoolEntity {
  rspoId: number;
  name: string;
  teryt: string;
  geoLat: number;
  geoLong: number;
  parentRspoId: number | null;
  addressStreet: string;
  addressBuildingNumber: string;
  addressApartamentNumber: string;
  addressZipCode: string;
  addressTown: string;
  websiteUrl: string | null;
  lastOpenedAt: Date | null;
  lastSyncAt: Date | null;
}

export type SchoolsTable = EntityTable<SchoolEntity, 'rspoId'>;
