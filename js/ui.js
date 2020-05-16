import {
    API
} from './api.js';

export class UI {
    constructor() {
        //instantiate API
        this.api = new API();
        //create markers with layerGroup
        this.markers = new L.layerGroup();
        this.map = this.initializeMap();
    }

    initializeMap() {
        const map = L.map('map').setView([-31.2532183, 146.921099], 5);
        const linkMap = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + linkMap + ' Contributors',
                maxZoom: 18,
            }).addTo(map);
        return map;
    }

    showGasStations() {
        this.api.getFuelStation()
            .then(data => {
                const stations = data.responseJSON.stations;
                //show the markers
                this.showMarkers(stations);
            })
            .catch(error => {
                console.log(error)
            });
    }

    showMarkers(stations) {
        //clean markers
        this.markers.clearLayers();

        stations.forEach(station => {
            const {
                location,
                address,
                brand
            } = station;
            //build popup
            const optionsPopup = L.popup()
                .setContent(`
                <p><b>Address</b>: ${address}</p>
                <p>Brand: ${brand}</p>
            `);
            //add marker
            const marker = new L.marker([
                parseFloat(location.latitude),
                parseFloat(location.longitude)
            ]).bindPopup(optionsPopup);
            //add each marker to the markers group
            this.markers.addLayer(marker);
        });
        //add markers to the map
        this.markers.addTo(this.map);
    }

    getSuggestions(search) {
        this.api.getFuelStation()
            .then(data => {
                const results = data.responseJSON.stations;
                //filter
                this.filterSuggestion(results, search);
            })
    }

    filterSuggestion(results, search) {
        const filter = results.filter(filter => filter.brand.indexOf(search) !== -1);
        //show markers
        this.showMarkers(filter);
    }

    mergeStationsPrices(arr1, arr2) {

    }
}