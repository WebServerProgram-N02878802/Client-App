import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Username = "";
  Password = "";

  constructor(private _Login: LoginService) { 
  }

  ngOnInit() {
  }

  loginClick(username: string, password: string) {
    this._Login.login(username, password);
  }

  userViewClick() {
    this._Login.redirectUserView();
  }

}
