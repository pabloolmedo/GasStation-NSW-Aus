import {
    UI
} from './ui.js';


const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.showGasStations();
});

//search gas stations
const search = document.querySelector('#search input');
search.addEventListener('input', () => {
    let input = search.value.toLowerCase();
    let text = input.charAt(0).toUpperCase() + input.slice(1);
    if (text.length >= 2) {
        //search API
        ui.getSuggestions(text);
        console.log(text);
    } else {
         ui.showGasStations();
    }
});
