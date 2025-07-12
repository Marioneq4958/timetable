import axiosClient from '@/api';
import type { SchoolDTO, SchoolWithVersionsDTO } from '@/api/dto/school.dto';
import { AxiosError } from 'axios';
import { ApiError, SchoolNotFoundError } from '../errors';

export default {
  getSchoolById: async (id: number) =>
    axiosClient
      .get<SchoolWithVersionsDTO>(`/schools/${id}`)
      .then(({ data }) => data)
      .catch((reason) => {
        if (!(reason instanceof AxiosError)) throw new ApiError(reason);
        const message = reason.response?.data.message;
        switch (message) {
          case 'Entity not found':
            throw new SchoolNotFoundError();
          default:
            throw new ApiError(message ?? reason.cause?.message ?? 'Unknown error');
        }
      }),

  getSchoolsByTeryt: async (teryt: string) =>
    axiosClient
      .get<{ schools: SchoolDTO[] }>(`/schools`, { params: { teryt } })
      .then(({ data }) => data.schools)
      .catch((reason) => {
        if (!(reason instanceof AxiosError)) throw new ApiError(reason);
        const message = reason.response?.data.message;
        throw new ApiError(message ?? reason.cause?.message ?? 'Unknown error');
      }),
};
