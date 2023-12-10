import axios from 'axios';
const BASE_URL = "https://pixabay.com/api/"
const API_KEY = "41178789-6541674911b6fea2af440bf0d"
export async function fetchPhoto(q, page, perPage) {
  const url = `${BASE_URL}/?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  const response = await axios.get(url);
  return response.data;
}