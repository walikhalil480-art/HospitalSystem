export interface BaseRepository<T> {
    find?(id: string): Promise<T | null>;
    list?(): Promise<T[]>;
}
//# sourceMappingURL=index.d.ts.map