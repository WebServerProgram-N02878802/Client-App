import { Component, OnInit } from '@angular/core';
//import http module
//import models

//dev-dep for google library | could use google: any
import { } from '@types/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map;

  constructor() {

   }

  ngOnInit() {
    console.log("ngINIT");
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  }

}
