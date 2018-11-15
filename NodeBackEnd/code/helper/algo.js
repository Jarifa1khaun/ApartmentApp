const NUMERIC_TYPE = 'NUMERIC';
const BOOLEAN_TYPE = 'BOOLEAN';

async function getSortedArray(criteria, advertisementArray) {    

    if (criteria !== undefined && advertisementArray !== undefined && advertisementArray.length > 0) {
        
        let rankedArray = [];
        for (i in advertisementArray) {

            let totalScore = 0;
            let advertisement = advertisementArray[i];
    
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.rent.value, criteria.rent.priority, advertisement.rent);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.size.value, criteria.size.priority, advertisement.size);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.floor.value, criteria.floor.priority, advertisement.floor);
    
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.rooms.bedroom.value, criteria.rooms.bedroom.priority, advertisement.rooms.bedroom);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.rooms.bathroom.value, criteria.rooms.bathroom.priority, advertisement.rooms.bathroom);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.rooms.kitchen.value, criteria.rooms.kitchen.priority, advertisement.rooms.kitchen);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.rooms.drawing.value, criteria.rooms.drawing.priority, advertisement.rooms.drawing);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.rooms.living.value, criteria.rooms.living.priority, advertisement.rooms.living);
    
            totalScore += getFLPMinisumScore(BOOLEAN_TYPE, criteria.security_guards.value, criteria.security_guards.priority, advertisement.security_guards);
            totalScore += getFLPMinisumScore(BOOLEAN_TYPE, criteria.lift_escalator.value, criteria.lift_escalator.priority, advertisement.lift_escalator);
            totalScore += getFLPMinisumScore(BOOLEAN_TYPE, criteria.parking.value, criteria.parking.priority, advertisement.parking);
    
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.nearby.mosque.value, criteria.nearby.mosque.priority, advertisement.nearby[0].distance);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.nearby.hospital.value, criteria.nearby.hospital.priority, advertisement.nearby[1].distance);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.nearby.school.value, criteria.nearby.school.priority, advertisement.nearby[2].distance);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.nearby.park.value, criteria.nearby.park.priority, advertisement.nearby[3].distance);
            totalScore += getFLPMinisumScore(NUMERIC_TYPE, criteria.nearby.department_store.value, criteria.nearby.department_store.priority, advertisement.nearby[4].distance);
    
            advertisement.rank = totalScore;
            rankedArray.push(advertisement);
        } 
        
        return rankedArray.sort(compare);

    } else {
        return null;
    }    
}

function getFLPMinisumScore(type, factor, weight, dbValue) {

    if (type === NUMERIC_TYPE) {
        return getNumericalDistance(factor, weight, dbValue);
    } else if (type === BOOLEAN_TYPE) {
        return getBooleanDistance(factor, weight, dbValue);
    }
}

function getNumericalDistance(factor, weight, dbValue) {
    if (factor != undefined && !Number.isNaN(factor) &&
        weight != undefined && !Number.isNaN(weight) &&
        dbValue != undefined && !Number.isNaN(dbValue)
    ) {

        return (dbValue - factor) / factor * weight;
    } else {
        return 0;
    }    
}

function getBooleanDistance(factor, weight, dbValue) {
    if (factor != undefined && typeof factor === "boolean" &&
        weight != undefined && !Number.isNaN(weight) &&
        dbValue != undefined && typeof dbValue === "boolean"
    ) { 
        if (factor === dbValue) {
            return 0;
        } else {
            return weight;
        }
    } else {
        return 0;
    }
}

function compare(a, b) {
    if (a.rank < b.rank)
      return -1;
    if (a.rank > b.rank)
      return 1;
    return 0;
}    

exports.getSortedArray = getSortedArray;