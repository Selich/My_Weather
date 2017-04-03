
import React, { Component } from 'react';
import GithubCorner from "react-github-corner";
import './App.css';

const WUNDERGROUND_KEY = "b56f2c0800fdf6e4";

const ICON_SET = {
    chancesleet: "snowy",
    chancesnow: "snowy",
    clear: "sunny",
    flurries: "snowy",
    fog: "cloudy",
    hazy: "cloudy",
    rain: "rainy",
    chancerain: "rainy",
    sleet: "snowy",
    snow: "snowy",
    chanceflurries: "snowy",
    tstorms: "stormy",
    chancetstorms: "stormy",
    sunny: "sunny",
    mostlysunny: "sunny",
    partlysunny: "sunny",
    partlycloudy: "cloudy",
    mostlycloudy: "cloudy",
    cloudy: "cloudy"
};

function getIcon(icon) {
    return ICON_SET[icon];
}

function getTemp (text) {
    return (text.match(/(\-?[0-9]+)/) || [])[1];
}


class App extends Component {

  constructor (props) {
      super(props);
      this.state = {};

      var options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
      };

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
              this.setState({
                  coordinates: pos.coords
              });
              this.check();
          }, () => {
              this.check();
          }, options);
      }

      this.check();

      setInterval(() => this.check(), 10 * 60 * 1000);
  }

  check () {
      fetch("https://ipinfo.io/json")
        .then(res => res.json())
        .then(ip => {
            let crd = this.state.coordinates;
            crd = crd || {
                latitude: +ip.loc.split(",")[0]
              , longitude: +ip.loc.split(",")[1]
            }
            const query = [crd.latitude, crd.longitude].join(",");
            const WUNDERGROUND_URL = `https://api.wunderground.com/api/${WUNDERGROUND_KEY}/forecast/lang:en/q/${query}.json`;
            return fetch(WUNDERGROUND_URL)
        })
        .then(c => c.json())
        .then(forecast => {
            this.setState({
                forecast
            });
        });
  }

  renderWeatherToday () {
      const today = this.state.forecast.forecast.txt_forecast.forecastday[0];
      const temp = getTemp(today.fcttext_metric);


      let icon = getIcon(today.icon);
      let hours = new Date().getHours();
      if ((icon === "sunny" || icon === "clear") && (hours > 20 || hours < 7)) {
          icon = "starry";
          document.body.style.backgroundColor =  "#00111e";
      }

      if (icon === "sunny") {
          document.body.style.backgroundColor =  "#87cefa";
          document.body.style.transition =  "2s";
      }
      if (icon === "cloudy" || icon === "stormy") {
          document.body.style.backgroundColor =  "#bbb";
          document.body.style.transition =  "2s";
      }

      if (icon === "rainy") {
          document.body.style.backgroundColor =  "#ADACA9";
          document.body.addClass = "rain"
          document.body.style.transition =  "2s";
      }


      if (temp) {
          var tempElm = <div className="big-temp">{temp}</div>;
      }

      return (
          <div className="weather-today">
            <div className="icon-wrapper">
                <div className={`icon-big ${icon}`}>
                </div>
                {tempElm}
            </div>
            <p className="icon-description">{today.fcttext_metric}</p>
          </div>
      );
  }

  renderDay ( day, index) {
      const temp = getTemp(day.fcttext_metric);
      if (temp) {
          var tempElm = <div className="small-temp">{temp}</div>;
      }

      return (
            <div className="day" key={index}>
                <div className="day-description">
                    {day.fcttext_metric}
                </div>
                <div className="icon-wrapper">
                    <div className={`icon-small ${getIcon(day.icon)}`}>
                    </div>
                    {tempElm}
                </div>
            </div>
      );
  }

  renderNextDays () {
      const nextDays = []
          , data = this.state.forecast.forecast.txt_forecast.forecastday
          ;

      for (var i = 2; i < data.length; i += 2) {
        nextDays.push(data[i])
      }

      return (
          <div className="weather-next-days">
            {nextDays.map((c, i) => this.renderDay(c, i))}
          </div>
      );
  }

  renderWeather () {
      if (!this.state.forecast) {
          return (
            <div className="weather-container">
                <div className="drip"></div>
                <p>Loading...</p>
            </div>
         );
      }
      return (
        <div className="weather-container">
            {this.renderWeatherToday()}
            {this.renderNextDays()}
        </div>
      );
  }

  render() {
    return (
        <div>
            <GithubCorner
                href="https://github.com/Selich/My_Weather"
                bannerColor="white"
                octoColor="black"
                width={80}
                height={80}
                direction="left"
            />
            <div className="row">
                  <div className="col-md-6">
                     <div className="app">
                      {this.renderWeather()}
                     </div>
               </div>
            </div>
        </div>
    );
  }
}

export default App;
