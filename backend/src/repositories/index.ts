// Base Repository Interface or Helper
export interface BaseRepository<T> {
  find?(id: string): Promise<T | null>;
  list?(): Promise<T[]>;
}
