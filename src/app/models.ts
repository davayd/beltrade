export interface TenderItem {
  shortDescription: string;
  customerName: string;
  country: string;
  id: string;
  cost: string;
  offersTo: string;
  href: string;
  isFavorite: boolean;
}

export interface IndustryItem {
  name: string;
  value: string;
  isChecked: boolean;
}
