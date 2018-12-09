const axios = require('axios');
const geolib = require('geolib');

async function fillUpNearby (source_lat, source_long) {
    
    let nearbyArray = [];
    const typeArray = ['mosque', 'hospital', 'school', 'park', 'department_store'];
        
    for (let i in typeArray) {
        const returnVal = await getNearbyInformation(source_lat, source_long, typeArray[i]);
        nearbyArray.push(returnVal);
    }
    return nearbyArray;
}

async function getNearbyInformation(source_lat, source_long, type) {

    let nearby;
    const api_key = process.env.API_KEY;
    const nearbyURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${source_lat},${source_long}&type=${type}&rankby=distance&key=${api_key}`;

    try {
        const body = await axios.get(nearbyURL);    
        if (body && body.data && body.data.results && body.data.results.length > 0) {


            nearby = (({name, id, place_id, vicinity, photos}) => 
                    ({name, id, place_id, vicinity, photos}))(body.data.results[0]);
            
            nearby.type = type;
            nearby.lat = body.data.results[0].geometry.location.lat;
            nearby.long = body.data.results[0].geometry.location.lng;
            nearby.distance = await getDistanceBetweenCoordinates(source_lat, source_long, nearby.lat, nearby.long);
            return nearby;
        }
    } catch(error) {
        console.log(error);
    }
}

async function getDistanceBetweenCoordinates(source_lat, source_long, des_lat, des_long) {
    
    return geolib.getDistance(
        {latitude: source_lat, longitude: source_long},
        {latitude: des_lat, longitude: des_long}
    );
}

async function isPointInCircle(center_lat, center_long, obj_lat, obj_long, radius) {
    
    return geolib.isPointInCircle(
        {latitude: obj_lat, longitude: obj_long},
        {latitude: center_lat, longitude: center_long},
        radius
    );
}

exports.fillUpNearby = fillUpNearby;
exports.getDistanceBetweenCoordinates = getDistanceBetweenCoordinates;
exports.isPointInCircle = isPointInCircle;