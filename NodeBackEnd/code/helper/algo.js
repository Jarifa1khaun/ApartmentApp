const priorityConversion = require('../helper/priorityLevels');

async function getSortedArray(criteria, advertisementArray) {

    if (criteria !== undefined && advertisementArray !== undefined && advertisementArray.length > 0) {

        for (i in advertisementArray) {

            let totalScore = 0;
            let advertisement = advertisementArray[i];

            if (criteria.rent != undefined && criteria.rent.value != undefined && criteria.rent.priority != undefined) {
                totalScore += getAbsoluteDistance(criteria.rent.value, priorityConversion(criteria.rent.priority), advertisement.rent);
            }

            if (criteria.size != undefined && criteria.size.value != undefined && criteria.size.priority != undefined) {
                totalScore += getAbsoluteDistance(criteria.size.value, priorityConversion(criteria.size.priority), advertisement.size);
            }

            if (criteria.floor != undefined && criteria.floor.value != undefined && criteria.floor.priority != undefined) {
                totalScore += getAbsoluteDistance(criteria.floor.value, priorityConversion(criteria.floor.priority), advertisement.floor);
            }
        
            if (criteria.security_guards != undefined && criteria.security_guards.value != undefined && criteria.security_guards.priority != undefined) {
                totalScore += getBooleanDistance(criteria.security_guards.value, priorityConversion(criteria.security_guards.priority), advertisement.security_guards);
            }

            if (criteria.lift_escalator != undefined && criteria.lift_escalator.value != undefined && criteria.lift_escalator.priority != undefined) {
                totalScore += getBooleanDistance(criteria.lift_escalator.value, priorityConversion(criteria.lift_escalator.priority), advertisement.lift_escalator);
            }

            if (criteria.parking != undefined && criteria.parking.value != undefined && criteria.parking.priority != undefined) {
                totalScore += getBooleanDistance(criteria.parking.value, priorityConversion(criteria.parking.priority), advertisement.parking);
            }


            if (criteria.rooms != undefined) {

                if (criteria.rooms.bedroom != undefined && criteria.rooms.bedroom.value != undefined && criteria.rooms.bedroom.priority != undefined) {
                    totalScore += getAbsoluteDistance(criteria.rooms.bedroom.value, priorityConversion(criteria.rooms.bedroom.priority), advertisement.rooms.bedroom);
                }

                if (criteria.rooms.bathroom != undefined && criteria.rooms.bathroom.value != undefined && criteria.rooms.bathroom.priority != undefined) {
                    totalScore += getAbsoluteDistance(criteria.rooms.bathroom.value, priorityConversion(criteria.rooms.bathroom.priority), advertisement.rooms.bathroom);
                }

                if (criteria.rooms.kitchen != undefined && criteria.rooms.kitchen.value != undefined && criteria.rooms.kitchen.priority != undefined) {
                    totalScore += getAbsoluteDistance(criteria.rooms.kitchen.value, priorityConversion(criteria.rooms.kitchen.priority), advertisement.rooms.kitchen);
                }

                if (criteria.rooms.drawing != undefined && criteria.rooms.drawing.value != undefined && criteria.rooms.drawing.priority != undefined) {
                    totalScore += getAbsoluteDistance(criteria.rooms.drawing.value, priorityConversion(criteria.rooms.drawing.priority), advertisement.rooms.drawing);
                }

                if (criteria.rooms.living != undefined && criteria.rooms.living.value != undefined && criteria.rooms.living.priority != undefined) {
                    totalScore += getAbsoluteDistance(criteria.rooms.living.value, priorityConversion(criteria.rooms.living.priority), advertisement.rooms.living);
                }
            }

            // nearby

            if (criteria.nearby != undefined) {

                if (criteria.nearby.mosque != undefined && criteria.nearby.mosque.value != undefined && criteria.nearby.mosque.priority != undefined) {
                    totalScore += getNumericalDistance(criteria.nearby.mosque.value, priorityConversion(criteria.nearby.mosque.priority), advertisement.nearby[0].distance);
                }

                if (criteria.nearby.hospital != undefined && criteria.nearby.hospital.value != undefined && criteria.nearby.hospital.priority != undefined) {
                    totalScore += getNumericalDistance(criteria.nearby.hospital.value, priorityConversion(criteria.nearby.hospital.priority), advertisement.nearby[1].distance);
                }

                if (criteria.nearby.school != undefined && criteria.nearby.school.value != undefined && criteria.nearby.school.priority != undefined) {
                    totalScore += getNumericalDistance(criteria.nearby.school.value, priorityConversion(criteria.nearby.school.priority), advertisement.nearby[2].distance);
                }

                if (criteria.nearby.park != undefined && criteria.nearby.park.value != undefined && criteria.nearby.park.priority != undefined) {
                    totalScore += getNumericalDistance(criteria.nearby.park.value, priorityConversion(criteria.nearby.park.priority), advertisement.nearby[3].distance);
                }

                if (criteria.nearby.department_store != undefined && criteria.nearby.department_store.value != undefined && criteria.nearby.department_store.priority != undefined) {
                    totalScore += getNumericalDistance(criteria.nearby.department_store.value, priorityConversion(criteria.nearby.department_store.priority), advertisement.nearby[4].distance);
                }
            }

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