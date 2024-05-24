from flask import Flask, render_template, request, make_response, jsonify
from pony.orm import Database, PrimaryKey, Required, Optional, db_session

app = Flask(__name__)
app.static_folder = 'static'  # Postavljanje direktorija za statičke datoteke

# Konfiguracija baze podataka
db = Database()

# Definicija entiteta za recenzije filmova
class Film(db.Entity):
    id = PrimaryKey(int, auto=True)
    naslov = Required(str)
    godina_izlaska = Required(int)
    recenzija = Optional(str)

# Povezivanje baze podataka
db.bind(provider='sqlite', filename='filmovi.sqlite', create_db=True)

# Generiranje mapa tablica
db.generate_mapping(create_tables=True)

# Funkcije za rad s filmovima
@db_session
def dodaj_film(json_request):
    try:
        naslov = json_request["naslov"]
        godina_izlaska = json_request["godina_izlaska"]
        recenzija = json_request.get("recenzija", None)

        Film(naslov=naslov, godina_izlaska=godina_izlaska, recenzija=recenzija)

        return {"response": "Success"}
    except Exception as e:
        return {"response": "Fail", "error": str(e)}

@db_session
def get_filmove():
    try:
        filmovi = Film.select()[:]
        data = [{"id": f.id, "naslov": f.naslov, "godina_izlaska": f.godina_izlaska, "recenzija": f.recenzija} for f in filmovi]

        return {"response": "Success", "data": data}
    except Exception as e:
        return {"response": "Fail", "error": str(e)}

# Routa za dodavanje filma
@app.route('/dodaj_film', methods=['POST'])
@db_session
def dodaj_film_route():
    if request.method == 'POST':
        json_request = request.json
        response = dodaj_film(json_request)
        return make_response(jsonify(response), 200)

# Routa za dohvat svih filmova
@app.route('/filmovi', methods=['GET'])
@db_session
def filmovi_route():
    if request.method == 'GET':
        response = get_filmove()
        return make_response(jsonify(response), 200)

# Routa za početnu stranicu
@app.route('/')
def pocetna_stranica():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
