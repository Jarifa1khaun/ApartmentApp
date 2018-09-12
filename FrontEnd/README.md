This is the front end of the app. It is dockerized and it will be created and destroyed using the up and down files.

compose command to force re-build image: docker-compose -f front.yaml build &&  docker-compose -f front.yaml up -d