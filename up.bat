set ENV=development
set "ENV_FILE_NAME=%ENV%.env"

docker-compose -f master.yaml build && docker-compose -f master.yaml up