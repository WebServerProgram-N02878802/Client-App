import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx'; //alternatives?
import 'rxjs/add/operator/map';

import { Map, Marker } from '../../models/map';

//injectable -> may have dependencies injected into service
@Injectable()
export class MapService {

  private _api = "/map";

  constructor(private http: Http) { }

  refresh(): Observable<any> {
    console.log("Sent refresh request...");
    return this.http.get(this._api + "/state").map(res => res.json());
  }

  addMarker(tmarker: Marker): Observable<any> {
    console.log("Sent add marker request...");
    return this.http.post(this._api + "/add", { marker: tmarker }).map(res => res.json());
  }

  deleteMarker(tindex: number): Observable<any> {
    console.log("Sent delete marker request...");
    return this.http.post(this._api + "/delete", { index: tindex }).map(res => res.json());
  }

  editMarker(tindex: number, tmarker: Marker): Observable<any> {
    console.log("Sent edit marker request...");
    return this.http.post(this._api + "/edit", { marker: tmarker, index: tindex }).map(res => res.json());
  }

  editMarkerAddImg(tindex: number, file: File): Observable<any> {
    console.log("Sent edit marker (add img) request...");
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
    console.log("Sent edit marker (add icon) request...");
    let formData = new FormData();
    formData.append('icon', file, file.name);
    formData.append('index', String(tindex));

    /*
    let headers = new Headers();
    // In Angular 5, including the header Content-Type can invalidate your request
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    */

    return this.http.post(this._api + "/edit/icon/add", formData).map(res => res.json());
  }

  editMarkerAddMp3(tindex: number, file: File): Observable<any> {
    console.log("Sent edit marker (add mp3) request...");
    let formData = new FormData();
    formData.append('mp3', file, file.name);
    formData.append('index', String(tindex));

    /*
    let headers = new Headers();
    // In Angular 5, including the header Content-Type can invalidate your request
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    */

    return this.http.post(this._api + "/edit/mp3/add", formData).map(res => res.json());
  }
}
