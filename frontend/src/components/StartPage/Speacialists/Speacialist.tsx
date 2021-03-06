import React from "react";

import { Link } from "react-router-dom";
import "./specialists.scss";

const Specialist = () => {
  return (
    <div className="main">
      <div className="bord">
        <a
          className="second"
          href="mailto:palsInEurope@gmail.com?subject=I%can%20recomment%20someone"
        >
          <img src="img/sp1.jpeg" alt="" />
          <div className="info">
            <p className="title">Do you know a specialist?</p>
            <p>Let us know!</p>
            <button className="btn">Send a message</button>
          </div>
        </a>
      </div>
      <div className="bord">
        <Link className="second" to="/master/signup">
          <img src="img/sp2.jpeg" alt="" />
          <div className="info">
            <p className="title">Are you a specialist?</p>
            <p>Sign up!</p>
            <button className="btn">Fill in the form</button>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default React.memo(Specialist);
