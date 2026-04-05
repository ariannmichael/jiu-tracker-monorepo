/**
 * Reference subscription price by country (store-localized; informational).
 * Extend when new App Store / Play pricing tiers are published.
 */
export type SubscriptionPriceByCountryRow = {
  countryPt: string;
  countryEn: string;
  price: string;
};

export const SUBSCRIPTION_PRICES_BY_COUNTRY: SubscriptionPriceByCountryRow[] = [
  { countryPt: "Afeganistão", countryEn: "Afghanistan", price: "$1.99" },
  { countryPt: "África do Sul", countryEn: "South Africa", price: "R 39.99" },
  { countryPt: "Albânia", countryEn: "Albania", price: "$1.99" },
  { countryPt: "Alemanha", countryEn: "Germany", price: "€1.99" },
  { countryPt: "Angola", countryEn: "Angola", price: "$1.99" },
  { countryPt: "Anguila", countryEn: "Anguilla", price: "$1.99" },
  {
    countryPt: "Antígua e Barbuda",
    countryEn: "Antigua and Barbuda",
    price: "$1.99",
  },
  { countryPt: "Arábia Saudita", countryEn: "Saudi Arabia", price: "SAR 9.99" },
  { countryPt: "Argélia", countryEn: "Algeria", price: "$1.99" },
  { countryPt: "Argentina", countryEn: "Argentina", price: "$1.99" },
  { countryPt: "Arménia", countryEn: "Armenia", price: "$1.99" },
  { countryPt: "Austrália", countryEn: "Australia", price: "$2.99" },
  { countryPt: "Áustria", countryEn: "Austria", price: "€1.99" },
  { countryPt: "Azerbaijão", countryEn: "Azerbaijan", price: "$1.99" },
  { countryPt: "Baamas", countryEn: "Bahamas", price: "$1.99" },
  { countryPt: "Barbados", countryEn: "Barbados", price: "$1.99" },
  { countryPt: "Barém", countryEn: "Bahrain", price: "$1.99" },
  { countryPt: "Bélgica", countryEn: "Belgium", price: "€1.99" },
  { countryPt: "Belize", countryEn: "Belize", price: "$1.99" },
  { countryPt: "Benim", countryEn: "Benin", price: "$1.99" },
  { countryPt: "Bermudas", countryEn: "Bermuda", price: "$1.99" },
];
