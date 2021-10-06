import './css/styles.css';
import { debounce } from 'lodash';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputNode = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputNode.addEventListener(
  'input',
  debounce(name => {
    const inputText = name.target.value;
    fetchCountries(inputText)
      .then(data => showData(data))
      .catch(error => console.log(error));
  }, DEBOUNCE_DELAY),
);

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flag,languages`,
  ).then(response => {
    if (!response.ok) {
      throw new Error(Notiflix.Notify.failure('Oops, there is no country with that name'));
    }
    return response.json();
  });
}

function showData(data) {
  if (data.length >= 2 && data.length <= 10) {
    const markup = data
      .map(({ name, flag }) => {
        return `<li class='list'>
        <p class='list-item'> ${flag}</p>
        <p class='list-item'> ${name.common}</p>
        </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
  } else if (data.length === 1) {
    const markup = data
      .map(({ name, capital, population, flag, languages }) => {
        return `<li class='info'>
          <p class='info-item'>  ${flag}</p>
          <p class='info-item'>  ${name.common}</p>
          <p class='info-item'> Capital: ${capital}</p>
          <p class='info-item'> Population: ${population}</p>
          <p class='info-item'> Languages: ${Object.values(languages)}</p>
          
        </li>`;
      })
      .join('');
    countryInfo.innerHTML = markup;
  } else if (data.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
  // console.log(markup);
}
