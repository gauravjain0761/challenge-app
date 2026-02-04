import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipLoader?: boolean;
  }
}
