import { Component, OnInit, Inject, NgZone, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Map, Marker } from '../../models/map';
import { MapService } from '../../services/map/map.service';

import { } from '@types/google-maps';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-user-map',
  templateUrl: './user-map.component.html',
  styleUrls: ['./user-map.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMapComponent implements OnInit {

  Map: google.maps.Map;
  Overlay: google.maps.GroundOverlay;
  Model = new Map();
  Server = "cs.newpaltz.edu:10010";      //TEST CONFIGURATION | change after deployed eg. "localhost:8080"



  constructor(private _Map: MapService,
    public _dialog: MatDialog,
    @Inject(NgZone) public _zone: NgZone, ) { }

  ngOnInit() {
    this._Map.refresh().subscribe(
      (data) => {
        if (data.success) {
          console.log("Request success");
          this.Model = data.map;
          this.refreshCallback();
        }
        else
          console.log("Request error");
      },
      (err) => {
        console.log(err);
      }
    );
  }



  refreshCallback() {
    console.log("Configuring map...");

    //GENERATE MAP
    this.Map = new google.maps.Map(document.getElementById('map'), {
      center: this.Model.Position,
      zoom: this.Model.Zoom,
      disableDefaultUI: true,
      disableDoubleClickZoom: true
    });

    //CONFIG OVERLAY
    var imageBounds = {
      north: 41.745563,
      south: 41.731452,
      east: -74.07833,
      west: -74.090992
    };
    this.Overlay = new google.maps.GroundOverlay(
      "http://" + this.Server + "/npmap.png",
      imageBounds
    );
    this.Overlay.setMap(this.Map);

    //CONFIG MAP w/ MARKERS | CONFIG CLIENT MODEL
    for (var i = 0; i < this.Model.Markers.length; i++) {
      var location = new google.maps.LatLng(this.Model.Markers[i].Position.lat, this.Model.Markers[i].Position.lng);
      var tempMapMarker
      tempMapMarker = new google.maps.Marker({
        position: location,
        map: this.Map
      });
      if (this.Model.Markers[i].MarkerIcon != "") {
        tempMapMarker.setIcon("http://" + this.Server + "/" + this.Model.Markers[i].MarkerIcon);
      }
      this.Model.MapMarkers.push(tempMapMarker);

      //ATTACH EVENT LISTENERS TO MARKERS
      tempMapMarker.addListener('click', (e) => {
        this._zone.run(() => {
          this.markerView(e.latLng);
        });
      });
    }
    console.log("Map configured");
  }



  markerView(location: google.maps.LatLng) {
    let editIndex = this.getMarkerIndex(location);
    let editMarker = this.Model.Markers[editIndex];
    console.log('The dialog was opened');

    let dialogRef = this._dialog.open(MarkerViewDialog, {
      data: { server: this.Server, title: editMarker.Title, subtitle: editMarker.Subtitle, description: editMarker.Description, iconsrc: editMarker.Icon, imgsrc: editMarker.Image, mp3src: editMarker.Audio }
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (dialogRef.componentInstance.audioplaying == true) {
          dialogRef.componentInstance.audio.pause();
        }
      }
    );
  }

  

  getMarkerIndex = (location: google.maps.LatLng) =>
    this.Model.MapMarkers.findIndex(x => x.position.lat() == location.lat() && x.position.lng() == location.lng());
}


@Component({
  selector: 'app-map',
  templateUrl: './user-map.dialog.component.html',
  styleUrls: ['./user-map.component.css']
})
export class MarkerViewDialog {
  audio;
  audioplaying;
  audiotext = "Listen";

  constructor(
    public dialogRef: MatDialogRef<MarkerViewDialog>,
    private _sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onClose() {
    if (this.audioplaying == true) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.dialogRef.close();
  }

  playMp3File(data) {
    if (this.audio == null) {
      this.audio = new Audio();
      this.audio.src = "http://" + data.server + "/" + data.mp3src;
      this.audio.load();
      this.audioplaying = false;
    }
    if (this.audioplaying) {
      this.audioplaying = !this.audioplaying;
      this.audiotext = "Listen";
      this.audio.pause();
    }
    else {
      this.audioplaying = !this.audioplaying;
      this.audiotext = "Pause";
      this.audio.play();
    }
  }

  rewindMp3File(data) {
    this.audio.currentTime -= 10;
  }

  getIconStyle(data) {
    const iconstyle = "background-image: url('http://" + data.server + "/" + data.iconsrc + "'); background-size: cover;";
    return this._sanitizer.bypassSecurityTrustStyle(iconstyle);
  }
}
