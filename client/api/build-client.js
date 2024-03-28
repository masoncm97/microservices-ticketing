import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    // requests should be made to http://ingress-nginx.ingress-nginx.svc.cluster.local
    // Host is used by ingress nginx to route to the correct service, passed as one of the headers
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We are on the browser
    // requests can be made with a base url of ''
    return axios.create({
      baseURL: "/",
    });
  }
};
