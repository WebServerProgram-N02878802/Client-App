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
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  Map: google.maps.Map;
  Overlay: google.maps.GroundOverlay;
  Model = new Map();
  //ClientLogged = false; //allow only 1 user logged at a time
  //draggedMarkerIndex: number;
  recentEdit = new Marker();

  constructor(private _Map: MapService,
    public _dialog: MatDialog,
    @Inject(NgZone) public _zone: NgZone, ) {
  }
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
          this.markerEdit(e.latLng);
        });
      });
    }



    this.Overlay.addListener('dblclick', (e) => {
      this._zone.run(() => {
        this.markerCreate(e.latLng);
      });
    });
    this.Map.addListener('dblclick', (e) => {
      this._zone.run(() => {
        this.markerCreate(e.latLng);
      });
    });
  }



  markerCreate(location: google.maps.LatLng) {
    var tempModelMarker = new Marker();
    tempModelMarker.Position = { lat: location.lat(), lng: location.lng() };
    this._Map.addMarker(tempModelMarker).subscribe();

    this.Model.Markers.push(tempModelMarker);
    console.log(this.Model.Markers[this.Model.Markers.length - 1].Position);
    var tempMapMarker = new google.maps.Marker({
      position: location,
      //draggable: true,
      map: this.Map
    });
    this.Model.MapMarkers.push(tempMapMarker);


    //attached listeners
    tempMapMarker.addListener('click', (e) => {
      this._zone.run(() => {
        this.markerEdit(e.latLng);
      });
    });
    /*
    tempMapMarker.addListener('dragstart', (e) => {
      this._zone.run(() => {
        this.markerDragstart(e.latLng);
      });
    });
    tempMapMarker.addListener('dragend', (e) => {
      this._zone.run(() => {
        this.markerDragend(e.latLng);
      });
    });
    */
  }




  markerEdit(location: google.maps.LatLng) {
    //replace with fixed 'findModelMarker' method
    //replace with local editmarker var -> bug fixed
    this.recentEdit = this.Model.Markers.find(x => (x.Position.lat == location.lat() && x.Position.lng == location.lng()));
    console.log("editing: " + this.recentEdit.Position.lat + ", " + this.recentEdit.Position.lng);

    var update = false;

    let dialogRef = this._dialog.open(MarkerEditDialog, {
      //width: '250px',
      data: { title: this.recentEdit.Title, description: this.recentEdit.Description }
    });
    dialogRef.afterClosed().subscribe( result => {
      console.log('The dialog was closed');
      if (result.title !== "" && result.title !== this.recentEdit.Title) {
        console.log("title changed");
        update = true;
        this.recentEdit.Title = result.title;
      }
      if (result.description !== "" && result.description !== this.recentEdit.Description) {
        console.log("description changed");
        update = true;
        this.recentEdit.Description = result.description;
      }
      if (update) {
        console.log("submitting edit: " + this.recentEdit.Position.lat + ", " + this.recentEdit.Position.lng);
        this.setModelMarker(location, this.recentEdit);
        this._Map.editMarker(this.recentEdit).subscribe();
      }
    });
  }
  




  markerDel(location: google.maps.LatLng) {
    var tempModelMarker = this.findModelMarker(location);
    this._Map.delMarker(tempModelMarker).subscribe();
    this.delModelMarker(location);
    this.delMapMarker(location);
  }




  /*
  markerDragstart(location: google.maps.LatLng) {
    this.draggedMarkerIndex = this.getMarkerIndex(location);
    console.log(this.draggedMarkerIndex);
  }
  markerDragend(location: google.maps.LatLng) {
    this.updateMarkerLocation(location, this.draggedMarkerIndex);
  }
  */


  findModelMarker = (location: google.maps.LatLng) => this.Model.Markers.find(x => (x.Position.lat == location.lat() && x.Position.lng == location.lng()));
  findMapMarker = (location: google.maps.LatLng) =>
    this.Model.MapMarkers.find(x => (x.Position.lat == location.lat() && x.Position.lng == location.lng()));
  setModelMarker = (location: google.maps.LatLng, newMarker: Marker) =>
    this.Model.Markers[this.getMarkerIndex(location)] = newMarker;
  delModelMarker = (location: google.maps.LatLng) =>
    this.Model.Markers.splice(this.getMarkerIndex(location), 1);
  delMapMarker = (location: google.maps.LatLng) =>
    this.Model.MapMarkers.find(x => x.position == location).setMap(null);
  /*
  updateMarkerLocation = (endLocation: google.maps.LatLng, index: number) => {
    this.Model.Markers[index].Position.lat = endLocation.lat();
    this.Model.Markers[index].Position.lat = endLocation.lat();
    this.Model.MapMarkers[index].Position(endLocation);
  }
  */
  getMarkerIndex = (location: google.maps.LatLng) =>
    this.Model.MapMarkers.indexOf(x => (x.Position.lat == location.lat() && x.Position.lng == location.lng()));
}







@Component({
  selector: 'app-map',
  templateUrl: './map.dialog.component.html',
  styleUrls: ['./map.component.css']
})
export class MarkerEditDialog {

  constructor(
    public dialogRef: MatDialogRef<MarkerEditDialog>,
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


    /*
      FEATURES:
      CREATE MARKER
      EDIT MARKER
      DELETE MARKER
      //DRAG MARKER

      MARKER ICON (remove/add)
      MARKER IMGs  ...
      MARKER AUDIO
      MARKER TEXT

      DISCLAIMER
      SETTINGS
      LOGIN

      DOCUMENTATION/GUIDE

      1) fix modal -> have fields update upon data save
      2) pass input to server (service -> express)
      3) save data in js model (use index sent from client to insert)
      4) load server data at init -> update map 

      6) create client view

      7) add img/mp3 processing
    */