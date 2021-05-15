import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Logo from "./images/logo.jpg";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
const api = axios.create({
  baseURL: "https://secret-be.herokuapp.com/",
});
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
let Home = function () {
  return (
    <div>
      This utility lets you send a secret message to the recipient email of
      choice. Select Send Secret Message option to start sending one...
    </div>
  );
};

let GetMessage = function () {
  let query = useQuery();
  let rs = query.get("rs");
  console.log(rs);
  const [secretMessage, setSecretMessage] = useState("");
  try {
    api
      .get("/message-by-id/" + rs)
      .then((data) => {
        let string1 = data.data.result[0].message;
        setSecretMessage(string1);
        console.log("String1=" + string1);
        console.log(secretMessage);
      })
      .catch((error) => console.log(error));
  } catch (ex) {
    console.log(ex);
    alert(
      "Some error happened while fetching your message, please try later..."
    );
  }
  return (
    <div>
      <h1>Your secret message is :</h1>
      <br />
      <div className="secretMessage">{secretMessage}</div>
    </div>
  );
};
let SendSecretEmail = function () {
  const [key, setKey] = useState("");
  useEffect(() => {
    let randomKey = Math.round(Math.random() * 999999999) + 999999999;
    setKey(randomKey);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    data.randomKey = key.toString();

    data.targetUrl = "http://localhost:3000/retrieveMessage";
    alert(JSON.stringify(data));
    try {
      await api
        .post("/create-message", data)
        .then((res) =>
          alert("Email sent with message from server" + JSON.stringify(res))
        );
    } catch (ex) {
      console.log(ex);
      alert("Some error happened while sending email, please try again!");
    }
  };

  return (
    <div className="formSecret">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="key">Your Key</label>
          <br />
          <label name="key" value={key}>
            {key}
          </label>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="text"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          {errors.password && <p>⚠ Please enter a password!</p>}
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <input
            name="message"
            type="text"
            placeholder="Enter your message"
            {...register("message", { required: true })}
          />
          {errors.message && <p>⚠ Please enter your message!</p>}
        </div>
        <div>
          <label htmlFor="targetMail">Recipient Email Id</label>
          <input
            name="targetMail"
            type="email"
            placeholder="Enter recipient's email id"
            {...register("targetMail", { required: true })}
          />
          {errors.targetMail && (
            <p>⚠ Please enter email id to send message to!</p>
          )}
        </div>
        <input type="submit" />
      </form>
    </div>
  );
};
let DeleteSecretMessage = function () {
  //secretKey password

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    alert(JSON.stringify(data));
    try {
      api
        .delete("/delete-message", { data: data })
        .then((res) =>
          alert("Your message has been deleted!" + JSON.stringify(res))
        )
        .catch((error) => alert(error));
    } catch (ex) {
      console.log(ex);
      alert("Some error happened while deleting message, please try again!");
    }
  };

  return (
    <div className="formSecret">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="secretKey">Your Key</label>
          <br />
          <input
            name="secretKey"
            type="text"
            placeholder="Enter your authorization Key"
            {...register("secretKey", { required: true })}
          />
          {errors.secretKey && <p>⚠ Please enter your key!</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="text"
            placeholder="Enter your password"
            {...register("password", { required: true })}
          />
          {errors.password && <p>⚠ Please enter a password!</p>}
        </div>

        <input type="submit" />
      </form>
    </div>
  );
};
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
            <Link to="/">
              <div className="navbar-brand float-left">
                <div>
                  <img src={Logo} className="App-logo" alt="logo" />
                </div>
                Secret Message Service
              </div>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarColor01"
              aria-controls="navbarColor01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse float-right"
              id="navbarColor01"
            >
              <ul className="navbar-nav mr-auto float-right ml-auto">
                <Link to="/">
                  <li className="nav-item active">
                    <a className="nav-link">
                      Home <span className="sr-only">(current)</span>
                    </a>
                  </li>
                </Link>
                <Link to="/sendSecretMessageToEmail">
                  <li className="nav-item">
                    <a className="nav-link">Send Secret Message</a>
                  </li>
                </Link>
                <Link to="/deleteSecretMessage">
                  <li className="nav-item">
                    <a className="nav-link">Delete your secret Message</a>
                  </li>
                </Link>
              </ul>
            </div>
          </nav>
          <Switch>
            <Route path="/sendSecretMessageToEmail">
              <SendSecretEmail />
            </Route>
            <Route path="/deleteSecretMessage">
              <DeleteSecretMessage />
            </Route>
            <Route exact path="/retrieveMessage">
              <GetMessage />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );
}

export default App;
