export type Entry = {
  id: string;
  image: string;
  address: string;
  title: string;
  notes: string;
  date?: string;
};

export type RootTabParamList = {
  Home: undefined;
  AddEntry: undefined;
};