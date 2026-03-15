export interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}

export type CategoryUpsertInput = {
  name: string;
  slug: string;
  displayOrder: number;
};
