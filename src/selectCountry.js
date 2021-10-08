import Notiflix from 'notiflix';

export function selectCountry(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages,region,subregion,fullText`,
  ).then(response => {
    if (!response.ok) {
      throw new Error(Notiflix.Notify.failure('Ооооой, что-то пошло не так'));
    }
    return response.json();
  });
}
