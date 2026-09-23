# Nardin Le Tende · Sito

Homepage di Nardin Le Tende, sviluppata dal design "Nardin Homepage" realizzato in Claude Design.

Sito statico: HTML, CSS e JavaScript senza dipendenze e senza build.

## Struttura

```
index.html            Homepage (contenuti, dati strutturati FAQ/negozi)
assets/css/main.css   Stili (griglia a 12 colonne, token colore, animazioni)
assets/js/main.js     Interazioni: header sticky, menu mobile, video, reveal,
                      tab bisogni, caroselli, FAQ, orari e ricerca showroom per CAP
assets/img/           Foto e logo
assets/video/         Video hero e laboratorio
```

## Avvio in locale

```
python3 -m http.server 8000
```

poi apri http://localhost:8000.

## Da completare prima della messa online

- **Orari showroom**: in `assets/js/main.js` (`HOURS`) sono segnaposto uguali per tutti e tre gli showroom.
- **Testi tra parentesi quadre**: FAQ (condizioni del sopralluogo, tempo medio, capitolati), card progetto
  ("Il problema" / "Come l’abbiamo risolto") e messaggio CAP fuori zona.
- **Video**: `hero.mp4` e `laboratorio.mp4` pesano circa 11 MB ciascuno; servono versioni compresse (~1080p, pochi MB)
  e un'immagine `poster` da mostrare durante il caricamento.
- **Foto showroom**: è la stessa foto (516 px) per tutti e tre; servono foto più grandi e dedicate per Fossalta e Mogliano.
- **Link interni**: `#professionisti`, `#lavora`, `#giftcard`, `#privacy`, `#cookie` e i link "Tutti i progetti" /
  "Il metodo completo" / "Entra nel laboratorio" puntano ancora ad ancore segnaposto.
- **Licenza video hero**: il file proviene da iStock; verificare la licenza per l'uso sul sito.
