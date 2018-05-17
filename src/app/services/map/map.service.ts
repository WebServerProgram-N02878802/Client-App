import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Rx'; //alternatives?
import 'rxjs/add/operator/map';

import { Map, Marker } from '../../models/map';

//injectable -> may have dependencies injected into service
@Injectable()
export class MapService {

  private _api = "/map"; 

  constructor(private http: Http) { }
  
  refresh(): Observable<Map> {
    console.log("retrieving state");
    return this.http.get(this._api + "/state").map(res => res.json());
  }

  addMarker(tmarker: Marker): Observable<any> {
    console.log("adding marker");
    return this.http.post(this._api + "/add", { marker: tmarker });
  }

  editMarker(tmarker: Marker): Observable<any> {
    console.log("editing marker: " + tmarker.Position.lat + ", " + tmarker.Position.lng);
    return this.http.post(this._api + "/edit", { marker: tmarker });
  }

  delMarker(tmarker: Marker): Observable<any> {
    console.log("deleting marker");
    return this.http.post(this._api + "/del", { marker: tmarker });
  }



    
  


}
