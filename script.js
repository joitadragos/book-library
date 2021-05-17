//Show Modal, Focus on Input
const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookForm = document.getElementById('book-form');
const bookTitleEl = document.getElementById('title');
const bookAuthorEl = document.getElementById('author');
const bookDescriptionEl = document.getElementById('description');
const bookRatingEl = document.getElementById('book-rating');
const bookStarsRatingEl = document.getElementById('book-stars-rating');
const bookCategoryEl = document.getElementById('book-category');
const booksContainer = document.getElementById('books-container');
const inputs = document.querySelectorAll('input');

function showModal() {
  modal.classList.add('show-modal');
  bookTitleEl.focus();
  console.log('showModal');
}

//Modal Event Listeners
modalShow.addEventListener('click', showModal);

modalClose.addEventListener('click', () =>
  modal.classList.remove('show-modal'),
);

document.addEventListener('DOMContentLoaded', function () {
  const bookContainer = document.querySelector('#books-container');
  const bookURL = 'http://localhost:3000/books';

  let allBooks = [];

  fetch(`${bookURL}`)
    .then((response) => response.json())
    .then((bookData) =>
      bookData.forEach(function (book) {
        allBooks = bookData;
        bookContainer.innerHTML += `
        <div class="item">
          <div id=${book.id}>
            <h2>${book.title}</h2>
            <h3>Book Rating: ${book.rating} ${book.starRating} ★</h3>
            <h4>Author: ${book.author}</h4>
            <h5>Category: ${book.category} </h5>
            <p>${book.description}</p>
            <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
            <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
          </div>
        </div>`;
      }),
    );

  const bookForm = document.querySelector('#book-form');
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target);

    const titleInput = bookForm.querySelector('#title').value;
    const authorInput = bookForm.querySelector('#author').value;
    const descInput = bookForm.querySelector('#description').value;
    const ratingInput = bookForm.querySelector('#book-rating').value;
    const categoryInput = bookForm.querySelector('#book-category').value;
    const starRatingInput = starCreator(
      bookForm.querySelector('#book-stars-rating').value,
    );

    if (validate(titleInput, authorInput, descInput) === true) {
      fetch(`${bookURL}`, {
        method: 'POST',
        body: JSON.stringify({
          title: titleInput,
          author: authorInput,
          description: descInput,
          rating: ratingInput,
          starRating: starRatingInput,
          category: categoryInput,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((bookData) =>
          bookData.forEach(function (book) {
            bookContainer.innerHTML += `
            <div class="item">
              <div id=${book.id}>
                <h2 >${book.title}</h2>
                <h3>Book Rating: ${book.rating} ${book.starRating}</h3>
                <h4>Author: ${book.author}</h4>
                <h5>Category: ${book.category} </h5>
                <p>${book.description}</p>
                <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
                <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
              </div>
            </div>`;
          }),
        );
    }
  });
  bookContainer.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'edit') {
      console.log('you pressed edit');
      const bookData = allBooks.find((book) => {
        return book.id == e.target.dataset.id;
      });

      const modalTitle = document.getElementById('modal-title');
      modalTitle.innerText = 'Edit Book Informations';

      showModal();
      bookTitleEl.value += `${bookData.title}`;
      bookAuthorEl.value += `${bookData.author}`;
      bookDescriptionEl.value += `${bookData.description}`;
      bookRatingEl.value += `${bookData.rating}`;
      bookStarsRatingEl.value += `${bookData.starRating}`;
      bookCategoryEl.value += `${bookData.starRating}`;

      const saveButton = document.getElementById('save-button');
      saveButton.style.display = 'none'; //Hide Save button
      const editButtonSave = document.getElementById('edit-button');
      editButtonSave.style.display = 'block'; // Make Edit Book button visible

      editButtonSave.addEventListener('click', function () {
        const editedTitle = bookTitleEl.value;
        const editedAuthor = bookAuthorEl.value;
        const editedDescription = bookDescriptionEl.value;
        const editedRating = bookRatingEl.value;
        const editedStarRating = starCreator(bookStarsRatingEl.value);
        const editedCategory = bookCategoryEl.value;
        fetch(`${bookURL}/${bookData.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: editedTitle,
            author: editedAuthor,
            description: editedDescription,
            rating: editedRating,
            starRating: editedStarRating,
            category: editedCategory,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((book) => {
            bookContainer.innerHTML += `
            <div class="item">
              <div id=${book.id}>
                <h2>Title: ${book.title}</h2>
                <h3>Book Rating: ${book.rating} ${book.starRating}</h3>
                <h4>Author: ${book.author}</h4>
                <h4>Category: ${book.category} </h4>
                <p>${book.description}</p>
                <button data-id="${book.id}" id="edit-${book.id}" data-action="edit">Edit</button>
                <button data-id="${book.id}" id="delete-${book.id}" data-action="delete">Delete</button>
              </div>
            </div>`;
          });
      });

      // Every close icon is pressed reload the page so the add book modal we'll not save the changes done by edit
      modalClose.addEventListener('click', () => window.location.reload());
    }
    modalClose.addEventListener('click', () => {
      inputs.forEach((input) => (input.value = ''));
    });

    //here we delete a book from the list
    if (e.target.dataset.action === 'delete') {
      console.log('you pressed delete');
      if (confirm('Are you sure you want to delete this book?')) {
        fetch(`${bookURL}/${e.target.dataset.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json());
        alert('Book deleted succesfully');
      } else {
        alert('You did not deleted the book');
      }
    }
  });
  // Validate form input
  function validate(titleInput, authorInput, descInput) {
    if (!titleInput || !authorInput || !descInput) {
      alert('Please complete all fields');
      return false;
    }
    // verify if there already exists a book with same title and author in the list
    for (let i = 0; i < allBooks.length; i++) {
      if (
        allBooks[i].title === titleInput &&
        allBooks[i].author === authorInput
      ) {
        alert(
          'This book already exists in this list. Consider editing the current',
        );
        return false;
      }
    }
    return true;
  }
});

//function used to create stars using user's choice
function starCreator(number) {
  let stars = ' ';
  for (let i = 0; i < number - 1; i++) {
    stars += '★';
  }
  return stars;
}

// Search
const searchInput = document.querySelector('#search-box');

searchInput.addEventListener('keyup', function (e) {
  let searchItem = e.target.value.toLowerCase();

  const booksTitle = document.querySelectorAll('.container .item h2');
  const booksAuthor = document.querySelectorAll('.container .item h4');

  // search a book by it's title
  booksTitle.forEach(function (book) {
    if (book.innerHTML.toLocaleLowerCase().indexOf(searchItem) != -1) {
      book.closest('.item').style.display = 'block';
    } else {
      book.closest('.item').style.display = 'none';
    }
  });

  // Search book by it's author
  booksAuthor.forEach(function (book) {
    if (book.innerHTML.toLocaleLowerCase().indexOf(searchItem) != -1) {
      book.closest('.item').style.display = 'block';
    } else {
      book.closest('.item').style.display = 'none';
    }
  });
});

const categoryButtons = document.querySelectorAll('.category-button');
for (let i = 0; i < categoryButtons.length; i++) {
  categoryButtons[i].addEventListener('click', function (e) {
    let buttonValue = e.target.value;

    const bookCategory = document.querySelectorAll('.container .item h5');
    bookCategory.forEach(function (book) {
      if (book.innerHTML.indexOf(buttonValue) != -1) {
        book.closest('.item').style.display = 'block';
      } else {
        book.closest('.item').style.display = 'none';
      }
    });
  });
}
const showAllButton = document.getElementById('show-all');

//To keep thins easy when user'll press show all button, I just reload the page and there will be all books
showAllButton.addEventListener('click', () => window.location.reload());
