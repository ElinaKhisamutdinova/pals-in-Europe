import React, { ChangeEvent, useEffect } from "react";
import { useState } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { Master } from "../../redux/initState";
import { useDispatch, useSelector } from "react-redux";
import { getMastersAC } from "../../redux/actionCreators/mastersAC";
import CardMaster from "../CardMaster/CardMaster";
import "./Map.scss";
import { RootStateValue } from "../../redux/reducers/rootReducer";
import { Link } from "react-router-dom";

export const ShowMasters = () => {
  const [show, setShow] = useState(false);
  const [chosenMaster, setChosenMaster] = useState<Master>();
  const [showMasters, setShowMasters] = useState<Master[]>([]);
  const [chosenCategory, setChosenCategory] = useState("");
  const [chosenLocation, setChosenLocation] = useState("");
  const dispatch = useDispatch();
  const categories = useSelector((state: RootStateValue) => state.categories);
  const masters = useSelector((state: RootStateValue) => state.masters);
  const search = useSelector((state: RootStateValue) => state.search);

  useEffect(() => {
    fetch("http://localhost:8080/master/")
      .then((res) => res.json())
      .then((result) => {
        dispatch(getMastersAC(result.masters));
      });
  }, [dispatch]);
  // console.log("mastersRedux ===>", masters);

  const [cities, setCities] = useState<string[]>([]);

  const findMastersBtn = (
    event: React.FormEvent,
    category: string,
    location: string
  ) => {
    event.preventDefault();
    if (
      category !== "" &&
      location !== "" &&
      category !== "all" &&
      location !== "all"
    ) {
      const all = masters.filter(
        (master) =>
          master.category.category === category &&
          master.location.city === location
      );
      setShowMasters(all);
    } else if (category !== "" && category !== "all") {
      const all = masters.filter(
        (master) => master.category.category === category
      );
      setShowMasters(all);
    } else if (location !== "" && location !== "all") {
      setShowMasters(
        masters.filter((master) => master.location.city === location)
      );
    } else if (category === "all" && location === "all") {
      setShowMasters(masters);
    }
    setChosenCategory("all");
    setChosenLocation("all");
  };

  const findCategories = (e: ChangeEvent<HTMLSelectElement>) => {
    setChosenCategory(e.target.value);
  };
  const findLocation = (e: ChangeEvent<HTMLSelectElement>) => {
    setChosenLocation(e.target.value);
  };

  useEffect(() => {
    if (masters.length > 0) {
      if (search.category !== "") {
        setShowMasters(
          masters.filter(
            (master) => master.category.category === search.category
          )
        );
      } else {
        setShowMasters(masters);
      }
    }
    fetch("http://localhost:8080/location/")
      .then((res) => res.json())
      .then((result) => {
        const uniqueCities: string[] = [];
        for (let i = 0; i < result.locations.length; i++) {
          if (!uniqueCities.includes(result.locations[i].city)) {
            uniqueCities.push(result.locations[i].city);
          }
        }
        setCities(uniqueCities.sort((a, b) => a.localeCompare(b)));
      });
  }, [masters, search, search.category]);

  const placemarkClick = (master: Master) => {
    setShow((prev) => !prev);
    setChosenMaster(master);
  };

  return (
    <div className="maindiv">
      <div className="mastersDiv">
        <span>Our masters: {showMasters.length}</span>
        <div className="selects">
          <div>
            <p>Category</p>
            <select
              className="form-select selectone"
              required
              aria-label="select example"
              name="category"
              id=""
              onChange={findCategories}
              value={chosenCategory}
            >
              <option value="all">All categories</option>
              {categories
                ? categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))
                : ""}
            </select>
          </div>

          <div>
            <p>Location</p>
            <select
              className="form-select selectone"
              required
              aria-label="select example"
              name="location"
              id=""
              onChange={findLocation}
              value={chosenLocation}
            >
              <option value="all">All locations</option>
              {cities
                ? cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))
                : ""}
            </select>
          </div>
        </div>

        <button
          className="btnFind"
          onClick={(e) => findMastersBtn(e, chosenCategory, chosenLocation)}
        >
          Find a master
        </button>

        <div className="cards">
          {showMasters.length > 0 ? (
            showMasters.map((master) => (
              <CardMaster key={master._id} master={master} />
            ))
          ) : (
            <div>No masters found</div>
          )}
        </div>
      </div>
      <div className="ymaps">
        <YMaps>
          <Map
            defaultState={{
              center: [52.450598158020995, 4.892641117642952],
              zoom: 8,
            }}
            className="map"
          >
            {showMasters
              ? showMasters.map((el) => {
                  if (el.location && el.location.coordinates) {
                    return (
                      <Placemark
                        hintContent="Hey"
                        key={el._id}
                        onClick={() => placemarkClick(el)}
                        geometry={[
                          el.location.coordinates[1],
                          el.location.coordinates[0],
                        ]}
                      />
                    );
                  } else {
                    return "";
                  }
                })
              : ""}
            {show && (
              <div className={show ? "overlayMap" : "hide"}>
                <form className={show ? "modalMap" : "hide"}>
                  <Link to={`/master/${chosenMaster?._id}`}>
                    <div className="nameAndCategoryModal">
                      <p className="nameModal">
                        {chosenMaster ? chosenMaster?.name : ""}
                      </p>
                      <p className="categoryModal">
                        {chosenMaster ? chosenMaster?.category.category : ""}
                      </p>
                    </div>
                    <img
                      className="modalImgMap"
                      src={chosenMaster ? chosenMaster?.picture : ""}
                      alt=""
                    />
                  </Link>
                  <button
                    className="btn modalBtn"
                    onClick={() => setShow(false)}
                  >
                    Close
                  </button>
                </form>
              </div>
            )}
          </Map>
        </YMaps>
      </div>
    </div>
  );
};
