import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on the server side
    return axios.create({
      baseURL: 'www.biletify-app-vistula.xyz/',
      headers: req.headers,
    });
  } else {
    // we are on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
};
