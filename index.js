const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movieCords = document.querySelector('.movie-cards')
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const dataPanel = document.querySelector('#data-panel')

const movies = []
let filteredMovies = []
const movies_per_page = 12

function showMovieModal(id) {
  // get elements
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  // send request to show api
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results

    // insert data into modal ui
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}


// render paginator
function renderPaginator(amount) {
  const pagesAmount = Math.ceil(amount / movies_per_page)
  rawHTML = []
  for (page = 1; page <= pagesAmount; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// movies for page
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * movies_per_page
  const endIndex = startIndex + movies_per_page
  return data.slice(startIndex, endIndex)
}

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
            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movieModal" data-id=${item.id}>more</button>
            <button type="button" class="btn btn-primary btn-add-favorite" data-id=${item.id}>+</button>
          </div>
        </div>
      </div>`
  })
  movieCords.innerHTML = rawHTML
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// listen for search
searchForm.addEventListener('submit', function onSearchFormSubmit(event) {
  event.preventDefault()
  const inputText = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(inputText))
  if (!filteredMovies.length) {
    alert('無符合內容')
  } else {
    renderMoviesBoard(getMoviesByPage(1))
    renderPaginator(filteredMovies.length)
  }
})

// listen for paginator
paginator.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderMoviesBoard(getMoviesByPage(page))
})

// listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    console.log(event.target.dataset.id)
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// API for movies
axios.get(INDEX_URL)
  .then(res => {
    movies.push(...res.data.results)
    renderPaginator(movies.length)
    renderMoviesBoard(getMoviesByPage(1))
  })
  .catch(ero => {
    console.log(ero)
  })