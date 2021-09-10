import React, { ChangeEvent, MouseEventHandler } from "react";
import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./StartPage.scss";
import { RootStateValue } from "../redux/reducers/rootReducer";
import Slider from "./Slider/Slider";

const StartPage = () => {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [noCategories, setNoCategories] = useState(false);
  const [filterCategories, setfilterCategories] = useState<string[]>([]);
  let history = useHistory();
  // const dispatch = useDispatch();
  const categoryFromSelector = useSelector(
    (state: RootStateValue) => state.categories
  );
  // console.log(categoryFromSelector);
  // const onChangeFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearch(event.target.value)
  //   dispatch(getInputSagaAC(event.target.value))
  // }

  const chooseCategory = (value: string) => {
    setSearch(value);
    if (value.length === 0) {
      setfilterCategories([]);
      setShow(false);
      setNoCategories(false);
    } else {
      const regexp = new RegExp(value, "i");
      const check = categoryFromSelector.filter((el) => {
        const returnCheck = el.match(regexp);
        if (returnCheck) {
          return returnCheck;
        }
      });
      setfilterCategories(check);
      if (check.length > 0) {
        setShow(true);
      } else {
        setNoCategories(true);
      }
    }
  };

  const sumbitHandler = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      history.push(`/search/${search}`);
    },
    [search, history]
  );

  const getTheRightSearch = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    text: React.SetStateAction<string>
  ) => {
    event.preventDefault();
    setSearch(text);
    setfilterCategories([]);
  };

  return (
    <div className="d-flex flex-column align-items-center mainDiv">
      <Slider />
      <form onSubmit={sumbitHandler} className="d-flex justify-content-center">
        <input
          onChange={(e) => chooseCategory(e.target.value)}
          className="form-control me-2 mainInput"
          type="search"
          value={search}
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btnSearch" type="submit">
          Search
        </button>
      </form>
      {/* @ts-ignore */}
      {filterCategories && setShow
        ? filterCategories.map((el, index) => (
          <div key={index} onClick={(e) => getTheRightSearch(e, el)}>
            {el}
          </div>
        ))
        : ""}
      {noCategories ? <div>We don't have such a category</div> : ""}
    </div>
  );
};

export default React.memo(StartPage);
