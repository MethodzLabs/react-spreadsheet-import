import { InfoWithSource } from "../../types"

export type Meta = { __index: string; __errors?: Error | null }
export type Error = { [key: string]: InfoWithSource }
export type Errors = { [id: string]: Error }
export type Profile = {
  themes: string[];
  languages: string[];
  targetCountries: string[];
  linkType: 'dofollow' | 'nofollow' | 'sponsored' | 'ugc' | string;
  nbMaxLinksClient: number;
  nbMaxLinksExternal: number;
  nbWords: number;
  sponso: boolean;
  isPrivate: boolean;
  isGoogleNews: boolean;
  validityDuration: number; // in days/months/etc., depending on use case
  category: string;
  categoryUrl: string;
  redactionType: 'internal' | 'external' | 'client' | string;
  priceWithoutRedaction: number | null,
  priceWithRedaction: number | null,
  additionnalPriceCrypto: number | null,
  additionnalPriceHealth: number | null,
  additionnalPriceCBD: number | null,
  additionnalPriceSex: number | null,
  additionnalPriceFinance: number | null,
  additionnalPriceCasino: number | null,
  additionalPriceSponso: number | null,
  additionalPriceDofollow: number | null,
  pricePer100Words: number | null
};
