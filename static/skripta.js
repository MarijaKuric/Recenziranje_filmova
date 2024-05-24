document.addEventListener('DOMContentLoaded', function() {
    const tabPocetna = document.getElementById('tab-pocetna');
    const tabFilm = document.getElementById('tab-film');
    const tabRecenzija = document.getElementById('tab-recenzija');
    const tabRecenzirani = document.getElementById('tab-recenzirani');
    const tabStatistika = document.getElementById('tab-statistika');

    const pocetnaStranica = document.getElementById('pocetna-stranica');
    const obrazacFilma = document.getElementById('obrazac-filma');
    const obrazacRecenzije = document.getElementById('obrazac-recenzije');
    const recenziraniFilmovi = document.getElementById('recenzirani-filmovi');
    const listaFilmova = document.getElementById('lista-filmova');
    const statistickiPodaci = document.getElementById('statisticki-podaci');

    // Event listeneri za kartice
    tabPocetna.addEventListener('click', function(event) {
        event.preventDefault();
        prikaziSekciju(pocetnaStranica);
        obrisiAktivnuKarticu();
        tabPocetna.classList.add('aktivna-kartica');
    });

    tabFilm.addEventListener('click', function(event) {
        event.preventDefault();
        prikaziSekciju(obrazacFilma);
        obrisiAktivnuKarticu();
        tabFilm.classList.add('aktivna-kartica');
    });

    tabRecenzija.addEventListener('click', function(event) {
        event.preventDefault();
        prikaziSekciju(obrazacRecenzije);
        obrisiAktivnuKarticu();
        tabRecenzija.classList.add('aktivna-kartica');
    });

    tabRecenzirani.addEventListener('click', function(event) {
        event.preventDefault();
        prikaziRecenziraneFilmove();
        obrisiAktivnuKarticu();
        tabRecenzirani.classList.add('aktivna-kartica');
    });

    tabStatistika.addEventListener('click', function(event) {
        event.preventDefault();
        prikaziSekciju(statistickiPodaci);
        obrisiAktivnuKarticu();
        tabStatistika.classList.add('aktivna-kartica');
        prikaziStatistickePodatke();
    });

    function prikaziSekciju(sekcija) {
        const sveSekcije = document.querySelectorAll('main > section');
        sveSekcije.forEach(function(s) {
            s.style.display = 'none';
        });
        sekcija.style.display = 'block';
    }

    function obrisiAktivnuKarticu() {
        const sveKartice = document.querySelectorAll('nav a');
        sveKartice.forEach(function(k) {
            k.classList.remove('aktivna-kartica');
        });
    }

    function spremiPodatke(naziv, podaci) {
        localStorage.setItem(naziv, JSON.stringify(podaci));
    }

    function dohvatiPodatke(naziv) {
        return JSON.parse(localStorage.getItem(naziv)) || [];
    }

    function prikaziRecenziraneFilmove() {
        const recenziraniFilmoviPodaci = dohvatiPodatke('recenziraniFilmovi');

        listaFilmova.innerHTML = '';
        recenziraniFilmoviPodaci.forEach(function(film, index) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${film.naslov} (${film.godinaIzlaska}): ${film.recenzija}</span>
                <button class="uredi-recenziju-btn">Uredi</button>
                <button class="obrisi-film-btn">Obriši</button>
            `;
            li.setAttribute('data-index', index);
            listaFilmova.appendChild(li);
        });

        prikaziSekciju(recenziraniFilmovi);
    }

    function prikaziFormuZaUredivanje(index, jeRecenzija) {
        const recenziraniFilmoviPodaci = dohvatiPodatke('recenziraniFilmovi');
        const item = recenziraniFilmoviPodaci[index];

        if (jeRecenzija) {
            const novaRecenzija = prompt(`Trenutna recenzija je: ${item.recenzija}. Unesite novu recenziju:`);
            if (novaRecenzija !== null) {
                item.recenzija = novaRecenzija;
                spremiPodatke('recenziraniFilmovi', recenziraniFilmoviPodaci);
                prikaziRecenziraneFilmove();
            }
        } else {
            const noviNaslov = prompt(`Trenutni naslov filma je: ${item.naslov}. Unesite novi naslov:`);
            if (noviNaslov !== null) {
                item.naslov = noviNaslov;
                spremiPodatke('recenziraniFilmovi', recenziraniFilmoviPodaci);
                prikaziRecenziraneFilmove();
            }
        }
    }

    listaFilmova.addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('uredi-recenziju-btn')) {
            const index = parseInt(target.parentElement.getAttribute('data-index'));
            prikaziFormuZaUredivanje(index, true);
        } else if (target.classList.contains('obrisi-film-btn')) {
            const index = parseInt(target.parentElement.getAttribute('data-index'));
            obrisiFilm(index);
        }
    });

    function obrisiFilm(index) {
        const recenziraniFilmoviPodaci = dohvatiPodatke('recenziraniFilmovi');
        recenziraniFilmoviPodaci.splice(index, 1);
        spremiPodatke('recenziraniFilmovi', recenziraniFilmoviPodaci);
        prikaziRecenziraneFilmove();
    }

    const formaFilma = document.getElementById('forma-filma');
    formaFilma.addEventListener('submit', function(event) {
        event.preventDefault();
        const naslovFilma = document.getElementById('naslov-filma').value;
        const godinaIzlaska = document.getElementById('godina-izlaska').value;
        const film = { naslov: naslovFilma, godinaIzlaska: godinaIzlaska, recenzija: '' };

        const recenziraniFilmoviPodaci = dohvatiPodatke('recenziraniFilmovi');
        recenziraniFilmoviPodaci.push(film);
        spremiPodatke('recenziraniFilmovi', recenziraniFilmoviPodaci);

        prikaziRecenziraneFilmove();
    });

    const formaRecenzije = document.getElementById('forma-recenzije');
    formaRecenzije.addEventListener('submit', function(event) {
        event.preventDefault();
        const recenzija = document.getElementById('recenzija').value;
        const ocjena = document.getElementById('ocjena').value;

        const recenziraniFilmoviPodaci = dohvatiPodatke('recenziraniFilmovi');
        const posljednjiFilm = recenziraniFilmoviPodaci[recenziraniFilmoviPodaci.length - 1];
        posljednjiFilm.recenzija = `Recenzija: ${recenzija}, Ocjena: ${ocjena}`;
        spremiPodatke('recenziraniFilmovi', recenziraniFilmoviPodaci);

        prikaziRecenziraneFilmove();
    });

    function prikaziStatistickePodatke() {
        const recenziraniFilmoviPodaci = dohvatiPodatke('recenziraniFilmovi');
    
        // Podaci za graf ocjena
        const ocjene = recenziraniFilmoviPodaci.map(function(film) {
            const ocjenaString = film.recenzija.split('Ocjena: ')[1];
            return parseInt(ocjenaString);
        }).filter(function(ocjena) {
            // Filtriramo ocjene koje su uspješno parsirane
            return !isNaN(ocjena);
        });
    
        // Stvaranje grafa ocjena
        const ctxOcjene = document.getElementById('dijagram-ocjene').getContext('2d');
        const chartOcjene = new Chart(ctxOcjene, {
            type: 'doughnut',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                datasets: [{
                    label: 'Ocjene',
                    data: generirajBrojOcjena(ocjene),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(113, 12, 255, 0.2)',
                        'rgba(555, 19, 4, 0.2)',
                        'rgba(5, 99, 102, 0.2)',
                        'rgba(227, 54, 178, 0.2)',
                        'rgba(4, 15, 7, 0.2)',
                        'rgba(232, 135, 37, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(113, 12, 255, 1)',
                        'rgba(555, 19, 4, 1)',
                        'rgba(5, 99, 102, 1)',
                        'rgba(227, 54, 178, 1)',
                        'rgba(4, 15, 7, 1)',
                        'rgba(232, 135, 37, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                cutout: 0, // Ukloni središnji prazni dio
                layout: {
                    padding: 20 // Postavi razmak oko grafa
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    
        // Podaci za graf godina izlaska filma
        const godineIzlaska = recenziraniFilmoviPodaci.map(function(film) {
            return parseInt(film.godinaIzlaska);
        });
    
        // Brojanje godina izlaska filma
        const godineMap = new Map();
        godineIzlaska.forEach(godina => {
            if (godineMap.has(godina)) {
                const count = godineMap.get(godina);
                godineMap.set(godina, count + 1);
            } else {
                godineMap.set(godina, 1);
            }
        });
    
        const godineIzlaskaUnique = [...godineMap.keys()];
        const podaciZaGraf = [...godineMap.values()];
    
        // Stvaranje grafikona za godine izlaska filma
        const ctxGodine = document.getElementById('dijagram-godina').getContext('2d');
        const chartGodine = new Chart(ctxGodine, {
            type: 'bar',
            data: {
                labels: godineIzlaskaUnique,
                datasets: [{
                    label: 'Godine izlaska filma',
                    data: podaciZaGraf,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    function generirajBrojOcjena(ocjene) {
        const brojac = Array(10).fill(0);
        ocjene.forEach(ocjena => {
            brojac[ocjena - 1]++;
        });
        return brojac;
    }
});
