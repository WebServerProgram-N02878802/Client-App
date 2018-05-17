import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx'; //alternatives?
import 'rxjs/add/operator/map';

import { Map, Marker } from '../../models/map';
import { MapService } from '../../services/map/map.service';

//dev-dep for google library | could use google: any
import { } from '@types/google-maps';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-user-map',
  templateUrl: './user-map.component.html',
  styleUrls: ['./user-map.component.css']
})
export class UserMapComponent implements OnInit {

  Map: google.maps.Map;
  Overlay: google.maps.GroundOverlay;
  Model = new Map();
  //ClientLogged = false; //allow only 1 user logged at a time
  //draggedMarkerIndex: number;
  recentEdit = new Marker();

  constructor(private _Map: MapService,
    public _dialog: MatDialog,
    @Inject(NgZone) public _zone: NgZone, ) { }

  ngOnInit() {
    this._Map.refresh().subscribe(res => { this.Model = res; this.refreshCallback(); });
  }



  refreshCallback() {
    this.Map = new google.maps.Map(document.getElementById('map'), {
      center: this.Model.Position,
      zoom: this.Model.Zoom,
      disableDefaultUI: true,
      disableDoubleClickZoom: true
    });



    var imageBounds = {
      north: 41.745563,
      south: 41.731452,
      east: -74.07833,
      west: -74.090992
    };
    this.Overlay = new google.maps.GroundOverlay(
      'http://localhost:8080/npmap.png',
      imageBounds
    );
    this.Overlay.setMap(this.Map);



    //populate map with server/model data
    for (var i = 0; i < this.Model.Markers.length; i++) {
      var location = new google.maps.LatLng(this.Model.Markers[i].Position.lat, this.Model.Markers[i].Position.lng);
      var tempMapMarker = new google.maps.Marker({
        position: location,
        //draggable: true,
        map: this.Map
      });
      this.Model.MapMarkers.push(tempMapMarker);

      //attached listeners
      tempMapMarker.addListener('click', (e) => {
        this._zone.run(() => {
          this.markerView(e.latLng);
        });
      });
    }
  }

  markerView(location: google.maps.LatLng) {
    //replace with fixed 'findModelMarker' method
    //replace with local editmarker var -> bug fixed
    this.recentEdit = this.Model.Markers.find(x => (x.Position.lat == location.lat() && x.Position.lng == location.lng()));
    console.log("editing: " + this.recentEdit.Position.lat + ", " + this.recentEdit.Position.lng);

    var update = false;

    let dialogRef = this._dialog.open(MarkerViewDialog, {
      //width: '250px',
      data: { title: this.recentEdit.Title, description: this.recentEdit.Description }
    });
    dialogRef.afterClosed().subscribe( result => {
      console.log('The dialog was closed');
    });
  }

}


@Component({
  selector: 'app-map',
  templateUrl: './user-map.dialog.component.html',
  styleUrls: ['./user-map.component.css']
})
export class MarkerViewDialog {

  constructor(
    public dialogRef: MatDialogRef<MarkerViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancel(data) {
    data.submit = false;
    this.dialogRef.close(data);
  }

  onSubmit(data) {
    data.submit = true;
    this.dialogRef.close(data);
  }
}
