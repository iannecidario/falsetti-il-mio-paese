# Il mio paese - Pietro Falsetti

Sito statico in React + Vite dedicato al libro poetico multimediale **Il mio paese**. Il progetto usa immagini, audio MP3 e file Markdown separati dal codice, cosi il libro puo crescere senza riscrivere l'applicazione.

## Avvio locale

Installa le dipendenze:

```bash
npm install
```

Avvia il sito:

```bash
npm run dev
```

Crea la versione pubblicabile:

```bash
npm run build
```

## Cartelle contenuti

Le immagini vanno in:

```text
public/immagini/
```

Gli audio MP3 vanno in:

```text
public/audio/
```

I testi poetici vanno in:

```text
src/poesie/
```

Ogni file `.md` deve contenere solo il testo della poesia, senza titolo, autore o metadati.

## Catalogo poesie

Il catalogo centrale si trova in:

```text
src/data/catalogo.js
```

Ogni poesia e descritta cosi:

```js
{
  id: "case-del-borgo-antico",
  ordine: 1,
  titolo: "Case del borgo antico",
  testo: "case-del-borgo-antico.md",
  immagine: "/immagini/case-del-borgo-antico.jpg",
  audio: "/audio/case-del-borgo-antico.mp3",
  didascalia: "Didascalia dell'immagine"
}
```

## Aggiungere una nuova poesia

1. Inserisci il file testo in `src/poesie/`, per esempio `nuova-poesia.md`.
2. Inserisci l'immagine in `public/immagini/`.
3. Inserisci l'MP3 in `public/audio/`, se disponibile.
4. Apri `src/data/catalogo.js`.
5. Aggiungi un nuovo oggetto nell'array `poesie`.
6. Assegna un `id` unico, senza spazi, che diventera l'URL della poesia.

Esempio URL:

```text
/poesie/nuova-poesia
```

## Modificare una didascalia

Apri `src/data/catalogo.js` e modifica il campo:

```js
didascalia: "Nuova didascalia"
```

Se non vuoi mostrare alcuna didascalia, lascia il campo vuoto:

```js
didascalia: ""
```

## Modificare la biografia

La pagina autore usa l'oggetto `autore` in `src/data/catalogo.js`.

Puoi modificare:

```js
export const autore = {
  nome: "Pietro Falsetti",
  foto: "",
  biografia: "Testo della biografia...",
  notaLibro: "Nota sul libro..."
};
```

Se hai una fotografia dell'autore, copiala in `public/immagini/` e inserisci il percorso in `foto`.

## Cambiare immagine di copertina

La copertina usa l'oggetto `copertina` in `src/data/catalogo.js`.

Esempio:

```js
export const copertina = {
  immagine: "/immagini/case-del-borgo-antico.jpg",
  alt: "Descrizione dell'immagine"
};
```

## Pubblicare su GitHub

1. Crea un repository GitHub.
2. Carica la cartella del progetto.
3. Esegui questi comandi dalla cartella del sito:

```bash
git init
git add .
git commit -m "Prima versione del sito"
git branch -M main
git remote add origin https://github.com/NOME-UTENTE/il-mio-paese.git
git push -u origin main
```

## Pubblicare su Render

Crea un nuovo **Static Site** su Render e collega il repository GitHub.

Imposta:

```text
Build Command: npm install && npm run build
Publish Directory: dist
```

Per usare URL diretti come `/poesie/case-del-borgo-antico`, configura su Render una rewrite verso `index.html` per tutte le route dell'app.

## Note

- Il sito non usa backend.
- Il sito non usa database.
- Il sito non richiede login.
- I contenuti sono separati dal codice.
- La playlist usa automaticamente le poesie del catalogo che hanno un file MP3.
