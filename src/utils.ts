import type { School } from "./api/types";

export function getFullAddress(school: School) {
  let fullAddress = `${school.address_street} ${school.address_building_number}`;
  if (school.address_apartament_number !== "")
    fullAddress += `/${school.address_apartament_number}`;
  fullAddress += `, ${school.address_zip_code} ${school.address_town}`;
  return fullAddress;
}
