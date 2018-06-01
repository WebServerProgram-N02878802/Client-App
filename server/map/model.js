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
    this.editMarker = (index, marker) => {
        console.log("edit marker");
        this.Markers.splice(index, 1, marker);
    };
    this.editMarkerAddImg = (index, dir, name) => {
        console.log("edit marker (add img)");
        this.Markers[index].Image = name;
    }
    this.editMarkerAddIcon = (index, dir, name) => {
        console.log("edit marker (add icon)");
        this.Markers[index].Icon = name;
    }
    this.editMarkerAddMp3 = (index, dir, name) => {
        console.log("edit marker (add mp3)");
        this.Markers[index].Audio = name;
    }
    this.deleteMarker = (index) => {
        console.log("del marker");
        this.Markers.splice(index, 1);
    };
}

function Marker() {
    this.Position = {lat, lng};
    this.Title = "";
    this.Subtitle = ""
    this.Description = "";
    this.Image = "";
    this.Icon = "";
    this.Audio = "";
}
module.exports = Map; //export Marker too?