import { Colis } from '../colis/create-colis';

export type CityGroupingMode = 'origin' | 'destination';

export interface CityColisGroup {
  city: string;
  count: number;
  totalWeight: number;
  totalPrice: number;
  unpaidCount: number;
  pendingCount: number;
  transitCount: number;
  deliveredCount: number;
  colis: Colis[];
}

export interface CitySummaryItem {
  city: string;
  count: number;
  totalWeight: number;
}

/**
 * Group a list of Colis by city (either origin fromCity or destination toCity).
 * Sorts descending by parcel count or alphabetically.
 */
export function getColisGroupedByCity(
  colisList: Colis[],
  mode: CityGroupingMode = 'origin'
): CityColisGroup[] {
  const groupsMap = new Map<string, CityColisGroup>();

  colisList.forEach((colis) => {
    const rawCity = mode === 'origin' ? colis.fromCity : colis.toCity;
    const city = (rawCity && rawCity.trim()) ? rawCity.trim() : 'Ville non spécifiée';

    if (!groupsMap.has(city)) {
      groupsMap.set(city, {
        city,
        count: 0,
        totalWeight: 0,
        totalPrice: 0,
        unpaidCount: 0,
        pendingCount: 0,
        transitCount: 0,
        deliveredCount: 0,
        colis: [],
      });
    }

    const group = groupsMap.get(city)!;
    group.count += 1;
    group.totalWeight += Number(colis.weight) || 0;
    group.totalPrice += Number(colis.price) || 0;
    if (colis.isPaid === false) group.unpaidCount += 1;
    if (colis.status === 'pending') group.pendingCount += 1;
    if (colis.status === 'in_transit') group.transitCount += 1;
    if (colis.status === 'delivered') group.deliveredCount += 1;
    group.colis.push(colis);
  });

  // Sort groups by count descending, then alphabetically by city
  return Array.from(groupsMap.values()).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.city.localeCompare(b.city);
  });
}

/**
 * Fetch parcels specifically for one single city.
 * Example: fetchColisByCity(colisList, 'Agadir', 'origin') returns only Agadir parcels.
 */
export function fetchColisByCity(
  colisList: Colis[],
  cityName: string,
  mode: CityGroupingMode = 'origin'
): Colis[] {
  const normalizedTarget = cityName.trim().toLowerCase();
  return colisList.filter((colis) => {
    const city = mode === 'origin' ? colis.fromCity : colis.toCity;
    return (city || '').trim().toLowerCase() === normalizedTarget;
  });
}

/**
 * Get summary breakdown of cities and parcel counts (e.g., 2 Agadir, 2 Casablanca...)
 */
export function getCitySummaryList(
  colisList: Colis[],
  mode: CityGroupingMode = 'origin'
): CitySummaryItem[] {
  const groups = getColisGroupedByCity(colisList, mode);
  return groups.map((g) => ({
    city: g.city,
    count: g.count,
    totalWeight: Math.round(g.totalWeight * 10) / 10,
  }));
}

/**
 * Returns a human-friendly string summary of colis per city.
 * E.g., "2 colis de Agadir, 2 de Casablanca, 1 de Marrakech..."
 */
export function formatCitySummaryText(
  colisList: Colis[],
  mode: CityGroupingMode = 'origin'
): string {
  const summary = getCitySummaryList(colisList, mode);
  if (summary.length === 0) return 'Aucun colis disponible';

  return summary
    .map((s) => `${s.count} colis de ${s.city}`)
    .join(', ');
}
