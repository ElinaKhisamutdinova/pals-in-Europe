import React from "react";
import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { getInputSagaAC } from "../redux/actionCreators/inputAC";
import "./StartPage.scss";
import { RootStateValue } from "../redux/reducers/rootReducer";

const StartPage = () => {
  const [search, setSearch] = useState("")
  let history = useHistory();
  const dispatch = useDispatch();
  const categoryFromSelector = useSelector((state: RootStateValue) => state.categories)
  const onlyCategories = categoryFromSelector.map((el) => el.category);
  const filterCategories = onlyCategories.filter((el) => el[0] == search)
  console.log(filterCategories);
  // const onChangeFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearch(event.target.value)
  //   dispatch(getInputSagaAC(event.target.value))
  // }

  const sumbitHandler = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    history.push(`/search/${search}`);
  }, [search, history]);

  return (
    <div className="d-flex flex-column align-items-center mainDiv">
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="img/1.jpg" className="d-block w-100" alt="ss" />
          </div>
          <div className="carousel-item">
            <img src="img/2.jpg" className="d-block w-100" alt="ss" />
          </div>
          <div className="carousel-item">
            <img src="img/1.jpg" className="d-block w-100" alt="ss" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Предыдущий</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Следующий</span>
        </button>
      </div>
      <form onSubmit={sumbitHandler} className="d-flex justify-content-center">
        <input
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => setSearch(event.target.value)}
          className="form-control me-2 mainInput"
          type="search"
          value={search}
          placeholder="Search"
          aria-label="Search" />
        <button className="btn btnSearch" type="submit">Search</button>
      </form>
      <div>{filterCategories}</div>
    </div>
  )
}

export default React.memo(StartPage)
