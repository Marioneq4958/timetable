import axios from "axios";
import type { School } from "./types";

export async function getSchoolById(rspoId: number) {
  const { data } = await axios.get<School>(
    `https://tapi.dk-gl.eu/v1/schools/${rspoId}`
  );
  return data;
}
