const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movieCords = document.querySelector('.movie-cards')
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector('#search-input')

const movies = []

/*
search
1. 命名 監聽區域
2. 命名 input 區域
3. 比對 input id 與 movie title
4. render 搜尋電影
*/
searchForm.addEventListener('submit', function onSearchFormSubmit(event) {
  const inputText = searchInput.value.trim().toLowerCase()
  let filterMovies = []
  filterMovies = movies.filter(movie => movie.title.toLowerCase().includes(inputText))
  renderMoviesBoard(filterMovies)
})


// render movies board
function renderMoviesBoard(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
      <div class="col-12">
        <div class="card" style="width: 18rem;">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="...">
          <div class="card-body" id=${item.id}>
            <h5 class="card-title">${item.title}</h5>
            <button type="button" class="btn btn-primary" id=${item.id}>Primary</button>
            <button type="button" class="btn btn-danger" id=${item.id}>+</button>
          </div>
        </div>
      </div>`
  })
  movieCords.innerHTML = rawHTML
}

// API for movies
axios.get(INDEX_URL)
  .then(res => {
    movies.push(...res.data.results)
    renderMoviesBoard(movies)
  })
  .catch(ero => {
    console.log(ero)
  })