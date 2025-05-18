#! /bin/bash

jekyll build
rsync -avz --delete _site/ ${WEBSERVER}:/var/www/amateur/http/
