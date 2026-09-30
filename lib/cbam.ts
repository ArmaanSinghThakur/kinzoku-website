// CBAM liability estimate: the same formula as the live calculator
// (content/_source/embeds/cbam-europe--ziy1bb.html).
export type CbamInput = {
  /** Emission factor of the steel route, tCO₂ per tonne of product. */
  factor: number;
  tonnes: number;
  /** EU ETS carbon price, € per tCO₂e. */
  price: number;
  /** Share of emissions that needs certificates in the given year (2026: 2.5%). */
  phaseInRate: number;
};

export function estimateCbam({ factor, tonnes, price, phaseInRate }: CbamInput) {
  const emissions = tonnes * factor;
  const certificates = emissions * phaseInRate;
  return { emissions, certificates, cost: certificates * price };
}

// Same number formats as the live calculator (en-US grouping, € prefix).
const upToTwo = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const exactlyTwo = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatCbam = {
  emissions: (n: number) => `${upToTwo.format(n)} tCO₂e`,
  certificates: (n: number) => upToTwo.format(n),
  cost: (n: number) => `€${exactlyTwo.format(n)}`,
};
