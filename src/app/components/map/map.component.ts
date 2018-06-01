import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';   //update rxjs
import 'rxjs/add/operator/map';

import { Map, Marker } from '../../models/map';
import { MapService } from '../../services/map/map.service';

import { } from '@types/google-maps';   //dev-dep for google library | could use google: any  | TEST if needed

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
  //ClientLogged = false;         //allow only 1 user logged at a time
  //draggedMarkerIndex: number;   //FOR DRAGGING


  constructor(private _Map: MapService,
    public _dialog: MatDialog,
    @Inject(NgZone) public _zone: NgZone, ) {
  }
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
      'http://localhost:8080/npmap.png',            //CHANGE WHEN DEPLOYED
      imageBounds
    );
    this.Overlay.setMap(this.Map);

    //CONFIG MAP w/ MARKERS | CONFIG CLIENT MODEL
    for (var i = 0; i < this.Model.Markers.length; i++) {
      var location = new google.maps.LatLng(this.Model.Markers[i].Position.lat, this.Model.Markers[i].Position.lng);
      var tempMapMarker = new google.maps.Marker({
        position: location,
        //draggable: true,    //FOR DRAGGING
        map: this.Map
      });
      this.Model.MapMarkers.push(tempMapMarker);

      //ATTACH LISTENERS (marker)
      tempMapMarker.addListener('click', (e) => {
        this._zone.run(() => {
          this.markerEdit(e.latLng);
        });
      });
      /*  FOR DRAGGING
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

    //ATTACH LISTENERS (map)
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
    console.log("Map configured");
  }


  markerCreate(location: google.maps.LatLng) {
    var tempModelMarker = new Marker();
    tempModelMarker.Position = { lat: location.lat(), lng: location.lng() };

    this._Map.addMarker(tempModelMarker).subscribe(
      (data) => {
        if (data.success) {
          console.log("Request success");
          console.log("Adding marker...");
          //ADD MARKER TO CLIENT MODEL
          this.Model.Markers.push(tempModelMarker);
          var tempMapMarker = new google.maps.Marker({
            position: location,
            //draggable: true,    //FOR DRAGGING
            map: this.Map
          });
          this.Model.MapMarkers.push(tempMapMarker);

          //ATTACH LISTENERS (marker)
          tempMapMarker.addListener('click', (e) => {
            this._zone.run(() => {
              this.markerEdit(e.latLng);
            });
          });
          /*  FOR DRAGGING
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
          console.log("Marker added")
        }
        else
          console.log("Request error");
      },
      (err) => {
        console.log(err);
      }
    );
  }

  markerEdit(location: google.maps.LatLng) {
    let editIndex = this.getMarkerIndex(location);
    let editMarker = this.Model.Markers[editIndex];

    let update = false;
    let updateimg = false;
    let updatemp3 = false;
    let updateicon = false;
    let imgfile: File;
    let mp3file: File;
    let iconfile: File;

    let dialogRef = this._dialog.open(MarkerEditDialog, {
      //width: '250px',
      data: { title: editMarker.Title, subtitle: editMarker.Subtitle, description: editMarker.Description }
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result != null) {
          console.log('Dialog submitted');

          if (result.delete) {
            this._Map.deleteMarker(editIndex).subscribe(
              (data) => {
                if (data.success) {
                  console.log("Request success");
                  console.log("Deleting marker...");
                  this.Model.MapMarkers.splice(editIndex, 1)[0].setMap(null);
                  this.Model.Markers.splice(editIndex, 1);
                  console.log("Marker deleted");
                }
                else {
                  console.log("Request error");
                  console.log("Marker not deleted");
                }
              },
              (err) => {
                console.log(err);
              }
            );
            return;
          }

          if (result.title != "" && result.title != editMarker.Title) {
            console.log("*title changed*");
            update = true;
            editMarker.Title = result.title;
          }
          if (result.subtitle != "" && result.subtitle != editMarker.Subtitle) {
            console.log("*subtitle changed*");
            update = true;
            editMarker.Subtitle = result.subtitle;
          }
          if (result.description != "" && result.description != editMarker.Description) {
            console.log("*description changed*");
            update = true;
            editMarker.Description = result.description;
          }
          if (result.imgfile != null) {
            console.log("*imgfile changed*");
            updateimg = true;
            imgfile = result.imgfile;
          }
          if (result.iconfile != null) {
            console.log("*iconfile changed*");
            updateicon = true;
            iconfile = result.iconfile;
          }
          if (result.mp3file != null) {
            console.log("*mp3file changed*");
            updatemp3 = true;
            mp3file = result.mp3file;
          }
          if (update) {
            this._Map.editMarker(editIndex, editMarker).subscribe(
              (data) => {
                if (data.success) {
                  console.log("Request success");
                  console.log("Editing marker...");
                  this.Model.Markers[editIndex] = editMarker;
                  console.log("Marker edited");
                }
                else {
                  console.log("Request error");
                  console.log("Marker not edited");

                }
              },
              (err) => {
                console.log(err);
              }
            );
          }
          if (updatemp3) {
            this._Map.editMarkerAddMp3(editIndex, mp3file).subscribe(
              (data) => {
                if (data.success) {
                  console.log("Request success");
                  console.log("Adding audio to marker...");
                  //ADD MP3 TO CLIENT MODEL
                  this.Model.Markers[editIndex].Audio = data.name;
                  console.log("Marker audio added");
                }
                else {
                  console.log("Request error");
                  console.log("Audio not uploaded");

                }
              },
              (err) => {
                console.log(err);
              }
            );
          }
          if (updateicon) {
            this._Map.editMarkerAddIcon(editIndex, iconfile).subscribe(
              (data) => {
                if (data.success) {
                  console.log("Request success");
                  console.log("Adding icon to marker...");
                  //ADD MP3 TO CLIENT MODEL
                  this.Model.Markers[editIndex].Icon = data.name;
                  console.log("Marker icon added");
                }
                else {
                  console.log("Request error");
                  console.log("Audio not uploaded");

                }
              },
              (err) => {
                console.log(err);
              }
            );
          }
          if (updateimg) {
            this._Map.editMarkerAddImg(editIndex, imgfile).subscribe(
              (data) => {
                if (data.success) {
                  console.log("Request success");
                  console.log("Adding image to marker...");
                  //ADD IMG TO CLIENT MODEL
                  this.Model.Markers[editIndex].Image = data.name;
                  console.log("Marker image added");
                }
                else {
                  console.log("Request error");
                  console.log("Image not uploaded");

                }
              },
              (err) => {
                console.log(err);
              }
            );
          }
        }
        else if (!updateimg || !updatemp3 || !update)
          console.log('Dialog canceled');
      }
    );
  }


  getMarkerIndex = (location: google.maps.LatLng) =>
    this.Model.MapMarkers.findIndex(x => x.position.lat() == location.lat() && x.position.lng() == location.lng());

  /*  FOR DRAGGING
  markerDragstart(location: google.maps.LatLng) {
    this.draggedMarkerIndex = this.getMarkerIndex(location);
    console.log(this.draggedMarkerIndex);
  }
  markerDragend(location: google.maps.LatLng) {
    this.updateMarkerLocation(location, this.draggedMarkerIndex);
  }
  updateMarkerLocation = (endLocation: google.maps.LatLng, index: number) => {
    this.Model.Markers[index].Position.lat = endLocation.lat();
    this.Model.Markers[index].Position.lat = endLocation.lat();
    this.Model.MapMarkers[index].Position(endLocation);
  }
  */
}





@Component({
  selector: 'app-map',
  templateUrl: './map.dialog.component.html',
  styleUrls: ['./map.component.css']
})
export class MarkerEditDialog {
  imgFileToUpload: File = null;
  iconFileToUpload: File = null;
  mp3FileToUpload: File = null;

  constructor(
    public dialogRef: MatDialogRef<MarkerEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    let data = { delete: true };
    this.dialogRef.close(data);
  }

  onSubmit(data) {
    data.delete = false;
    if (this.imgFileToUpload != null) {
      console.log("Submitting w/ image...");
      data.imgfile = this.imgFileToUpload;
    }
    else
      console.log("Submitting w/o image...");

    if (this.iconFileToUpload != null) {
      console.log("Submitting w/ icon...");
      data.iconfile = this.iconFileToUpload;
    }
    else
      console.log("Submitting w/o image...");

    if (this.mp3FileToUpload != null) {
      console.log("Submitting w/ mp3...");
      data.mp3file = this.mp3FileToUpload;
    }
    else
      console.log("Submitting w/o mp3...");

    this.dialogRef.close(data);
  }


  appendImgToForm(files: FileList) {
    console.log("Appending image to form data...");
    this.imgFileToUpload = files.item(0);
    console.log(this.imgFileToUpload);
    console.log("Image appened to form data");
  }

  appendIconToForm(files: FileList) {
    console.log("Appending icon to form data...");
    this.iconFileToUpload = files.item(0);
    console.log(this.iconFileToUpload);
    console.log("Icon appened to form data");
  }

  appendMp3ToForm(files: FileList) {
    console.log("Appending audio to form data...");
    this.mp3FileToUpload = files.item(0);
    console.log(this.mp3FileToUpload);
    console.log("Audio appened to form data");
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
    */