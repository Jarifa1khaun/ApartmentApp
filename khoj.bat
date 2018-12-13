:: setting necessary env variables

set NODE_IMAGE_NAME=apartment_node
set FRONT_IMAGE_NAME=apartment_site

:: uncomment the following to pull image from docker hub repo
:: set NODE_IMAGE_NAME=jarifamustafa/apartment_node
:: set FRONT_IMAGE_NAME=jarifamustafa/apartment_site

:: env for mongo

set DB_PORT=27017
set DB_CONTAINER_PORT=27017
set DB_IMAGE_NAME=mongo
set DB_IMAGE_VERSION=latest
set DB_NAME=khoj_the_search
set DB_CONTAINER_NAME=apartment_mongo
set DB_URI=mongodb://%DB_CONTAINER_NAME%:%DB_PORT%/%DB_NAME%

:: env for node server

set CONTAINER_PORT=3000
set SERVER_HOST_PORT=3000
set NODE_IMAGE_VERSION=1.0.0
set SERVER_CONTAINER_NAME=apartment_server

set NODE_ENV=development
set JWT_PRIVATE_KEY=Y9zRh0yx2M3PLxsWAnmd
set API_KEY=AIzaSyDWNE_jdj3NJj4IUWwz4kCRUg3k0hjVzWc
set SESSION_DURATION=1440

:: env for front end

set FRONT_HOST_PORT=80
set FRONT_CONTAINER_PORT=80
set FRONT_IMAGE_VERSION=1.0.0
set UI_CONTAINER_NAME=apartment_front

:: deploying the khoj app

docker network create -d bridge front
docker network create -d bridge back 
docker volume create mongo-dev-vol

docker run -d --name %DB_CONTAINER_NAME% --network back -v mongo-dev-vol:/data/db %DB_IMAGE_NAME%:%DB_IMAGE_VERSION%

docker run -d --network back --name %SERVER_CONTAINER_NAME% -p %SERVER_HOST_PORT%:%CONTAINER_PORT% -e NODE_ENV -e CONTAINER_PORT -e JWT_PRIVATE_KEY -e DB_URI -e API_KEY -e SESSION_DURATION %NODE_IMAGE_NAME%:%NODE_IMAGE_VERSION%

docker run -d --name %UI_CONTAINER_NAME%  --network front -p %FRONT_HOST_PORT%:%FRONT_CONTAINER_PORT%  %FRONT_IMAGE_NAME%:%FRONT_IMAGE_VERSION%

:: status report 
docker ps

:: for removing the containers only, data will remain

:: docker stop %UI_CONTAINER_NAME% %SERVER_CONTAINER_NAME% %DB_CONTAINER_NAME%
:: docker rm %UI_CONTAINER_NAME% %SERVER_CONTAINER_NAME% %DB_CONTAINER_NAME%

:: uncomment the following lines for dismantling everything 

:: docker network rm front back 
:: docker volume rm mongo-dev-vol