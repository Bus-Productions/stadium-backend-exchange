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
```
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
```
```


```
curl -i -X GET \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  https://www.stadiumgameapp.com/ask/<ask_id>
```

Your response will be:
```
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
```
```


```
curl -i -X GET \
  -u <user>:<password>  \
  -H "Content-Type: application/json" \
  https://www.stadiumgameapp.com/symbol/<symbol_id>
```

Your response will be:
```
```

###Trades

