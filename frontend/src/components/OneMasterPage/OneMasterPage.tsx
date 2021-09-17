import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import "./OneMasterPage.scss";
import css from "./Modal.module.css";
import { Master, Review } from "../../redux/initState";
import { RootStateValue } from "../../redux/reducers/rootReducer";
import { DatePicker, TimePicker } from "antd";
import { Moment } from "moment";
import moment from "moment";
type IdParams = {
  id: string;
};

export const OneMasterPage = () => {
  const [oneMasterObj, setOneMasterObj] = useState<Master>();
  const [show, setShow] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [comment, setComment] = useState("");
  const [service, setService] = useState("");
  const [newReview, setNewReview] = useState("");
  const [reviewsOnly, setReviewsOnly] = useState<Review[]>([])
  const { id } = useParams<IdParams>();
  const selectorMasters = useSelector((state: RootStateValue) => state.masters);
  const session = useSelector((state: RootStateValue) => state);
  // console.log('session ===>', session);

  useEffect(() => {
    if (selectorMasters.length > 0) {
      const master = selectorMasters.find((el) => el._id === id)
      if (master) {
        setOneMasterObj(master);
        setReviewsOnly(master.reviews);
      }
    }
  }, [selectorMasters, id]);

  const onClick = () => {
    setShow(true);
  };

  // const onClickReview = () => {
  //   setReviewModal(true);
  // };

  const closeModal = () => {
    setShow(false);
  }

  const closeModal2 = () => {
    setReviewModal(false)
  }

  const onSubmit = (event: any) => {
    event.preventDefault();
    fetch("http://localhost:8080/user/addOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: session.user.userID,
        comment,
        date: event.target.date.value,
        time: event.target.time.value,
        service,
        masterID: id,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "success") {
          setShow(false);
          setComment("");
          setService("");
          alert("Your application is accepted!");
        } else {
          alert("something went wrong");
        }
      });
  };

  const onReviewSubmit = (event: any) => {

    event.preventDefault();
    fetch("http://localhost:8080/user/addReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: session.user.userID,
        newReview,
        masterID: id,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          reviewsOnly.push(result)
          setReviewModal(false);
          setNewReview("");
          alert("Your review has been published!");
        } else {
          alert("something went wrong");
        }
      });
  };

  function onChange(date: Moment | null, dateString: string) {
    // console.log(date, dateString);
  }

  return (
    <>
      {show ? (
        <>
          <div className={show ? css.overlay : css.hide}>
            <form onSubmit={onSubmit} className={show ? css.modal : css.hide}>
              <div className={css.exit}>
                <p className={css.nameModalMaster}>You have chosen the master: {oneMasterObj?.name}</p>
                <button onClick={closeModal} className={css.xBtn}>X</button>
              </div>
              <DatePicker className={css.inputModalMaster} name="date" onChange={onChange} />
              <div className={css.divMargin} />
              <TimePicker
                className={css.inputModalMaster}
                name="time"
                defaultValue={moment("12:08", "HH:mm")}
                format={"HH:mm"}
              />
              <input
                className={css.inputModalMaster}
                placeholder="service"
                value={service}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
                  setService(ev.target.value)
                }
              />
              <input
                className={css.inputModalMaster}
                placeholder="comment for the master"
                value={comment}
                style={{ height: 100 }}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
                  setComment(ev.target.value)
                }
              />
              <button className={css.btn} type="submit">
                Отправить
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div>Нет модального окна</div>
        </>
      )}
      {reviewModal ? (
        <>
          <div className={reviewModal ? css.overlay : css.hide}>
            <form onSubmit={onReviewSubmit} className={reviewModal ? css.modal : css.hide}>
              <div className={css.exit}>
                <p className={css.nameModalMaster}>Write a review to the master {oneMasterObj?.name}</p>
                <button onClick={closeModal2} className={css.xBtn}>X</button>
              </div>
              <input
                placeholder="review for the master"
                value={newReview}
                className={css.inputModule2}
                style={{ height: 70 }}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
                  setNewReview(ev.target.value)
                }
              />
              <button className={css.btn} type="submit">
                Отправить
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div>Нет модального окна</div>
        </>
      )}
      <div className="idMasterDiv">
        <img className="masterPicture" src={oneMasterObj ? oneMasterObj.picture : ""} alt="" />
        <div className="idHead">
          <div className="nameAndJob">
            <div>
              <div className="name">
                {oneMasterObj ? oneMasterObj.name : ""}
              </div>
              <div className="job">
                Master {oneMasterObj ? oneMasterObj.category.category : ""}
              </div>
            </div>
            <div className="ratingAndExperience">
              <div className="rating">
                Rating: {oneMasterObj ? oneMasterObj.rating : ""}
              </div>
              <div className="experience">
                Experience: {oneMasterObj ? oneMasterObj.experience : ""}
              </div>
            </div>
          </div>
          <div className="buttons">
            {session.user.role === "user" ? (
              <button
                onClick={onClick}
                className="btn contactBtn"
                type="submit"
              >
                Make an appointment
              </button>
            ) : (
              ""
            )}
            {/* {session.user.role === "user" ? (
              <button
                onClick={onClickReview}
                className="btn reviewBtn"
                type="submit"
              >
                Write a review
              </button>
            ) : (
              ""
            )} */}
          </div>
        </div>
        <hr className="dropdown-divider" />
        <div className="idBody">
          <div className="leftDiv">
            <div className="leftSide">
              <div className="info">INFORMATION</div>
              <div className="description">
                {oneMasterObj ? oneMasterObj.description : ""}
              </div>
            </div>
            <div className="reviewsTitle">REVIEWS</div>
            <div className="masterReviews">
              {reviewsOnly.map((review, index) => (
                <div className="oneReviewMaster" key={review._id}>
                  <div className="nameText">
                    {review.author.picture ? <img className="authorPicture" src={review.author.picture} alt="" /> : ""}
                    {review.author.name ? <div className="authorName">{review.author.name}</div> :
                      <div className="authorName">{review.author.login}</div>
                    }
                  </div>
                  <div className="oneReviewText">{review.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="location">
            <div className="ymaps">
              <YMaps>
                {oneMasterObj ? (
                  <Map
                    defaultState={{
                      center: [
                        oneMasterObj.location.coordinates[1],
                        oneMasterObj.location.coordinates[0],
                      ],
                      zoom: 8,
                    }}
                    className="map"
                  >
                    <Placemark
                      geometry={[
                        oneMasterObj.location.coordinates[1],
                        oneMasterObj.location.coordinates[0],
                      ]}
                    />
                  </Map>
                ) : (
                  ""
                )}
              </YMaps>
            </div>
            <div className="links">
              <div className="city">
                City: {oneMasterObj ? oneMasterObj.location.city : ""}
              </div>
              <hr className="dropdown-divider" />
              <div className="contacts">CONTACTS:</div>
              <div>{oneMasterObj ? oneMasterObj.phoneNumber : ""}</div>
              <div>{oneMasterObj ? oneMasterObj.email : ""}</div>
              {oneMasterObj
                ? oneMasterObj.socialMediaLinks.map((el, index) => (
                  <Link to={el} key={index}>
                    {el}
                  </Link>
                ))
                : ""}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default React.memo(OneMasterPage);
