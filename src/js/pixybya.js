import axios from 'axios';

const API_KEY = '29770100-1ae097b1dc8cc9c4855e1a138'
const URL = 'https://pixabay.com/api'

export async function getImg(searchValue, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 20,
    page,
  });

  try {
    const response = await axios({
      method: 'get',
      url: `${URL}/?${params}`,
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}