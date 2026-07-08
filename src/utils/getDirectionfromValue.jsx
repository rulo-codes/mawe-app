export function getDirectionfromValueShort(value) {
    if (value === null || value === undefined || value === "") {
        return "--";
    }

    const degrees = Number(value);

    if (Number.isNaN(degrees)) {
        return "--";
    }

    const normalized = ((degrees % 360) + 360) % 360;
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(normalized / 22.5) % directions.length;

    return directions[index];
}

export function getDirectionfromValueLong(value) {
    if (value === null || value === undefined || value === "") {
        return "--";
    }

    const degrees = Number(value);

    if (Number.isNaN(degrees)) {
        return "--";
    }

    const normalized = ((degrees % 360) + 360) % 360;
    const directions = ["North", "North-Northeast", "North-East", "East-Northeast", "East", "East-Southeast", "South-East", "South-Southeast", "South", "South-Southwest", "South-West", "West-Southwest", "West", "West-Northwest", "North-West", "North-Northwest"];
    const index = Math.round(normalized / 22.5) % directions.length;

    return directions[index];
}