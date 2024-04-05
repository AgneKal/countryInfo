const search = document.getElementById('search');
const option = document.getElementsByClassName('option')
const countryName = document.getElementById('country-name');
const population = document.getElementById('population');
const area = document.getElementById('area');
const currency = document.getElementById('currency');
const language = document.getElementById('language');

const flag = document.getElementById('flag');
const blazon = document.getElementById('blazon');

const neighboursList = document.getElementById('neighbours-list');

let countries;

fetch(`https://restcountries.com/v3.1/all`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        const names = data.map((n) => n.name.common).sort();
        names.forEach((n) => {
            const opt = document.createElement('option');
            opt.textContent = n;
            opt.value = n;
            search.appendChild(opt);
        })
        return data;
    });

search.onchange = () => {
    const selectedCountry = search.value;
    fetch(`https://restcountries.com/v3.1/name/${selectedCountry}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            population.textContent = data[0].population;
            area.textContent = data[0].area;
            currency.textContent = Object.values(data[0].currencies).map((c) => c.name).join(', ');
            language.textContent = Object.values(data[0].languages).join(', ');
            flag.src = data[0].flags.png;
            blazon.src = data[0].coatOfArms.png;
            countryName.textContent = data[0].name.common;
            const borders = data[0].borders;
            return borders;
        })
        .then((borders) => {
            if (!borders) {
                const li = document.createElement('li');
                li.textContent = 'Kaimynų neturi.';
                li.className = 'neighbour';
                neighboursList.appendChild(li);
                return;
            }
            fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    data.forEach((c) => {
                        const li = document.createElement('li');
                        li.textContent = `${c.name.common} (${c.population}).`;
                        li.className = 'neighbour';
                        neighboursList.appendChild(li);
                    })
                })
        })
    search.value = '';
    neighboursList.innerHTML = '';
};

