# Recenziranje_filmova

 Korisnik može jednostavno dodavati filmove koje je pogledao i ocjenjivati ih na aplikaciji za recenziranje filmova koja omogućuje korisniku da zabilježi i sačuva svoje dojmove koje je stekao pri gledanju.
## Use case dijagram

![image](https://github.com/MarijaKuric/Recenziranje_filmova/assets/159777612/28745638-c5e1-4ecf-a244-9b29af16425b)

## Instalacija
cd ~/Downloads
<br>git clone https://github.com/MarijaKuric/Recenziranje_filmova
<br>cd recenziranje_filmova

docker build -t recenziranje_filmova .
<br>docker ps
<br>docker run -p 8080:8080 recenziranje_filmova
