const priorityConversion = require('../helper/priorityLevels');

async function getSortedArray(criteria, advertisementArray) {

    if (criteria !== undefined && advertisementArray !== undefined && advertisementArray.length > 0) {

        for (i in advertisementArray) {

            let totalScore = 0;
            let advertisement = advertisementArray[i];

            totalScore += getAbsoluteDistance(criteria.rent.value, priorityConversion(criteria.rent.priority), advertisement.rent);
            totalScore += getAbsoluteDistance(criteria.size.value, priorityConversion(criteria.size.priority), advertisement.size);
            totalScore += getAbsoluteDistance(criteria.floor.value, priorityConversion(criteria.floor.priority), advertisement.floor);

            totalScore += getAbsoluteDistance(criteria.rooms.bedroom.value, priorityConversion(criteria.rooms.bedroom.priority), advertisement.rooms.bedroom);
            totalScore += getAbsoluteDistance(criteria.rooms.bathroom.value, priorityConversion(criteria.rooms.bathroom.priority), advertisement.rooms.bathroom);
            totalScore += getAbsoluteDistance(criteria.rooms.kitchen.value, priorityConversion(criteria.rooms.kitchen.priority), advertisement.rooms.kitchen);
            totalScore += getAbsoluteDistance(criteria.rooms.drawing.value, priorityConversion(criteria.rooms.drawing.priority), advertisement.rooms.drawing);
            totalScore += getAbsoluteDistance(criteria.rooms.living.value, priorityConversion(criteria.rooms.living.priority), advertisement.rooms.living);

            totalScore += getBooleanDistance(criteria.security_guards.value, priorityConversion(criteria.security_guards.priority), advertisement.security_guards);
            totalScore += getBooleanDistance(criteria.lift_escalator.value, priorityConversion(criteria.lift_escalator.priority), advertisement.lift_escalator);
            totalScore += getBooleanDistance(criteria.parking.value, priorityConversion(criteria.parking.priority), advertisement.parking);

            totalScore += getNumericalDistance(criteria.nearby.mosque.value, priorityConversion(criteria.nearby.mosque.priority), advertisement.nearby[0].distance);
            totalScore += getNumericalDistance(criteria.nearby.hospital.value, priorityConversion(criteria.nearby.hospital.priority), advertisement.nearby[1].distance);
            totalScore += getNumericalDistance(criteria.nearby.school.value, priorityConversion(criteria.nearby.school.priority), advertisement.nearby[2].distance);
            totalScore += getNumericalDistance(criteria.nearby.park.value, priorityConversion(criteria.nearby.park.priority), advertisement.nearby[3].distance);
            totalScore += getNumericalDistance(criteria.nearby.department_store.value, priorityConversion(criteria.nearby.department_store.priority), advertisement.nearby[4].distance);

            advertisement.rank = totalScore;
        }

        return advertisementArray.sort(compare);

    } else {
        return null;
    }
}

function getAbsoluteDistance(factor, weight, dbValue) {
    if (factor != undefined && !Number.isNaN(factor) &&
        weight != undefined && !Number.isNaN(weight) &&
        dbValue != undefined && !Number.isNaN(dbValue)
    ) {

        return Math.abs((dbValue - factor) / factor * weight);
    } else {
        return 0;
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