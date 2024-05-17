import axios from "axios";
import type { School, TimetableVersionData } from "./types";

export async function getSchoolById(rspoId: number) {
  const { data } = await axios.get<School>(
    `https://tapi.dk-gl.eu/v1/schools/${rspoId}`
  );
  return data;
}

export async function getOptivumVersion(
  rspoId: number,
  generatedOn: string,
  discriminant: number
) {
  const { data } = await axios.get<TimetableVersionData>(
    `https://tapi.dk-gl.eu/v1/schools/${rspoId}/optivum-versions/${generatedOn}/${discriminant}`
  );
  return data;
}
