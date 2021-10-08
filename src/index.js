import './css/styles.css';
import { debounce } from 'lodash';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputNode = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputNode.addEventListener(
  'input',
  debounce(name => {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    const inputText = name.target.value.trim();
    if (!inputText) {
      return false;
    }
    fetchCountries(inputText)
      .then(data => showData(data))
      .catch(error => console.log(error));
  }, DEBOUNCE_DELAY),
);

function showData(data) {
  if (data.length >= 2 && data.length <= 10) {
    const markup = data
      .map(({ name, flags }) => {
        return `<li class='list'>
        <p class='list-item'> <img src='${flags.svg}'width='50' height='30'></p>
        <p class='list-item'> ${name.common}</p>
        </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
  } else if (data.length === 1) {
    const markup = data
      .map(({ name, capital, population, flags, languages }) => {
        return `<li class='info'>
          <p class='info-item'> <img src='${flags.png}'> </p>
          <p class='info-name'>  ${name.common}</p>
          <p class='info-item'> <span class='item-title'>Capital:</span> ${capital}</p>
          <p class='info-item'> <span class='item-title'>Population:</span> ${population}</p>
          <p class='info-item'> <span class='item-title'>Languages:</span> ${Object.values(
            languages,
          )}</p>
          
        </li>`;
      })
      .join('');
    countryInfo.innerHTML = markup;
  } else if (data.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
  // console.log(markup);
}

// ===========================================

const countryNode = document.querySelector('.modal');
const backdropNode = document.querySelector('.backdrop');
backdropNode.addEventListener('click', () => {
  backdropNode.classList.toggle('hidden');
});

countryList.addEventListener('click', e => {
  if (e.target.closest('li').tagName !== 'LI') return false;
  backdropNode.classList.toggle('hidden');
  fetchCountries(e.target.textContent)
    .then(data => countryPage(data))
    .catch(error => console.log(error));
});

function countryPage(data) {
  const markUp = data
    .map(({ name, capital, population, flags, languages, fullText, region, subregion }) => {
      return `<div class="country">
          <img src='${flags.png}'> </p>
          <p class='info-name'>  ${name.common}</p>
          <p class='info-item'> <span class='item-title'>Capital:</span> ${capital}</p>
          <p class='info-item'> <span class='item-title'>Population:</span> ${population}</p>
          <p class='info-item'> <span class='item-title'>Full Name:</span> ${fullText}</p>
          <p class='info-item'> <span class='item-title'>Region:</span> ${region}</p>
          <p class='info-item'> <span class='item-title'>Subregion:</span> ${subregion}</p>
          <p class='info-item'> <span class='item-title'>Languages:</span> ${Object.values(
            languages,
          )}</p></div>`;
    })
    .join('');
  countryNode.innerHTML = markUp;
  console.log(markUp);
}
