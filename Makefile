test: clean set_test_env default_admin
	node_modules/.bin/mocha

dev: set_dev_env default_admin
	node server.js

default_admin:
	node scripts/make_admin_user.js

clean:
	psql -c 'Drop table "Bids"' -d stadium_exchange_test || echo ""
	psql -c 'Drop table "Asks"' -d stadium_exchange_test || echo ""
	psql -c 'Drop table "Symbols"' -d stadium_exchange_test || echo ""
	psql -c 'Drop table "Users"' -d stadium_exchange_test || echo ""

set_dev_env:
	export NODE_ENV=development

set_test_env:
	export NODE_ENV=test

.PHONY: all test clean default_admin set_test_env set_dev_env
