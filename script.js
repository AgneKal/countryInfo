const search = document.getElementById('search');
const option = document.getElementsByClassName('option')
const countryName = document.getElementById('country-name');
const alertText = document.getElementById('alert');
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

fetch(`https://restcountries.com/v3.1/all?fields=name,cca2`)
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
    console.log(selectedCountry);
    fetch(`https://restcountries.com/v3.1/alpha/${selectedCountry}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.status === 404) {
                let e = new Error('Negalime pasiekti informacijos apie šalį.');
                e.name = 'nerastaSalis';
                throw e;
            }
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
                    console.log(data);
                    if (data.status === 400) {
                        let e = new Error('Negalime pasiekti informacijos apie kaimynus.');
                        e.name = 'nerastiKaimynai';
                        throw e;
                    }
                    data.forEach((c) => {
                        const li = document.createElement('li');
                        li.textContent = `${c.name.common} (${c.population.toLocaleString()}).`;
                        li.className = 'neighbour';
                        neighboursList.appendChild(li);
                    })
                    setTimeout(loadingImages, 100);
                })
                .catch((e) => {
                    loading.style.display = "none";
                    if (e.name == 'nerastiKaimynai') {
                        const li = document.createElement('li');
                        li.textContent = `Įvyko klaida ieškant kaimynų.`;
                        li.className = 'neighbour';
                        neighboursList.appendChild(li);
                    }
                    alertText.style.display = 'block';
                })
        })
        .catch((e) => {
            loading.style.display = "none";
            if (e.name == "Not") {
                alertText.innerHTML = `Klaida, serveris neveikia arba nėra interneto.`;
            } else if (e.name == 'nerastaSalis') {
                alertText.innerHTML = `Klaida ieškant šalies.`;
            }
            alertText.style.display = 'block';
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
