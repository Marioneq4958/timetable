import { ComputedRef, inject, InjectionKey } from 'vue';
import { CacheMode } from 'src/api/requests';
import { DefaultsMap, bangDecode } from 'src/utils';
import { VLoClient } from 'src/api/v-lo';
import { TableData, UnitType } from 'src/api/common';
import { OptivumClient } from 'src/api/optivum';

export interface ClassListItem {
  unit: string;
  name: string;
}

export interface BaseClient {
  tri: string;
  key: string;
  getClassList(cacheMode: CacheMode): Promise<ClassListItem[]>;
  getTitle(cacheMode: CacheMode): Promise<string>;
  supportsOffsets: boolean;
  getLessons(
    cacheMode: CacheMode,
    unitType: UnitType,
    unit: string,
    offset: number,
  ): Promise<TableData>;
  getLessonsOfAllClasses(cacheMode: CacheMode, offset: number): Promise<TableData[]>;
  getUnitNameMapper(cacheMode: CacheMode): Promise<(unitType: UnitType, unit: string) => string>;
}

export type Client = VLoClient | OptivumClient;

export const clientSymbol = Symbol('API Client Symbol') as InjectionKey<ComputedRef<Client | undefined>>;

export const useClientRef = () => {
  const client = inject(clientSymbol);
  if (client === undefined) throw new Error('Client reference not provided');
  return client;
};

const clientCache = new DefaultsMap<string, Client>((tri: string) => {
  const parts = tri.split(',');
  switch (parts[0]) {
    case 'v-lo': {
      if (parts.length > 1) throw new Error(`Too many parts in TRI "${tri}"`);
      return new VLoClient();
    }
    case 'o': {
      if (parts.length !== 4) throw new Error(`Wrong number of parts in TRI "${tri}"`);
      const [, variant, encodedBaseUrl, encodedListPath] = parts;
      const baseUrl = bangDecode(encodedBaseUrl);
      const listPath = bangDecode(encodedListPath);
      switch (variant) {
        case '0': return new OptivumClient(baseUrl, listPath);
        case '1': return new OptivumClient(`http://${baseUrl}`, listPath);
        case '2': return new OptivumClient(`https://${baseUrl}`, listPath);
        default: throw new Error(`Unknown variant "${variant}" in TRI ${tri}`);
      }
    }
  }
  throw new Error(`Unknown variant "${parts[0]}" in TRI "${tri}"`);
});

export const getClient = (tri: string) => clientCache.get(tri);
