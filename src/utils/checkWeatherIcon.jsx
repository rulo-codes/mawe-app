export function checkWeatherIcon(icon, time){
    const date = new Date(time);

    if (Number.isNaN(date.getTime())) return icon;

    const hour = date.getHours();
    const isNight =
        (icon === "clear_sky" || icon === "cloudy_partly") &&
        hour >= 18;

    return isNight ? `${icon}_night` : icon;
}