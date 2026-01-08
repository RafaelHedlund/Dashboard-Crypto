import axios from "axios";
import { API_BASE_URL } from "../constants/fallbackCryptos";

// Configuração global do axios
axios.defaults.baseURL = API_BASE_URL;

export default axios;