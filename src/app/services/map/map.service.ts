import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Map, Marker } from '../../models/map';

//injectable -> may have dependencies injected into service
@Injectable()
export class MapService {

  private serverdir = "/p/f18-01";
  private _api = this.serverdir + "/map";

  constructor(private http: Http) { }

  refresh(): Observable<any> {
    console.log("Sending refresh request...");
    return this.http.get(this._api + "/state").map(res => res.json());
  }

  editCenter(tposition: any, tzoom: number): Observable<any> {
    console.log("Sending edit center position request...");
    return this.http.post(this._api + "/center", { position: tposition, zoom: tzoom }).map(res => res.json());
  }

  addMarker(tmarker: Marker): Observable<any> {
    console.log("Sending add marker request...");
    return this.http.post(this._api + "/add", { marker: tmarker }).map(res => res.json());
  }

  deleteMarker(tindex: number): Observable<any> {
    console.log("Sending delete marker request...");
    return this.http.post(this._api + "/delete", { index: tindex }).map(res => res.json());
  }

  dragMarker(tindex: number, tposition: any): Observable<any> {
    console.log("Sending drag marker request...");
    return this.http.post(this._api + "/drag", { index: tindex, position: tposition }).map(res => res.json());
  }

  editMarker(tindex: number, tmarker: Marker): Observable<any> {
    console.log("Sending edit marker text request...");
    return this.http.post(this._api + "/edit", { marker: tmarker, index: tindex }).map(res => res.json());
  }

  editMarkerAddImg(tindex: number, file: File): Observable<any> {
    console.log("Sending edit marker image request...");
    let formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('index', String(tindex));

    /*
    let headers = new Headers();
    // In Angular 5, including the header Content-Type can invalidate your request
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    */

    return this.http.post(this._api + "/edit/image/add", formData).map(res => res.json());
  }

  editMarkerAddIcon(tindex: number, file: File): Observable<any> {
    console.log("Sending edit marker icon request...");
    let formData = new FormData();
    formData.append('icon', file, file.name);
    formData.append('index', String(tindex));

    return this.http.post(this._api + "/edit/icon/add", formData).map(res => res.json());
  }

  editMarkerAddMp3(tindex: number, file: File): Observable<any> {
    console.log("Sending edit marker audio request...");
    let formData = new FormData();
    formData.append('mp3', file, file.name);
    formData.append('index', String(tindex));

    return this.http.post(this._api + "/edit/mp3/add", formData).map(res => res.json());
  }

  editMarkerAddMarkerIcon(tindex: number, file: File): Observable<any> {
    console.log("Sending edit marker markericon request...");
    let formData = new FormData();
    formData.append('markericon', file, file.name);
    formData.append('index', String(tindex));

    return this.http.post(this._api + "/edit/markericon/add", formData).map(res => res.json());
  }
}
