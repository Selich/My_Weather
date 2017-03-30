import React, { Component } from 'react';
import GithubCorner from "react-github-corner";
import './App.css';


const apiKey = "fbbfba46a9559f1b";

const icons = {
   // cloud
   partlycloudy: "cloud",
   mostlycloudy: "cloud",
   fog: "cloud",
   hazy: "cloud",
   cloudy: "cloud",
   // rain
   rain: "rain",
   chancerain: "rain",
   // sun
   clear: "sun",
   sunny: "sun",
   mostlysunny: "sun",
   partlysunny: "sun",
   // snow
   chancesleet: "snow",
   chancessnow: "snow",
   flurries: "snow",
   sleet: "snow",
   snow: "snow",
   chanceflurries: "snow",
   // storm
   tstorms: "storm",
   chancetstorms: "storm",
}


class App extends Component {

   constructor(props){
      super(props);

      this.state = {};

      var options = {
         enableHighAccurancy: true;
         timeout: 5000,
         maximumAge: 0
      };

      if (navigator.geolocation){
      ? navigator.geolocation.getPosition(pos => {
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


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
