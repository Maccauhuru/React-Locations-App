import React, { Component } from "react";
import "./css/App.css";
import VenueList from "./Components/VenueList";
import axios from "axios";
import fslogo from "./icons/foursquare-logo-2.png";
import { mapStyle } from './mapstyles/mapStyle';

class App extends Component {
  state = {
    venues: [],
    filteredVenues: [],
    openList: true
  };

  componentDidMount() {
    this.getVenues();
  }

  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJUAE0dT0cjnj5h8bLDbchMcDonakaMrw&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  gm_authFailure=()=>{
  alert("oops.. something went wrong.Please try again later");
  window.gm_authFailure = this.gm_authFailure;
  };

  // get venues data from FourSquare API using axios
  // then set state
  getVenues = () => {
    const endPoint =
      "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "SHDO503U0F2MSXBHTJX34P1TZVE5W515IIPOAQNPZNEITIOO",
      client_secret:
        "COLL2MBW2IHCFOQKL2LUWVXPPL5XXWQ11YD4O3BTD3CE1SER",
      query: "Sushi",
      near: "Dallas",
      v: "20181101"
    };

    axios
      .get(endPoint + new URLSearchParams(parameters))
      .then(response => {
         console.log(response.data.response.groups[0].items);
        this.setState(
          {
            venues: response.data.response.groups[0].items
          },
          this.renderMap()
        );
      })
      .catch(error => {
        console.log(error);
        this.gm_authFailure();
      });
  };

  initMap = () => {
    this.setState({ filteredVenues: this.state.venues });

    const map = new window.google.maps.Map(
      document.getElementById("map"),
      {
        // Dallas coordinates
        center: {
          lat: 32.912624,
          lng: -96.6388833
        },
        zoom: 10,
        styles: mapStyle
      }
    );



    const infowindow = new window.google.maps.InfoWindow();
    this.state.venues.map(myVenue => {
      // Create Markers and bind
      myVenue.marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map: map,
        title: myVenue.venue.name
      });
      // * Infowindow Content
      let contentString = `
      <div class="infowindow">
      <h2>${myVenue.venue.name}</h2>
      <h3>${myVenue.venue.categories[0].name}</h3>
      <img class="category-img" src=${myVenue.venue.categories[0]
        .icon.prefix + "32.png"} alt="category image">
      <p class="location">${myVenue.venue.location.address} <br>
      ${myVenue.venue.location.crossStreet || ""} </p>
      <a href="https://foursquare.com/v/${
        myVenue.venue.id
      }" target="_blank">Read more on<img class="link-logo" src=${fslogo} alt="foursquare logo"></a>
      </div>
      `;
      // Add event listeners to markers
      myVenue.marker.addListener("click", function() {
        // Animate Marker when opened
        myVenue.marker.setAnimation(
          window.google.maps.Animation.BOUNCE
        );
        setTimeout(() => myVenue.marker.setAnimation(null), 2100);
        infowindow.setContent(contentString);
        infowindow.open(map, myVenue.marker);
      });
      return myVenue.marker;
    });
  };

  // venue search by name
  filterVenue = query => {
    if (query) {
      this.state.venues.forEach(venue => {
        if (venue.venue.name.toLowerCase().indexOf(query) >= 0)
          return venue.marker.setVisible(true);
        else venue.marker.setVisible(false);
      })
    } else {
      this.state.venues.forEach(venue =>
        venue.marker.setVisible(true)
      );
    }

    const filterList = this.state.venues
      .filter(myVenue => myVenue.marker.getVisible())
      .map(m => m);
    this.setState({ filteredVenues: filterList });
  };

  toggleList = () => {
    this.setState({
      openList: !this.state.openList
    });
  };

  render() {
    return (
      <main role="main">
        <VenueList
          openList={this.state.openList}
          venues={this.state.filteredVenues}
          filterVenue={this.filterVenue}
        />
        <div id="map" role="application" />
        <nav
          id="toggle-menu"
          className={this.state.openList ? "open" : "closed"}
        >
          <i onClick={() => this.toggleList()}> Toggle Menu</i>
        </nav>
      </main>
    );
  }
}

const loadScript=(url)=> {
  const index = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
  script.onerror =()=>{
    alert('Request could not be completed, please try again later');
  }
}

export default App;
