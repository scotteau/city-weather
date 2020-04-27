export interface City {
    name: string; //sydney
    lat: number; // latitude
    lng: number; //longtitude
    cover: {
        day: Image;
        night: Image;
    }; // urls for current cover - day & night
    backupImages: {
        day: Image[]; // backup day photos urls
        night: Image[]; // backup night photos urls
    };
}

export class Image {
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
