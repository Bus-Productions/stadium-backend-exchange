test: clean
	NODE_ENV=test node_modules/.bin/mocha

server:
	NODE_ENV=test node server.js

clean:
	psql -c 'Drop table "Bids"' -d stadium_exchange_test
	psql -c 'Drop table "Asks"' -d stadium_exchange_test
	psql -c 'Drop table "Symbols"' -d stadium_exchange_test
	psql -c 'Drop table "Users"' -d stadium_exchange_test

default_admin:
	node scripts/make_admin_user.js

.PHONY: all test clean default_admin
