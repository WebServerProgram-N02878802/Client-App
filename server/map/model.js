function Map() {
    //remove 'this.' -> vars become property of Map() or global
    this.Markers = [];
    this.MapMarkers = [];
    this.Title = "NP MAP";
    this.Position = {lat: 41.748, lng: -74.083};
    this.Zoom = 16;
}

function Marker() {
    this.Position = {lat, lng};
    this.Title = "";
}

module.exports = Map; //export marker too?