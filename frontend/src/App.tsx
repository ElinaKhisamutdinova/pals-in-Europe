import Header from "./components/Header/Header";
import { ShowMasters } from "./components/ShowMasters/Map";
import StartPage from "./components/StartPage/StartPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserLogin } from "./components/User/UserLogin/UserLogin";
import { UserSignup } from "./components/User/UserSignup/UserSignup";
import { MasterLogin } from "./components/Master/MasterLogin/MasterLogin";
import { MasterSignup } from "./components/Master/MasterSignup/MasterSignup";
import { EditUserProfile } from "./components/User/EditUserProfile/EditUserProfile";
import { EditMasterProfile } from "./components/Master/EditMasterProfile/EditMasterProfile";
import { UserAccount } from "./components/User/UserAccount/UserAccount";
import { MasterAccount } from "./components/Master/MasterAccount/MasterAccount";
import { AdminAccount } from "./components/Admin/AdminAccount/AdminAccount";
import { OrdersMaster } from "./components/Master/OrdersMaster/OrdersMaster";
import { OrdersUser } from "./components/User/OrdersUser/OrdersUser";
import { ReviewsUser } from "./components/User/ReviewsUser/ReviewsUser";
import { ReviewsMaster } from "./components/Master/ReviewsMaster/ReviewsMaster";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserAC } from "./redux/actionCreators/userAC";
import { RootStateValue } from "./redux/reducers/rootReducer";
import {
  getCategoriesAC,
} from "./redux/actionCreators/categoryAC";
import { getMastersAC } from "./redux/actionCreators/mastersAC";
import OneMasterPage from "./components/OneMasterPage/OneMasterPage";
import { CalendarComponent } from "./components/Calendar/Calendar";
import { UserCalendarComponent } from "./components/CalendarUser/CalendarUser";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootStateValue) => state.user);

  useEffect(() => {
    dispatch(getUserAC());
  }, [dispatch, user.role]);


  useEffect(() => {
    fetch("http://localhost:8080/categories/")
      .then((res) => res.json())
      .then((res) => {
        const categoriesArr: string[] = [];
        for (let i = 0; i < res.categoriesFind.length; i++) {
          if (!categoriesArr.includes(res.categoriesFind[i])) {
            categoriesArr.push(res.categoriesFind[i]);
          }
        }
        dispatch(getCategoriesAC(categoriesArr));
      });
    fetch("http://localhost:8080/master/")
      .then((res) => res.json())
      .then((result) => {
        dispatch(getMastersAC(result.masters));
      });
  }, [dispatch]);


  // console.log(user.role);
  return (
    <div>
      <Router>
        <Header />
        <div>
          <Switch>
            <Route exact path="/showmasters">
              <ShowMasters />
            </Route>
            <Route exact path="/">
              <StartPage />
            </Route>
            <Route exact path="/user/login">
              {!user.name ? <UserLogin /> : <StartPage />}
            </Route>
            <Route exact path="/user/signup">
              {!user.name ? <UserSignup /> : <StartPage />}
            </Route>

            <Route exact path="/master/login">
              {!user.name ? <MasterLogin /> : <StartPage />}
            </Route>
            <Route exact path="/master/signup">
              {!user.name ? <MasterSignup /> : <StartPage />}
            </Route>
            <Route exact path="/search">
              <ShowMasters />
            </Route>
            <Route exact path="/account">
              {user.role === "user" ? <UserAccount /> : <MasterAccount />}
            </Route>
            <Route exact path="/account/edit">
              {user.role === "user" ? (
                <EditUserProfile />
              ) : (
                <EditMasterProfile />
              )}
            </Route>
            <Route exact path="/account/orders">
              {user.role === "user" ? <OrdersUser /> : <OrdersMaster />}
            </Route>
            <Route exact path="/account/reviews">
              {user.role === "user" ? <ReviewsUser /> : <ReviewsMaster />}
            </Route>
            <Route exact path="/admin/account">
              <AdminAccount />
            </Route>
            <Route exact path="/master/:id">
              <OneMasterPage />
            </Route>
            <Route exact path="/calendar">
            {user.role === "user" ? <UserCalendarComponent /> : <CalendarComponent /> }
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
