#!/bin/bash

psql --command "create database stadium_exchange"
psql --command "create user stadium_exchange with password 'game2013'"
psql --command "grant all privileges on database stadium_exchange to stadium_exchange"
psql --command '\list'
