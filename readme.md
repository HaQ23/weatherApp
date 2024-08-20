## Opis

To jest aplikacja składająca się z dwóch głównych części:

- **Backend**: Serwis napisany w Pythonie, który korzysta z bazy danych MongoDB.
- **Frontend**: Aplikacja zbudowana w Vue.js, która komunikuje się z backendem.

## Backend

Backend jest napisany w Pythonie i korzysta z bazy danych MongoDB.

### Wymagania

- Python 3.x
- MongoDB

### Instalacja

1. **Sklonuj repozytorium:**

   ```bash
   git clone https://github.com/HaQ23/weatherApp.git
   cd your-repo
   ```

2. **Utwórz środowisko wirtualne:**

   ```bash
   python -m venv venv
   ```

3. **Aktywuj środowisko wirtualne:**

   - Na Windows:

     ```bash
     venv\Scripts\activate
     ```

   - Na macOS/Linux:

     ```bash
     source venv/bin/activate
     ```

4. **Zainstaluj wymagane pakiety:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Skonfiguruj MongoDB:**

   Upewnij się, że masz zainstalowany MongoDB i jest uruchomiony na Twoim lokalnym serwerze lub skonfiguruj połączenie z zewnętrzną instancją MongoDB w pliku konfiguracyjnym aplikacji.

6. **Uruchom serwis backendowy:**

   ```bash
   python main.py
   ```

## Frontend

Frontend jest zbudowany w Vue.js i komunikuje się z backendem.

### Wymagania

- Node.js
- npm

### Instalacja

1. **Zainstaluj zależności:**

   npm install

2. **Uruchom aplikację frontendową:**

   npm run serve

   Aplikacja frontendowa będzie dostępna pod adresem `http://localhost:8080` (domyślnie).

## Refleksje i Przemyślenia

Projekt ten zrealizowałem w przeciągu około 3-4 dni roboczych. Dodatkowo, ponieważ był to mój pierwszy projekt w Vue.js, musiałem poświęcić sporo czasu na nauke oraz poszukwanie informacji jak efektywnie korzystać z tego frameworka.

#### Co bym zrobił inaczej:

1. **Optymalizacja Stylów CSS:**

   - **Globalne Style**: Przy projektowaniu aplikacji, skupiłbym się na używaniu globalnych stylów zamiast duplikowania kodu CSS w wielu miejscach. Wprowadzenie globalnych zmiennych i mixinów w SCSS mogłoby znacznie uprościć zarządzanie stylami i poprawić spójność wizualną aplikacji.

2. **Struktura Plików:**

   - **Organizacja Kodów**: Zdecydowanie zainwestowałbym więcej czasu w przemyślenie struktury plików i folderów.

3. **Nazewnictwo i Czytelność Kodu:**

   - **Zmienna i Metody**: Niektóre zmienne i metody mogłyby być lepiej nazwane, aby były bardziej intuicyjne i czytelne dla innych programistów. Na przykład, zmienne mogłyby być bardziej opisowe, a metody lepiej odzwierciedlać swoje funkcje.

4. **Skalowalność i Struktura Serwisów:**

   - **Modularność**: Z powodu ograniczonego czasu projekt został zrealizowany w sposób bardziej jednorodny. W przyszłości skoncentrowałbym się na tworzeniu bardziej modularnych i skalowalnych serwisów, które mogą być łatwiej zarządzane i rozwijane.
   - **UI/UX**: Poprawiłbym wygląd aplikacji. Chociaż użycie Bootstrapu ułatwiło pracę i było zgodne z wymaganiami, efektem ubocznym było nadanie aplikacji typowego, "bootstrapowego" wyglądu.
