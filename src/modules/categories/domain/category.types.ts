export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  active?: boolean;
}

export type CategoryUpsertInput = {
  name: string;
  slug?: string;
  description?: string;
  active?: boolean;
};
