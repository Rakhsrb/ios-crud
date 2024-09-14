const form = document.querySelector("form");
const tbody = document.querySelector("tbody");

let users = JSON.parse(localStorage.getItem("users")) || [];

let isEditing = false;
let userId = null;

function setToLocalStorage(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("users"));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const imageFile = form.image.files[0];
  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

  if (isEditing) {
    let updatedArray = users.map((user) =>
      user.id == userId
        ? {
            ...user,
            image: imageUrl ? imageUrl : user.image,
            firstName: form.firstName.value,
            phoneNumber: form.phoneNumber.value,
            lastName: form.lastName.value,
            gender: form.gender.value,
          }
        : user
    );

    isEditing = false;
    userId = null;
    setToLocalStorage("users", updatedArray);
    users = getLocalStorage();
    renderUsersToHtml();
    form.reset();
  } else {
    let newObject = {
      id: new Date().getTime(),
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      phoneNumber: form.phoneNumber.value,
      gender: form.gender.value,
      image: imageUrl,
    };
    users.push(newObject);
    setToLocalStorage("users", users);
    renderUsersToHtml();
    form.reset();
  }
});

function renderUsersToHtml() {
  tbody.innerHTML = "";
  users.forEach((user) => {
    tbody.innerHTML += `
    <tr>
     <td>
        <img src="${user.image}" alt="${user.firstName}" />
     </td>
     <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.phoneNumber}</td>
    <td>${user.gender}</td>
    <td>
      <button onclick="editUserFrom(${user.id})">
        <i class="fa-solid fa-pencil edit"></i>
      </button>
      <button onclick="deleteUser(${user.id})">
        <i class="fa-regular fa-trash-can delete"></i>
      </button>
    </td>
    </tr>
    `;
  });
}

renderUsersToHtml();

function deleteUser(chooseUserId) {
  let updatedArray = users.filter((user) => user.id !== chooseUserId);
  setToLocalStorage("users", updatedArray);
  users = getLocalStorage();
  renderUsersToHtml();
}

function editUserFrom(chooseUserId) {
  isEditing = true;
  userId = chooseUserId;

  const choosenUser = users.find((user) => user.id == chooseUserId);

  form.firstName.value = choosenUser.firstName;
  form.lastName.value = choosenUser.lastName;
  form.phoneNumber.value = choosenUser.phoneNumber;
  form.gender.value = choosenUser.gender;
}
