import weather1 from "./../assets/weather1.png";
import weather2 from "./../assets/weather2.png";
import weather3 from "./../assets/weather3.png";
import weather4 from "./../assets/weather4.png";
import weather5 from "./../assets/weather5.png";

export function getWeatherImage(weatherId) {
  switch (weatherId) {
    case 1:
      return weather1;
    case 2:
      return weather2;
    case 3:
      return weather3;
    case 4:
      return weather4;
    case 5:
      return weather5;
    default:
      return null;
  }
}
