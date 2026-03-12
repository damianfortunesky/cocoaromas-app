import { mockPromotions } from '@/mocks/db';
export const mockPromotionsRepository = { async list() { return mockPromotions; }, async create(input: Omit<(typeof mockPromotions)[number], 'id'>) { const item = { ...input, id: `promo-${Date.now()}` }; mockPromotions.push(item); return item; } };
