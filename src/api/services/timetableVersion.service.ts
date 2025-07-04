import axiosClient from '@/api/index';
import { AxiosError } from 'axios';
import { ApiError, TimetableVersionNotFoundError } from '../errors';

export default {
  getTimetableVersionDataById: async (id: string) =>
    axiosClient
      .get(`/${id.replace('optivum/', 'optivum-versions/')}`)
      .then(({ data }) => data)
      .catch((reason) => {
        if (!(reason instanceof AxiosError)) throw new ApiError(reason);
        const message = reason.response?.data.message;
        switch (message) {
          case 'Entity not found':
            throw new TimetableVersionNotFoundError();
          default:
            throw new ApiError(message);
        }
      }),
};
