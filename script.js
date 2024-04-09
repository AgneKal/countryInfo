const search = document.getElementById('search');
const option = document.getElementsByClassName('option')
const countryName = document.getElementById('country-name');
const population = document.getElementById('population');
const area = document.getElementById('area');
const currency = document.getElementById('currency');
const language = document.getElementById('language');

const flag = document.getElementById('flag');
const coatOfArms = document.getElementById('coatOfArms');

const neighboursList = document.getElementById('neighbours-list');

const loading = document.getElementById("loading");

const loadingImages = () => {
    if (flag.complete && coatOfArms.complete) {
        loading.style.display = "none";
    } else {
        loading.style.display = "block";
        setTimeout(loadingImages, 100);
    }
}


fetch(`https://restcountries.com/v3.1/all`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        data.sort(function (a, b) {
            let textA = a.name.common;
            let textB = b.name.common;
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        data.forEach((n) => {
            const opt = document.createElement('option');
            opt.textContent = n.name.common;
            opt.value = n.cca2;
            search.appendChild(opt);
        })
        return data;
    });

search.onchange = () => {
    loading.style.display = "block";
    const selectedCountry = search.value;
    fetch(`https://restcountries.com/v3.1/alpha?codes=${selectedCountry}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            population.textContent = data[0].population.toLocaleString() || '-';
            area.textContent = data[0].area.toLocaleString() || '-';
            flag.src = data[0].flags.png || '-';
            coatOfArms.src = data[0].coatOfArms.png || '-';
            countryName.textContent = data[0].name.common;
            language.textContent = data[0].languages ? Object.values(data[0].languages).join(', ') : '-';
            currency.textContent = data[0].currencies ? Object.values(data[0].currencies).map((c) => c.name).join(', ') : '-';
            const borders = data[0].borders;
            return borders;
        })
        .then((borders) => {
            if (!borders) {
                const li = document.createElement('li');
                li.textContent = 'Kaimynų neturi.';
                li.className = 'neighbour';
                neighboursList.appendChild(li);
                loading.style.display = "none";
                return;
            }
            fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    data.forEach((c) => {
                        const li = document.createElement('li');
                        li.textContent = `${c.name.common} (${c.population.toLocaleString()}).`;
                        li.className = 'neighbour';
                        neighboursList.appendChild(li);
                    })
                    setTimeout(loadingImages, 100);
                })
        })
    search.value = '';
    neighboursList.innerHTML = '';
    population.textContent = '';
    area.textContent = '';
    currency.textContent = '';
    language.textContent = '';
    flag.src = '';
    coatOfArms.src = '';
    countryName.textContent = '';
};

