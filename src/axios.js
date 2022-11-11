import axios from "axios";
const instance = axios.create({
  baseURL: "https://iplfarmersamvad.com/CMSWSIPL/ws",
});
export default instance;
