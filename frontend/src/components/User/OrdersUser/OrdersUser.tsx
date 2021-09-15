import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMasterAccountAC } from '../../../redux/actionCreators/masterAC';
import { Order } from "../../../redux/initState";
import { RootStateValue } from '../../../redux/reducers/rootReducer';
import css from "../User.module.css";
export const OrdersUser = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getUserOrders = async () => {
      const response = await fetch("http://localhost:8080/user/orders", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
      });
      const result = await response.json();
      // console.log('getUserOrders ===>', result);
      setOrders(result.userOrders)
    };
    getUserOrders();
  }, []);
  // console.log(orders);


  return (
    <div className={css.userAccount}>
      <div className={css.link}>
        <Link to='/account'>
          <button className={css.btn}>My profile</button>
        </Link>
        <Link to='/account/edit'>
          <button className={css.btn}>Edit profile</button>
        </Link>
        <Link to='/account/orders'>
          <button className={css.btn}>My orders</button>
        </Link>
        <Link to='/account/reviews'>
          <button className={css.btn}>Rewievs</button>
        </Link>
      </div>
      <h4>My orders</h4>
      {orders ?
        orders.map((order, index) => (
          <div className={css.orderCard} key={index}>
            <div className={css.orderInfo}><span>Order information:</span>
              <div>№ {order.number},
                date of creation: {order.createdAt.slice(0, 10)}</div>
                <div className={css.status}>status: {order.status}</div>
            </div>
            <div><span>Master:</span>
              <div> {order.master.name}, {order.master.email}</div>
            </div>
            <div><span>Service request:</span>
              <div>Date: {order.date},
                service: {order.service}
              </div>
            </div>
          </div>
        ))

        :
        <div>You have no orders</div>
      }
    </div>
  );
}


