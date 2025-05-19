#! /bin/bash
# usage: WEBSERVER=servername ./deploy.sh

jekyll build
rsync -rvz --delete _site/ ${WEBSERVER}:/var/www/amateur/http/
