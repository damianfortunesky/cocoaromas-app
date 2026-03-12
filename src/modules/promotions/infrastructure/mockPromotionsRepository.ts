import { mockPromotions } from '@/mocks/db';
import type { Promotion, PromotionUpsertInput } from '@/modules/promotions/domain/promotion.types';

const delay = async () => new Promise((resolve) => setTimeout(resolve, 250));

export const mockPromotionsRepository = {
  async list(): Promise<Promotion[]> {
    await delay();
    return [...mockPromotions];
  },
  async create(input: PromotionUpsertInput): Promise<Promotion> {
    await delay();
    const item: Promotion = { ...input, id: `promo-${Date.now()}` };
    mockPromotions.push(item);
    return item;
  },
  async update(id: string, input: PromotionUpsertInput): Promise<Promotion> {
    await delay();
    const index = mockPromotions.findIndex((promotion) => promotion.id === id);
    if (index < 0) throw new Error('Promoción no encontrada.');

    const updated = { ...mockPromotions[index], ...input, id };
    mockPromotions[index] = updated;
    return updated;
  },
  async toggle(id: string, active: boolean): Promise<Promotion> {
    await delay();
    const promotion = mockPromotions.find((item) => item.id === id);
    if (!promotion) throw new Error('Promoción no encontrada.');

    promotion.active = active;
    return promotion;
  },
  async remove(id: string): Promise<void> {
    await delay();
    const index = mockPromotions.findIndex((promotion) => promotion.id === id);
    if (index >= 0) {
      mockPromotions.splice(index, 1);
    }
  }
};
