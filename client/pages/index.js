import axios from "axios";
import buildClient from "../api/build-client";

export default function LandingPage({ currentUser }) {
  console.log(currentUser);
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
}

// useRequest is a hook, to be used inside react components- it cannot get data during rendering
// getInitialProps is not a react component
// get Initial Props: the only place to fetch data during rendering on the server

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context)
    .get("/api/users/currentuser")
    .catch((err) => {
      console.log(err.message);
    });

  return data;
};
