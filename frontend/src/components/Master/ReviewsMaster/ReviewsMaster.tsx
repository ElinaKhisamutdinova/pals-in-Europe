import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootStateValue } from "../../redux/reducers/rootReducer";
import css from "../Master.module.css";
import { Link } from "react-router-dom";
import { Master } from "../../redux/initState";
// import { getAuthorsReviewsAC } from "../../redux/actionCreators/mastersAC";

interface Review {
  _id: object;
  author: object;
  text: string;
  createdAt: any;
}

type Reviews = Review[];

export const ReviewsMaster = () => {
  const [reviews, setReviews] = useState<Reviews>();
  const dispatch = useDispatch();
  const masters = useSelector((state: RootStateValue) => state.masters);
  const user = useSelector((state: RootStateValue) => state.user);
  // console.log('ReviewsMaster tsx 111===>', masters);

  useEffect(() => {
    const masterReviews = masters.find((el) => el._id === user.masterID);
    // console.log('masterReviews !!!!!!!!!!! ====>', masterReviews?.reviews);
    //@ts-ignore
    setReviews(masterReviews)
  }, [masters, user.masterID]);

  // console.log('ReviewsMaster tsx 222===>', reviews);
  return (

    <div className={css.masterAccount}>
      <div className={css.link}>
        <Link to='/account'>
          <button className={css.btn}>My profile</button>
        </Link>
        <Link to='/account/orders'>
          <button className={css.btn}>My orders</button>
        </Link>
        <Link to='/account/edit'>
          <button className={css.btn}>Edit profile</button>
        </Link>
        <Link to='/account/reviews'>
          <button className={css.btn}>Rewievs</button>
        </Link>
      </div>

      <div>

        {//@ts-ignore
          reviews?.reviews.map(
            (review: Review) => {
              return (
                <div className={css.reviews}>
                  <img
                    //@ts-ignore
                    src={review?.author?.picture} alt='' />
                  <div className={css.text}>
                    <div><span className={css.span}>Author:</span>{
                      //@ts-ignore
                      review?.author?.login} , <span className={css.span}>date:</span>{review && review?.createdAt.slice(0, 10)} , <span className={css.span}>rating:</span> {
                        //@ts-ignore
                        review?.author?.rating}</div>

                    <div>
                      <span className={css.span}>Review:</span> {review && review?.text}
                    </div> 
                  </div>

                </div>
              )
            })
        }

      </div>

    </div>
  );
};
