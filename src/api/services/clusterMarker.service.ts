import axiosClient from '@/api';
import { ApiError } from '../errors';
import type { ClusterMarkerDTO } from '../dto/clusterMarker.dto';
import { AxiosError } from 'axios';

export default {
  getClusterMarkersForCommunes: async () =>
    axiosClient
      .get<{ markers: ClusterMarkerDTO[] }>(`/cluster-markers/commune`)
      .then(({ data }) => data.markers)
      .catch((reason) => {
        if (!(reason instanceof AxiosError)) throw new ApiError(reason);
        const message = reason.response?.data.message;
        throw new ApiError(message ?? reason.cause?.message ?? 'Unknown error');
      }),
};
