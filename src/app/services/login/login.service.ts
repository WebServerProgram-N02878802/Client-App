import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx'; //alternatives?
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {
  

  private serverdir = "/p/f18-01";
  private _api = this.serverdir + "/login";

  clientLogged: boolean;

  constructor(private http: Http, private _Router: Router) { }

  login(username: string, password: string) {
    console.log("Sending login request...");
    this.http.post(this._api + "/verify", { username: username, password: password }).map(res => res.json()).subscribe(
      (res) => {
        if(res.success) {
          this.clientLogged = true;
          this._Router.navigate(['/client/map']);
        }
      }
    );
  }

  redirectLogin() {
    this._Router.navigate(['/login']);
  }

  redirectUserView() {
    this._Router.navigate(['/user/map']);
  }
}
