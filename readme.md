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
   git clone https://github.com/yourusername/your-repo.git
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
