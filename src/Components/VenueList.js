import React from "react";
import fspowered from "../images/powered-foursquare.png";
const listitem = "listitem";
const  list = "list";

const VenueList = props => {
  const showInfo = place => {
    window.google.maps.event.trigger(place.marker, "click");
  };

  return (
    <section
      id="venue-list"
      className={props.openList ? "open" : "closed"}
    >
      <h1>Dallas Sushi Bars</h1>
      <input
        aria-label="search input"
        role="search"
        className="search-input"
        type="text"
        placeholder="Filter by Name"
        onChange={event =>
          props.filterVenue(event.target.value.toLocaleLowerCase())
        }
      />
      {props.venues.length > 0 ? (
        <ul role={list}>
          {props.venues.map((venue, index) => {
            // console.log(venue);
            return (
              <li
                key={index}
                role={listitem}
                tabIndex="0"
                onClick={() => showInfo(venue)}
              >
                <a>{venue.venue.name}</a>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul>
          <li> 0 venues found</li>
        </ul>
      )}
      <a href="https://foursquare.com/">
        <img src={fspowered} alt="foursquare attribution" />
      </a>
    </section>
  );
};

export default VenueList;
