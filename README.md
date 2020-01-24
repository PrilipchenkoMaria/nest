Nest weather stream
===

## Running the app

```bash
$ docker-compose up
```

Open in browser: http://127.0.0.1:3000


## Requirements

- Create a Node.js application
- as a framework use nestjs (choose express as underlying platform)
- integrate the free weather api service from https://openweathermap.org/api
- provide an endpoint in your application that takes a geo location as its input
- the endpoint should provide the moving average of temperature and humidity in form of a stream of the given location until the user cancels it
- provide a simple Angular / Vue / React frontend (whatever you want) to make it comfortable for the user to interact with the endpoint
- provide whole project via docker-compose
