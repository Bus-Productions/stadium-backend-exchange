stadium_exchange
================

Exchange for the Stadium Product

### Install
```
npm install
node server.js
```

Development environment uses port 4200

/healthcheck for env dump

### Testing

1. To run the tests, first start make sure that you have the databases installed. You only need to do this ONCE:
```
./init_db.sh
```

1. Run the tests!
```
make test
```

### Deploying to Heroku

Make sure that the `Procfile` has the application listed under `web`.
```
heroku apps:create gamestage
heroku config:set NODE_ENV=staging
# Free
heroku addons:add heroku-postgresql:dev
# $20/month - currently unused
# heroku addons:add ssl

# Update the code on the heroku server
git push heroku master
# First time only, create the administrator user
heroku run node scripts/make_admin_user.js
```

## The API
The API uses HTTP Basic Authentication to provide security.

###Bids
You can `POST` and `GET` a Bid. The bid symbol must resolve to an existing symbol created with the `Symbol` API resource.

```
curl -i -X POST \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  -d '{ "symbol": "XYZ", "price": 100.0, "quantity": 100, "buyer": "Mr White", "price_affecting": true }' \
  https://www.stadiumgameapp.com/bid
```

Your response will be:
```json
{"symbol":"XYZ","price_ordered":100,"price_actual":100,"quantity":100,"buyer":"Mr White","order_placed_at":"2013-07-22T21:49:45.000Z","price_affecting":true,"matched":false,"id":1,"createdAt":"2013-07-22T21:49:45.000Z","updatedAt":"2013-07-22T21:49:45.000Z","deletedAt":null}
```

```
curl -i -X GET \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  https://www.stadiumgameapp.com/bid/<bid_id>
```

Your response will be:
```
```
###Asks
You can `POST` and `GET` an Ask. The ask symbol must resolve to an existing symbol created with the `Symbol` API resource.

```
curl -i -X POST \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  -d '{ "symbol": "XYZ", "price": 100.0, "quantity": 100, "seller": "Mr White", "price_affecting": true }' \
  https://www.stadiumgameapp.com/ask
```

Your response will be:
```json
{"symbol":"XYZ","price_ordered":100,"price_actual":100,"quantity":100,"seller":"Mr White","order_placed_at":"2013-07-22T22:03:24.000Z","price_affecting":true,"matched":false,"id":3,"createdAt":"2013-07-22T22:03:24.000Z","updatedAt":"2013-07-22T22:03:24.000Z","deletedAt":null}
```


```
curl -i -X GET \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  https://www.stadiumgameapp.com/ask/<ask_id>
```

Your response will be:
```json
{"symbol":"XYZ","price_ordered":100,"price_actual":100,"quantity":100,"seller":"Mr White","order_placed_at":"2013-07-22T21:59:04.000Z","price_affecting":true,"matched":true,"id":2,"createdAt":"2013-07-22T21:59:04.000Z","updatedAt":"2013-07-22T21:59:07.000Z","deletedAt":null}
```

###Symbols

```
curl -i -X POST \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  -d '{ "symbol": "XYZ", "price": 100.0, "issued": 100}' \
  https://www.stadiumgameapp.com/symbol
```

Your response will be:
```json
{"symbol":"XYZ","price":100,"issued":100,"id":1,"createdAt":"2013-07-22T21:49:37.000Z","updatedAt":"2013-07-22T21:49:37.000Z","deletedAt":null}
```


```
curl -i -X GET \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  https://www.stadiumgameapp.com/symbol/<symbol_name>
```

Your response will be:
```json
{"symbol":"XYZ","price":200,"issued":200,"id":1,"createdAt":"2013-07-22T21:49:37.000Z","updatedAt":"2013-07-22T21:49:47.000Z","deletedAt":null}
```

###Trades
Trades happen after a bid or ask is entered. You can only `GET` a trade from the trade book

```shell
curl -i -X GET \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  https://www.stadiumgameapp.com/trade/<symbol_name>
```

Your response will look like:
```json
[{"symbol":"XYZ","price":200,"quantity":100,"buyer":"Mr White","bid":"1","seller":"StadiumEX","ask":"1","id":1,"createdAt":"2013-07-22T21:49:47.000Z","updatedAt":"2013-07-22T21:49:47.000Z","deletedAt":null},{"symbol":"XYZ","price":100,"quantity":100,"buyer":"StadiumEX","bid":"2","seller":"Mr White","ask":"2","id":2,"createdAt":"2013-07-22T21:59:07.000Z","updatedAt":"2013-07-22T21:59:07.000Z","deletedAt":null},{"symbol":"XYZ","price":0,"quantity":100,"buyer":"StadiumEX","bid":"3","seller":"Mr White","ask":"3","id":3,"createdAt":"2013-07-22T22:03:26.000Z","updatedAt":"2013-07-22T22:03:26.000Z","deletedAt":null}]
```

