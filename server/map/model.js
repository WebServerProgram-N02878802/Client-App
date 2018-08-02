function Map() {
    //remove 'this.' -> vars become property of Map() or global
    this.Markers = [];
    this.MapMarkers = [];
    this.Title = "NP MAP";
    this.Position = {lat: 41.7381177795104, lng: -74.08553111760597};
    this.Zoom = 17;
    
    
    this.initMarker = (lat, lng, title, subtitle, description, image, icon, audio, markericon) => {
        var tempmarker = new Marker();
        tempmarker.Position.lat = lat;
        tempmarker.Position.lng = lng;
        tempmarker.Title = title;
        tempmarker.Subtitle = subtitle;
        tempmarker.Description = description;
        tempmarker.Image = image;
        tempmarker.Icon = icon;
        tempmarker.Audio = audio;
        tempmarker.MarkerIcon = markericon;
        this.Markers.push(tempmarker);
    }
    this.editPosition = (position) => {
        this.Position = {lat: position.lat, lng: position.lng};
    }
    this.editZoom = (zoom) => {
        this.Zoom = zoom;
    }
    this.addMarker = (marker) => {
        this.Markers.push(marker);
    };
    this.editMarker = (index, marker) => {
        this.Markers.splice(index, 1, marker);
    };
    this.dragMarker = (index, position) => {
        this.Markers[index].Position.lat = position.lat;
        this.Markers[index].Position.lng = position.lng;
    }
    this.editMarkerAddImg = (index, dir, name) => {
        this.Markers[index].Image = name;
    }
    this.editMarkerAddIcon = (index, dir, name) => {
        this.Markers[index].Icon = name;
    }
    this.editMarkerAddMp3 = (index, dir, name) => {
        this.Markers[index].Audio = name;
    }
    this.editMarkerAddMarkerIcon = (index, dir, name) => {
        this.Markers[index].MarkerIcon = name;
    }
    this.deleteMarker = (index) => {
        this.Markers.splice(index, 1);
    };
}

function Marker() {
    this.Position = {lat: 0, lng: 0};
    this.Title = "";
    this.Subtitle = ""
    this.Description = "";
    this.Image = "";
    this.Icon = "";
    this.Audio = "";
    this.MarkerIcon = "";
}
module.exports = Map;