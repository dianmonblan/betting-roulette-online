# betting-roulette-online

12 reglas de Clean Code mediante ruleta de apuestas online.

## Start-up development - UBUNTU

Environment variables
```
NODE_ENV = null | producción    // Environment app. default=null
PORT = Number                   // Listening app. defalut=3000
STRIP_TAGS_JSONP = any          // Strip tags no propagation JSONP. defalut=)]}',\n
URL_DATABASE = String           // Database connect URL
NAME_DATABASE = String          // Database name
```

Install packages 
```npm install```

Command run
```DEBUG=app:* npm start```

Listening for default
```http://localhost:3000/```

## Database MongoDB
[Horizontal scaling](https://docs.mongodb.com/manual/sharding/)
[Deploy a Replica Set](https://docs.mongodb.com/manual/tutorial/deploy-replica-set/)

## PM2 daemon process manager
[Applicaction balance](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/)
[Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
[Docker balance](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/)