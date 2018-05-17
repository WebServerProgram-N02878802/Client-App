
export class Map {
    Markers: Marker[] = [];
    MapMarkers = [];
    Title: string;
    Position: {lat: number, lng: number};
    Zoom: number;
}

export class Marker {
    Position: {lat: number, lng: number};
    Title: string;
    Description: string;
}