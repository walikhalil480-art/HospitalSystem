// Base Service Interface or Helper
export interface BaseService {
  healthCheck?(): Promise<boolean>;
}
