import { Component, OnInit, Inject, NgZone } from '@angular/core';
//import { Http } from '@angular/http';

import { Map, Marker } from '../../models/map';
import { MapService } from '../../services/map/map.service';
import { MessageService } from '../../services/messages/message.service';

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
  draggedMarkerIndex: number;


  constructor(private _Map: MapService,
    private _Message: MessageService,
    public _dialog: MatDialog,
    @Inject(NgZone) public _zone: NgZone) {
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
    //todo: push marker to server via service
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
    var editMarkerInject = this.findModelMarker(location);

    let dialogRef = this._dialog.open(MarkerEditDialog, {
      //width: '250px',
      data: { title: editMarkerInject.Title }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result.title != "") 
        editMarkerInject.Title = result.title;
    });

    this.setModelMarker(location, editMarkerInject);
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



  findModelMarker = (location: google.maps.LatLng) =>
    this.Model.Markers.find(x => x.Position.lat == location.lat() && x.Position.lng == location.lng());
  findMapMarker = (location: google.maps.LatLng) =>
    this.Model.MapMarkers.find(x => x.Position.lat == location.lat() && x.Position.lng == location.lng());
  setModelMarker = (location: google.maps.LatLng, newMarker: Marker) => 
    this.Model.Markers[this.getMarkerIndex(location)] = newMarker;
  updateMarkerLocation = (endLocation: google.maps.LatLng, index: number) => {
    this.Model.Markers[index].Position.lat = endLocation.lat();
    this.Model.Markers[index].Position.lat = endLocation.lat();
    this.Model.MapMarkers[index].Position(endLocation);
  }
  getMarkerIndex = (location: google.maps.LatLng) =>
    this.Model.MapMarkers.indexOf(x => x.Position.lat == location.lat() && x.Position.lng == location.lng());
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

  onCancel(data){
    data.submit = false;
    this.dialogRef.close(data);
  }

  onSubmit(data){
    data.submit = true;
    this.dialogRef.close(data);
  }
}


    /*
      FEATURES:
      CREATE MARKER
      EDIT MARKER
      DELETE MARKER
      DRAG MARKER

      MARKER ICON (remove/add)
      MARKER IMGs  ...
      MARKER AUDIO
      MARKER TEXT
      MARKER LINKS/SHARE

      DISCLAIMER
      SETTINGS

      DOCUMENTATION/GUIDE
    */