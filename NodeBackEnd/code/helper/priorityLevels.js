const priorityLevels = Object.freeze({
    HIGHEST: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
    LOWEST: 5
});

module.exports = function (priorityText) {

    let index;

    objectKeys = Object.keys(priorityLevels);
    objectValues = Object.values(priorityLevels);

    for (i in objectKeys) {
        if (objectKeys[i] === priorityText) {
            index = i;
        }
    }

    return objectValues[index];
}