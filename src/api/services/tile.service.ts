import axiosClient from '@/api';
import { ApiError } from '../errors';
import { AxiosError } from 'axios';
import type { SchoolDTO } from '../dto/school.dto';

export default {
  getTile05ByLatLong: async (lat: number, long: number) =>
    axiosClient
      .get<{ schools: SchoolDTO[] }>(`/tiles/0.5/${lat}/${long}/schools`)
      .then(({ data }) => data.schools)
      .catch((reason) => {
        if (!(reason instanceof AxiosError)) throw new ApiError(reason);
        const message = reason.response?.data.message;
        throw new ApiError(message ?? reason.cause?.message ?? 'Unknown error');
      }),
};
