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
    return this.http.get(this._api + "/state").map(res => res.json());
  }

  



    
  


}
