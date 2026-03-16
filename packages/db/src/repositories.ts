export interface RepositoryRecord {
  id: string;
}

export interface Repository<T extends RepositoryRecord> {
  create(input: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
}

export class InMemoryRepository<T extends RepositoryRecord> implements Repository<T> {
  private readonly store = new Map<string, T>();

  async create(input: T): Promise<T> {
    this.store.set(input.id, input);
    return input;
  }

  async findById(id: string): Promise<T | null> {
    return this.store.get(id) ?? null;
  }

  async update(id: string, patch: Partial<T>): Promise<T | null> {
    const existing = this.store.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...patch
    } as T;

    this.store.set(id, updated);
    return updated;
  }
}
