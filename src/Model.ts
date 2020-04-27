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

export interface OpenWeatherResType {
  lat: number;
  lon: number;
  timezone: string;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: [
      {
        id: number;
        main: string;
        description: string;
        icon: string;
      }
    ];
  };
  daily: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    weather: [
      {
        id: number;
        main: string;
        description: string;
        icon: string;
      }
    ];
    clouds: number;
    uvi: number;
  }[];
}
