import axios from "axios";

export default ({ req }) => {
  // on server
  if (typeof window === 'undefined') {
    return axios.create({
            // http://SERVICENAME.NAMESPACE.svc.cluster.local
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/',
      headers: req.headers
    });
    // on browser; automatically prepends domain 
  } else {
    return axios.create({
      baseURL: '/'
    });
  }
};