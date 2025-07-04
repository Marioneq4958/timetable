import { computed } from 'vue';
import type { SchoolEntity } from './db/entities/school.entity';

export function getSchoolFullAddress(school: SchoolEntity) {
  let fullAddress = `${school.addressStreet} ${school.addressBuildingNumber}`;
  if (school.addressApartamentNumber !== '') fullAddress += `/${school.addressApartamentNumber}`;
  fullAddress += `, ${school.addressZipCode} ${school.addressTown}`;
  return fullAddress;
}

export function getTimeSlotTime(minutes: number) {
  return `${Math.trunc(minutes / 60)}:${(`00` + (minutes % 60).toString()).slice(-2)}`;
}

export function common<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  const value = array[0];
  return array.every((v) => v === value) ? value : undefined;
}

export const getEntitiesFromMap = <T>(map: Map<string, T>, ids: string[]) =>
  ids.map((id) => map.get(id)!);

export const notNullableComputed = <T>(value: T) =>
  computed(() => {
    if (value === null) throw new Error('Null value is not accepted!');
    return value as NonNullable<T>;
  });
