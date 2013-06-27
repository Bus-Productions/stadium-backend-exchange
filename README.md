stadium_exchange
================

Exchange for the Stadium Product

### Install
>npm install
>
>node server.js

Development environment uses port 4200

/healthcheck for env dump

### Testing

To run the tests, first start make sure that you have the databases installed:
```
./init_db.sh
```

Then start the node application using the following line
```
NODE_ENV=test node server.js
```

Then run the tests!

```
npm install
node_modules/.bin/mocha
```
