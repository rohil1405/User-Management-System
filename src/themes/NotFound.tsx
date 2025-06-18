import { Link } from "react-router-dom";
import notFoundImg from "../images/404.png";

const NotFound = () => (
  <div className="not-found-wrap">
    <div className="container">
      <div className="not-found">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="not-found-content">
              <h1 className="text-center">
                404 <br></br>Page Not Found
              </h1>
              <p>The page you are looking for does not exist.</p>
              <p>
                The page you are looking for was moved, removed, renamed or
                might never existed
              </p>
              <div className="cta">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="not-found-img">
              <img src={notFoundImg} width={593} height={493} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NotFound;
