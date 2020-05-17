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
                const prices = data.responseJSON.prices;
                const allPrices = this.mergePricesObjectsByKey(prices);
                let stations_prices = this.mergeStationsPrices(stations, allPrices);
                this.showMarkers(stations_prices);
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
                brand,
                fueltype,
                price
            } = station;


            //build popup
            const optionsPopup = L.popup()
                .setContent(
                    `
                    <p><b>Brand:</b> ${brand}</p>
                    <p><b>Address:</b> ${address}</p> 
                    <p>
                        <table>
                            <tr>
                                <th>Fuel types</th>                          
                                <th>Prices</th>
                            </tr>
                            <tr>
                                <td>${fueltype.map(type =>`<b>${type}</b><br>`).join('')}</td>                        
                                <td>${price.map(ausPrice =>`$${ausPrice}<br>`).join('')}</td>                     
                            </tr>
                        </table>                    
                    </p>
                `
                );
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
                const stations = data.responseJSON.stations;
                const prices = data.responseJSON.prices;
                const allPrices = this.mergePricesObjectsByKey(prices);
                let stations_prices = this.mergeStationsPrices(stations, all);
                //filter
                this.filterSuggestion(stations_prices, search);
            })
            .catch(error => console.log(error));
    }

    filterSuggestion(stations, search) {
        const filter = stations.filter(filter => filter.brand.indexOf(search) !== -1);
        //show markers
        this.showMarkers(filter);
    }

    mergeStationsPrices(arr1, arr2) {
        //combine arr1 and arr2
        return arr1.map((item, i) => Object.assign({}, item, arr2[i]));
    }

    mergePricesObjectsByKey(array) {
        let prices = [];
        array.forEach(item => {
            //filter by key stationcode
            let existing = prices.filter(price => {

                return price.stationcode == item.stationcode;
            });
            if (existing.length) {
                let existingIndex = prices.indexOf(existing[0]);
                prices[existingIndex].fueltype = prices[existingIndex].fueltype.concat(item.fueltype);
                prices[existingIndex].price = prices[existingIndex].price.concat(item.price);
            } else {
                if (typeof item.fueltype == 'string' && typeof item.price !== 'string')
                    item.fueltype = [item.fueltype];
                item.price = [item.price]
                prices.push(item);
            }
        });

        return prices;
    }
}