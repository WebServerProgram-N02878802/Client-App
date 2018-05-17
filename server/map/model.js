function Map() {
    //remove 'this.' -> vars become property of Map() or global
    this.Markers = [];
    this.MapMarkers = [];
    this.Title = "NP MAP";
    this.Position = {lat: 41.748, lng: -74.083};
    this.Zoom = 16;
    
    this.addMarker = (marker) => {
        console.log("add marker");
        this.Markers.push(marker);
    };
    this.editMarker = (marker) => {
        console.log("edit marker");
        this.Markers.splice(this.Markers.indexOf( x => x.Position == marker.Position), 1, marker);
    };
    this.delMarker = (marker) => {
        console.log("del marker");
        this.Markers.splice(this.Markers.indexOf( x => x.Position == marker.Position), 1);
    }
}

function Marker() {
    this.Position = {lat, lng};
    this.Title = "";
    this.Description = "";
}

module.exports = Map; //export Marker too?