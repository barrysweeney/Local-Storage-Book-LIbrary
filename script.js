let myLibrary = [];
let booksInLibrary;
let bookForm = document.getElementById("bookForm");
let bookDisplay = document.getElementById("bookContainer");

class Book {
  constructor(title, author, numPages, isRead) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.isRead = isRead;
  }
}

window.onload = startUp();

function startUp() {
  getMyLibrary();
  setupForm();
  render();
}

// gets created books from local storage
function getMyLibrary() {
  if (JSON.parse(localStorage.getItem("myLibrary")) !== null) {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
  }
}

// add form buttons
function setupForm() {
  let addBookButton = document.getElementById("addBook");
  let submitButton = document.getElementById("submitForm");
  addBookButton.addEventListener("click", toggleFormDisplay);
  submitButton.addEventListener("click", submitForm);
}

function toggleFormDisplay() {
  bookForm.style.display = "block";
}

function submitForm() {
  if (formComplete()) {
    let { title, author, pages, read } = getFormValues();
    let book = new Book(title, author, pages, read);
    addBookToLibrary(book);
    render();
  } else {
    showErrorMessage();
  }
}

// checks if values enterred in all form fields
function formComplete() {
  return (
    document.getElementById("title").value.length > 0 &&
    document.getElementById("author").value.length > 0 &&
    document.getElementById("pages").value.length > 0
  );
}

function getFormValues() {
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let pages = document.getElementById("pages").value;
  let read = "off";
  return { title, author, pages, read };
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function render() {
  alterHTMLforBooks();
  bookForm.reset();
  addReadButtons();
  addDeleteButtons();
  addBookLibraryToLocalStorage();
}

function showErrorMessage() {
  let title = document.getElementById("title");
  let author = document.getElementById("author");
  let pages = document.getElementById("pages");

  if (title.value.length === 0) {
    let titleError = document.getElementById("titleError");
    titleError.textContent = "Please fill in this field";
    title.style.border = "1px solid red";
  }
  if (author.value.length === 0) {
    let authorError = document.getElementById("authorError");
    authorError.textContent = "Please fill in this field";
    author.style.border = "1px solid red";
  }
  if (pages.value.length === 0) {
    let pagesError = document.getElementById("pagesError");
    pagesError.textContent = "Please fill in this field";
    pages.style.border = "1px solid red";
  }
}

// displays created books
function alterHTMLforBooks() {
  clearBookDisplay();
  for (let i = 0; i < myLibrary.length; i++) {
    let { bookDiv, titleParagraph, readStatusParagraph } = createBookElements(
      i
    );
    appendBookElements(bookDiv, titleParagraph, readStatusParagraph);
    titleParagraph.innerHTML += `Title: ${myLibrary[i].title}`;
    setReadStatusDisplay(i, readStatusParagraph);
  }
}

function clearBookDisplay() {
  bookDisplay.innerHTML = "";
}

// create html elements used to display books
function createBookElements(i) {
  let titleParagraph = document.createElement("p");
  let readStatusParagraph = document.createElement("p");
  let bookDiv = document.createElement("div");
  bookDiv.className = "card";
  titleParagraph.className = "booksOnDisplay";
  titleParagraph.id = `${i}`;
  return { bookDiv, titleParagraph, readStatusParagraph };
}

// adds created html elemetns to display
function appendBookElements(bookDiv, titleParagraph, readStatusParagraph) {
  bookDisplay.appendChild(bookDiv);
  bookDiv.appendChild(titleParagraph);
  bookDiv.appendChild(readStatusParagraph);
}

function setReadStatusDisplay(i, readStatusParagraph) {
  if (bookRead(i)) {
    readStatusParagraph.innerHTML += `Read: Yes`;
  } else {
    readStatusParagraph.innerHTML += `Read: Not Yet`;
  }
}

function bookRead(i) {
  return myLibrary[i].isRead === "on";
}

function addReadButtons() {
  getBooksInLibrary();
  for (let i = 0; i < booksInLibrary.length; i++) {
    let readButton = createReadButton();
    booksInLibrary[i].appendChild(readButton);
    setReadButtonDisplay(i);
  }
}

function setReadButtonDisplay(i) {
  if (myLibrary[booksInLibrary[i].id].isRead === "on") {
    booksInLibrary[i].lastElementChild.innerHTML = "Mark as unread";
  }
}

function createReadButton() {
  let readButton = document.createElement("button");
  readButton.innerHTML = "Mark as read";
  readButton.className = "btn btn-secondary bookButton";
  readButton.addEventListener("click", changeReadButtonDisplay);
  return readButton;
}

function addDeleteButtons() {
  getBooksInLibrary();
  for (let i = 0; i < booksInLibrary.length; i++) {
    let deleteButton = createDeleteButton();
    booksInLibrary[i].appendChild(deleteButton);
  }
}

function createDeleteButton() {
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Remove";
  deleteButton.className = "btn btn-secondary bookButton";
  deleteButton.addEventListener("click", removeBookFromLibrary);
  return deleteButton;
}

function getBooksInLibrary() {
  booksInLibrary = document.getElementsByClassName("booksOnDisplay");
}

function addBookLibraryToLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function changeReadButtonDisplay() {
  let indexOfBookInLibrary = parseInt(this.parentNode.id);
  if (bookRead(indexOfBookInLibrary)) {
    myLibrary[indexOfBookInLibrary].isRead = "off";
    this.innerHTML = "Mark as read";
  } else {
    myLibrary[indexOfBookInLibrary].isRead = "on";
    this.innerHTML = "Mark as unread";
  }
  render();
}

function removeBookFromLibrary() {
  let indexOfBookInLibrary = parseInt(this.parentNode.id);
  myLibrary.splice(indexOfBookInLibrary, 1);
  render();
}
