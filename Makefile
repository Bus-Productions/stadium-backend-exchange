.EXPORT_ALL_VARIABLES:

database:
	sh scripts/init_db.sh

test: clean
	@NODE_ENV=test node scripts/make_admin_user.js
	@NODE_ENV=test node_modules/.bin/mocha

dev:
	@NODE_ENV=development node scripts/make_admin_user.js
	@NODE_ENV=development node server.js

default_admin:
	node scripts/make_admin_user.js

clean:
	psql -c 'Drop table "Bids"' -d stadium_exchange_test || echo ""
	psql -c 'Drop table "Asks"' -d stadium_exchange_test || echo ""
	psql -c 'Drop table "Symbols"' -d stadium_exchange_test || echo ""
	psql -c 'Drop table "Users"' -d stadium_exchange_test || echo ""

.PHONY: all test clean default_admin dev
