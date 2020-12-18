export interface Tag {
  __v?: string;
  _id: string;
  title: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Numpad: {tag: Tag} | undefined;
};
