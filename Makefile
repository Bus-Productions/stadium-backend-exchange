test:
	NODE_ENV=test node_modules/.bin/mocha
	psql -c 'DROP TABLE Bids' -d stadium_exchange_test

server:
	NODE_ENV=test node server.js

clean:
	psql -c 'Drop table "Bids"' -d stadium_exchange_test
	psql -c 'Drop table "Asks"' -d stadium_exchange_test
	psql -c 'Drop table "Symbols"' -d stadium_exchange_test


.PHONY: all test clean
