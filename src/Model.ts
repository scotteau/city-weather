export interface City {
  name: string; //sydney
  lat: number; // latitude
  lng: number; //longtitude
  cover: {
    day: CardImage;
    night: CardImage;
  }; // urls for current cover - day & night
  backupImages: {
    day: CardImage[]; // backup day photos urls
    night: CardImage[]; // backup night photos urls
  };
}

export class CardImage {
  url: string;
  id: string;
  link: string;
  altDescription: string;

  constructor(url: string, id: string, link: string, altDescription: string) {
    this.url = url;
    this.id = id;
    this.link = link;
    this.altDescription = altDescription;
  }
}

export enum Mode {
  light,
  dark,
}

export class Weather {
  date: number;
  temp: number;
  description: string;

  constructor(date: number, temp: number, description: string) {
    this.date = date;
    this.temp = temp;
    this.description = description;
  }
}

export enum CardAction {
  PUBLISH,
  REFRESH,
  DELETE,
}

export enum NavAction {
  ADD_A_CITY,
  TOGGLE_EDIT,
  TOGGLE_THEME
}

export interface Report {
  current: Weather;
  daily: Weather[];
}

