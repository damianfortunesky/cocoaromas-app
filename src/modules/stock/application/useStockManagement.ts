import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stockApiRepository } from '@/modules/stock/infrastructure/stockApiRepository';
import { toStockUpdatePayload } from '@/modules/stock/domain/stock.rules';
import type { StockAuditDraft, StockItem, VariantStock } from '@/modules/stock/domain/stock.types';
import type { Role } from '@/shared/types/common';

const stockQueryKey = ['admin-stock'] as const;

const buildStockAuditDraft = (params: {
  item: StockItem;
  nextStock: number;
  role: Role;
}): StockAuditDraft => ({
  action: 'stock_updated',
  productId: params.item.productId,
  previousStock: params.item.totalStock,
  nextStock: params.nextStock,
  actorRole: params.role,
  happenedAt: new Date().toISOString()
});

export const useStockList = () =>
  useQuery({
    queryKey: stockQueryKey,
    queryFn: () => stockApiRepository.list()
  });

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { item: StockItem; nextStock: number; variantStock?: VariantStock[]; role: Role }) => {
      const payload = toStockUpdatePayload(params.item, params.nextStock, params.variantStock);
      const auditDraft = buildStockAuditDraft({ item: params.item, nextStock: payload.stock, role: params.role });

      void auditDraft;
      return stockApiRepository.update(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: stockQueryKey });
    }
  });
};
