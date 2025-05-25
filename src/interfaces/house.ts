export interface HouseHead {
  id: string;
  firstName: string;
  lastName: string;
}

export interface HouseTrait {
  id: string;
  name: string;
}

export interface HouseInterface {
  id: string;
  name: string;
  houseColours: string;
  founder: string;
  animal: string;
  element: string;
  ghost: string;
  commonRoom: string;
  heads: HouseHead[];
  traits: HouseTrait[];
  housePoints?: number;
}