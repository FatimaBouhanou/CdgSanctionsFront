// src/app/models/sanctions.model.ts
export interface Sanction {
  id: number;
  schema: string;
  name: string;
  aliases: string;
  birth_date: string;
  identifiers: string;
  emails: string;
  phones: string;
  addresses: string;
  countries: string;
  dataset: string;
  first_seen: string;
  last_seen: string;
  last_change: string;
  type: string;
}
