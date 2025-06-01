const CONFIG = {
    totalRows: 10,
    totalSeatsInARow: 11,
    movies: [
        {name: 'Three Idiots', price: 200, value: 'three idiots'},
        {name: 'border', price: 100, value: 'border'},
        {name: 'inception', price: 150, value: 'inception'},
        {name: 'bahubali', price: 250, value: 'bahubali'},
    ]
}


let totalPrice = null;
let selectedMovie = CONFIG.movies[0];
let pricePerSeat = selectedMovie.price;

function createMovieSelectionDropdown() {
    const moviesContainer = document.querySelector('.movies-dropdown-container');
    if(!moviesContainer) {
        console.error('movies container node not found');
        return;
    }
    const select = document.createElement('select');
    const fragment = document.createDocumentFragment();

    CONFIG.movies.forEach(({name, price}) => {
        const option = document.createElement('option');
        option.setAttribute('name', name);
        option.setAttribute('value', price);
        option.innerText = name;
        fragment.append(option);
    })
    select.appendChild(fragment);
    moviesContainer.appendChild(select);
}

function createSeat (row, seatNumber) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.id = `${row}-${seatNumber}`;
    seat.innerText = seatNumber;
    seat.setAttribute('role', 'button');
    return seat;
}

function createSeatRow (row) {
    const seatRow = document.createElement('div');
    seatRow.className = 'seat-row';

    //create a row label for each row (A, B, C)
    const seatRowLabel = document.createElement('div');
    seatRowLabel.className = 'row-label';
    seatRowLabel.innerHTML = String.fromCharCode(65 + row);
    seatRow.append(seatRowLabel);

    for(let s = 0; s < CONFIG.totalSeatsInARow; s++) {
        const seat = createSeat(row, s);
        seatRow.append(seat);
    }

    return seatRow;
}


function createSeatContainer() {
    const seatContainer = document.querySelector('.seat-container');
    if(!seatContainer) {
        console.error('seat container node not found');
        return;
    }

    const fragment = document.createDocumentFragment();

    for(let row = 0; row < CONFIG.totalRows; row++) {
        const seatRow = createSeatRow(row);
        fragment.append(seatRow);
    }
    seatContainer.append(fragment);
}

function reset(isFullReset = true) {
    
    const selectedSeats = document.querySelectorAll('.seat-row .seat.selected');
    selectedSeats.forEach((item) => {
        item.classList.remove('selected');
    });

    if(isFullReset) {
      const occupiedSeats = document.querySelectorAll('.seat-row .seat.occupied');
        occupiedSeats.forEach((item) => {
            item.classList.remove('selected');
        });
    }

    const totalSelectedSeats = document.querySelector('.total-selected-seats');
    const price = document.querySelector('.total-price');
    const priceContainer = document.querySelector('.price-container');
    price.innerText = null;
    totalSelectedSeats.innerText = null;
    priceContainer.style.display = 'none';
}


function handleOnSelectMovie(e) {
    pricePerSeat = parseInt(e.target.value);
    console.log(`Selected movie: ${selectedMovie}`);
    reset(true);
}

function calculatePrice() {
    const selectedSeats = document.querySelectorAll('.seat-row .seat.selected');

    totalPrice = selectedSeats.length * pricePerSeat;

    const totalNoOfSelectedSeats = document.querySelector('.total-selected-seats');
    const totalPriceContainer = document.querySelector('.total-price');
    const priceContainer = document.querySelector('.price-container');

    totalNoOfSelectedSeats.innerText = `No of person:  ${selectedSeats.length}`;
    totalPriceContainer.innerText = `Total price: ${totalPrice}`;
    priceContainer.style.display = 'flex';
}

function handleOnSelectSeat(e) {
    if(!e.target.classList.contains('seat')) {
        return;
    }
    if(e.target.classList.contains('occupied')) {
        console.error('seat is aready occupied');
        return;
    }
    e.target.classList.toggle('selected');

    calculatePrice();
}


function handleBookTicket() {
    const selectedSeats = document.querySelectorAll('.seat-row .seat.selected');
    selectedSeats.forEach((item) => item.classList.replace('selected', 'occupied'));
    reset(false);
}


function initialize() {
    createMovieSelectionDropdown();
    createSeatContainer();

    const seatElem = document.querySelector('.seat-container');
    seatElem.addEventListener('click', handleOnSelectSeat);

    const movieElem = document.querySelector('.movies-dropdown-container');
    movieElem.addEventListener('change', handleOnSelectMovie);
};

initialize();