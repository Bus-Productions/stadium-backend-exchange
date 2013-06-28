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

1. Then start the node application using the following line
```
make server
```

1. Then in another shell, run the tests!
```
make test
```

1. Then clean up the database:
```
make clean
```

1. Stop the server (in the shell where the server is running) and start from the beginning:
