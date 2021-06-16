
<h1 align="center">
<br>
  Zgarcitul
</h1>

<p align="center">find cheapest stuff</p>

<hr />
<br />


## 📚 Project Definition

Full web app for price tracking


## 🛠️ Features

Technologies used:

- ⚛️ **React JS**
- 🌶️ **Flask** — Library to create CLI tools
- 📊 **PostgreSQL** - Database
- 🌐 **Docker** - Containerization sistem


## 🚀 Instalation
With docker, inside root folder: 
```sh
docker-compose up -d
```

## 💻 Development

### Backend Flask
1. cp .env.example to .env
2. update APP_NAME (if want to change app name - used for docker)
3. docker exec -it zgarcitul_rest bash
4. run inside container:
  - flask db upgrade
  - flask configure-db
  - python main.py
5. app is port forwarded to localhost on port 5050
```http://localhost:5050/api/```

### Frontend React
1. update .env file(especialy REACT_APP_SERVER_API_URL)
2. docker exec -it zgarcitul_ui bash
3. npm start
4. app is port forwarded to localhost on port 3050
```http://localhost:3050/```






