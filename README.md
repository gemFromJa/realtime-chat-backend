Backend for a Realtime chat service. Allow connecting to specific rooms and translation of app.

##### Technologies

-Websockets

-ExpressJs

-Mongodb

##### Todo:
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
   
   ```
   npm start
   ```

### Rest API Overview

1. ```/user/``` -- get the user info
   
   Type: ```GET```

   Params: username
   
2. ```/user/``` -- create new username to join room

   Type: ```POST```

   Body: name, username

3. ```/room/``` -- get existing rooms

   Type: ```GET```
   
4. ```/room/mine/:id``` -- get the chatrooms user(:id) is apart of
   
   Type: ```GET```
   
5. ```/room/:id``` -- get room data ( messages etc)
   
   Type: ```GET```
   
6. ```/room/``` -- create new room
   
   Type: ```POST```
   
7. ```/room/:id/join``` -- join a room
   
   Type: ```POST```
   
8. ```/room/:id/message``` -- send a message
   
   Type: ```POST```

