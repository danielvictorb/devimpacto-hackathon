/**
 * Paleta de Cores do Sabiar
 *
 * Baseada no design do passarinho Sabiar:
 * - Laranja (#d1663d) - peito do passarinho
 * - Azul Petróleo (#294f5c) - penas do passarinho
 */

export const sabiarColors = {
  orange: "#d1663d",
  teal: "#294f5c",
} as const;

/**
 * Uso:
 *
 * import { sabiarColors } from '@/lib/colors'
 *
 * // Para usar diretamente:
 * <div style={{ backgroundColor: sabiarColors.orange }}>
 *
 * // Ou use as classes Tailwind do tema:
 * <div className="bg-primary"> // Azul petróleo (#294f5c)
 * <div className="bg-secondary"> // Laranja (#d1663d)
 */
