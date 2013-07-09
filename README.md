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
```
