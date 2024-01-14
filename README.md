Backend for a Realtime chat service. Allow connecting to specific rooms and translation of app.

### Technologies
-Websockets
-ExpressJs
-Mongodb

### TODO:
- caching
- cleanup structure
- remove magic numbers
- better/consistent error handling

### How to run

1. Setup Access
   Get get an API key from [rapidapi](https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/microsoft-translator-text/)

   Create .env file in top level folder and add

   ```
   TRANSLATION_URL="microsoft-translator-text.p.rapidapi.com";
   TRANSLATION_KEY="[translation key]"
   ```


   replace [translation key] with API key from rapidapi
   
3. Run file
   to run the project, from the terminal type
   ```npm start```

### API Overview

