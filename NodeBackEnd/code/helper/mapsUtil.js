const axios = require('axios');

let TYPE;
let SOURCE_LAT;
let SOURCE_LONG;
let DESTINATION_LAT;
let DESTINATION_LONG;

const API_KEY = process.env.API_KEY;

async function fillUpNearby (source_lat, source_long) {
    
    let nearbyArray = [];
    const typeArray = ['mosque', 'hospital', 'school', 'park', 'department_store'];

    SOURCE_LAT = source_lat;
    SOURCE_LONG = source_long;
    
    for (let i in typeArray) {
        const returnVal = await getNearbyInformation(typeArray[i]);
        nearbyArray.push(returnVal);
    }
    return nearbyArray;
}

async function getNearbyInformation(type) {

    let nearby;
    
    TYPE = type;
    
    const nearbyURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${SOURCE_LAT},${SOURCE_LONG}&type=${TYPE}&rankby=distance&key=${API_KEY}`;        
    try {
        const body = await axios.get(nearbyURL);    
        if (body && body.data && body.data.results && body.data.results.length > 0) {


            nearby = (({name, id, place_id, vicinity, photos}) => 
                    ({name, id, place_id, vicinity, photos}))(body.data.results[0]);
            
            nearby.type = type;
            nearby.lat = body.data.results[0].geometry.location.lat;
            nearby.long = body.data.results[0].geometry.location.lng;
            nearby.distance = await retrieveDistance(nearby.lat, nearby.long);
            return nearby;
        }
    } catch(error) {
        console.log(error);
    }
    
}

async function retrieveDistance(des_lat, des_long) {
    
    DESTINATION_LAT = des_lat;
    DESTINATION_LONG = des_long;

    const distanceURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${SOURCE_LAT},${SOURCE_LONG}&destinations=${DESTINATION_LAT},${DESTINATION_LONG}&key=${API_KEY}`;
    try {
        const body = await axios.get(distanceURL);

        if (body && body.data && body.data.rows && body.data.rows.length > 0 && body.data.rows[0].elements && body.data.rows[0].elements.length > 0) {
            return body.data.rows[0].elements[0].distance.value;
        }
    } catch(error) {
        console.log(error);
    }
}

exports.fillUpNearby = fillUpNearby;