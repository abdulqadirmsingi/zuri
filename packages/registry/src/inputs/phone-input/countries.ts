export interface Country {
  /** ISO 3166-1 alpha-2 code, such as "TZ". */
  iso: string;
  /** English name. Pass your own list for other languages. */
  name: string;
  /** International dialling code without the plus, such as "255". */
  dial: string;
}

/**
 * A starting list of countries and their international dialling codes, sorted by name. It is not
 * exhaustive: pass your own `countries` to add, remove or translate. Shared codes (such as +1) are
 * listed once per country.
 */
export const COUNTRIES: readonly Country[] = [
  { iso: "AO", name: "Angola", dial: "244" },
  { iso: "AR", name: "Argentina", dial: "54" },
  { iso: "AU", name: "Australia", dial: "61" },
  { iso: "BD", name: "Bangladesh", dial: "880" },
  { iso: "BE", name: "Belgium", dial: "32" },
  { iso: "BW", name: "Botswana", dial: "267" },
  { iso: "BR", name: "Brazil", dial: "55" },
  { iso: "BI", name: "Burundi", dial: "257" },
  { iso: "CM", name: "Cameroon", dial: "237" },
  { iso: "CA", name: "Canada", dial: "1" },
  { iso: "CL", name: "Chile", dial: "56" },
  { iso: "CN", name: "China", dial: "86" },
  { iso: "CO", name: "Colombia", dial: "57" },
  { iso: "CD", name: "Congo (DR)", dial: "243" },
  { iso: "CI", name: "Côte d'Ivoire", dial: "225" },
  { iso: "DK", name: "Denmark", dial: "45" },
  { iso: "EG", name: "Egypt", dial: "20" },
  { iso: "ET", name: "Ethiopia", dial: "251" },
  { iso: "FI", name: "Finland", dial: "358" },
  { iso: "FR", name: "France", dial: "33" },
  { iso: "DE", name: "Germany", dial: "49" },
  { iso: "GH", name: "Ghana", dial: "233" },
  { iso: "IN", name: "India", dial: "91" },
  { iso: "ID", name: "Indonesia", dial: "62" },
  { iso: "IE", name: "Ireland", dial: "353" },
  { iso: "IT", name: "Italy", dial: "39" },
  { iso: "JP", name: "Japan", dial: "81" },
  { iso: "KE", name: "Kenya", dial: "254" },
  { iso: "MW", name: "Malawi", dial: "265" },
  { iso: "MY", name: "Malaysia", dial: "60" },
  { iso: "MX", name: "Mexico", dial: "52" },
  { iso: "MA", name: "Morocco", dial: "212" },
  { iso: "MZ", name: "Mozambique", dial: "258" },
  { iso: "NA", name: "Namibia", dial: "264" },
  { iso: "NL", name: "Netherlands", dial: "31" },
  { iso: "NZ", name: "New Zealand", dial: "64" },
  { iso: "NG", name: "Nigeria", dial: "234" },
  { iso: "NO", name: "Norway", dial: "47" },
  { iso: "PK", name: "Pakistan", dial: "92" },
  { iso: "PH", name: "Philippines", dial: "63" },
  { iso: "PL", name: "Poland", dial: "48" },
  { iso: "PT", name: "Portugal", dial: "351" },
  { iso: "QA", name: "Qatar", dial: "974" },
  { iso: "RW", name: "Rwanda", dial: "250" },
  { iso: "SA", name: "Saudi Arabia", dial: "966" },
  { iso: "SN", name: "Senegal", dial: "221" },
  { iso: "SG", name: "Singapore", dial: "65" },
  { iso: "SO", name: "Somalia", dial: "252" },
  { iso: "ZA", name: "South Africa", dial: "27" },
  { iso: "KR", name: "South Korea", dial: "82" },
  { iso: "SS", name: "South Sudan", dial: "211" },
  { iso: "ES", name: "Spain", dial: "34" },
  { iso: "SE", name: "Sweden", dial: "46" },
  { iso: "CH", name: "Switzerland", dial: "41" },
  { iso: "TZ", name: "Tanzania", dial: "255" },
  { iso: "TH", name: "Thailand", dial: "66" },
  { iso: "TR", name: "Türkiye", dial: "90" },
  { iso: "UG", name: "Uganda", dial: "256" },
  { iso: "AE", name: "United Arab Emirates", dial: "971" },
  { iso: "GB", name: "United Kingdom", dial: "44" },
  { iso: "US", name: "United States", dial: "1" },
  { iso: "VN", name: "Vietnam", dial: "84" },
  { iso: "ZM", name: "Zambia", dial: "260" },
  { iso: "ZW", name: "Zimbabwe", dial: "263" },
];
