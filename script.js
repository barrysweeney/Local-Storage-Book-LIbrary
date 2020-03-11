let myLibrary;
let booksInLibrary;
let bookForm = document.getElementById("bookForm");
let bookDisplay = document.getElementById("bookContainer");

window.onload = startUp();

function startUp() {
  getMyLibrary();
  setupForm();
  render();
}

function getMyLibrary() {
  myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
}

function setupForm() {
  let addBookButton = document.getElementById("addBook");
  let submitButton = document.getElementById("submitForm");
  addBookButton.addEventListener("click", toggleFormDisplay);
  submitButton.addEventListener("click", submitForm);
  toggleFormDisplay();
}

function toggleFormDisplay() {
  if (bookForm.style.display === "none") {
    bookForm.style.display = "block";
  } else {
    bookForm.style.display = "none";
  }
}

function submitForm() {
  if (formComplete()) {
    let { title, author, pages, read } = getFormValues();
    let book = new Book(title, author, pages, read);
    addBookToLibrary(book);
    render();
  }
}

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

function Book(title, author, numPages, isRead) {
  this.title = title;
  this.author = author;
  this.numPages = numPages;
  this.isRead = isRead;
}

function render() {
  alterHTMLforBooks();
  bookForm.reset();
  addReadButtons();
  addDeleteButtons();
  addBookLibraryToLocalStorage();
}

function alterHTMLforBooks() {
  clearBookDisplay();
  for (let i = 0; i < myLibrary.length; i++) {
    let { div, p, p2 } = createBookElements(i);
    appendBookElements(div, p, p2);
    p.innerHTML += `Title: ${myLibrary[i].title}`;
    setReadDisplay(i, p2);
  }
}

function clearBookDisplay() {
  bookDisplay.innerHTML = "";
}

function createBookElements(i) {
  let p = document.createElement("p");
  let p2 = document.createElement("p");
  let div = document.createElement("div");
  div.className = "card";
  p.className = "booksOnDisplay";
  p.id = `${i}`;
  return { div, p, p2 };
}

function appendBookElements(div, p, p2) {
  bookDisplay.appendChild(div);
  div.appendChild(p);
  div.appendChild(p2);
}

function setReadDisplay(i, p2) {
  if (bookRead(i)) {
    p2.innerHTML += `Read: Yes`;
  } else {
    p2.innerHTML += `Read: Not Yet`;
  }
}

function bookRead(i) {
  return myLibrary[i].isRead === "on";
}

function addReadButtons() {
  getBooksInLibrary();
  for (let i = 0; i < booksInLibrary.length; i++) {
    let readButton = document.createElement("button");
    readButton.innerHTML = "Mark as read";
    readButton.className = "btn btn-secondary bookButton";
    readButton.addEventListener("click", changeReadStatus);
    booksInLibrary[i].appendChild(readButton);
    if (myLibrary[booksInLibrary[i].id].isRead === "on") {
      booksInLibrary[i].lastElementChild.innerHTML = "Mark as unread";
    }
  }
}

function addDeleteButtons() {
  getBooksInLibrary();
  for (let i = 0; i < booksInLibrary.length; i++) {
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Remove";
    deleteButton.className = "btn btn-secondary bookButton";
    deleteButton.addEventListener("click", removeBookFromLibrary);
    booksInLibrary[i].appendChild(deleteButton);
  }
}

function addBookLibraryToLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function getBooksInLibrary() {
  booksInLibrary = document.getElementsByClassName("booksOnDisplay");
}

function changeReadStatus() {
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
