export interface School {
  rspo_id: number;
  name: string;
  geo_lat: number;
  geo_long: number;
  parent_rspo_id: number | null;
  teryt: string;
  address_street: string;
  address_building_number: string;
  address_apartament_number: string;
  address_zip_code: string;
  address_town: string;
  optivum_versions: { generated_on: string; discriminant: number }[];
}
