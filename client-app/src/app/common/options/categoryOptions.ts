export interface CategoryOption {
  key: any; 
  value: any, 
  text: string;
};

export const categoryOptions: CategoryOption[] = [
    { key: 'drinks', value: 'drinks', text: 'Drinks' },
    { key: 'culture', value: 'culture', text: 'Culture' },
    { key: 'film', value: 'film', text: 'Film' },
    { key: 'food', value: 'food', text: 'Food' },
    { key: 'music', value: 'music', text: 'Music' },
    { key: 'travel', value: 'travel', text: 'Travel' },
]