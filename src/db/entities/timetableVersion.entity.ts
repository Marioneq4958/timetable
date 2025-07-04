import type { EntityTable } from 'dexie';

export interface TimetableVersionEntity {
  id: string;
  schoolRspoId: number;
  generatedOn: string;
  data: string | null;
}

export type TimetableVersionsTable = EntityTable<TimetableVersionEntity, 'id'>;
