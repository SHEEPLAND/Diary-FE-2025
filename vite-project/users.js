import { fetchData } from "./fetch.js";

/////////////////////
// Dialog
const dialog = document.querySelector(".info_dialog");
const closeButton = document.querySelector(".info_dialog button");

closeButton.addEventListener("click", () => {
  dialog.close();
});

/////////////////////
// Snackbar
const snackbar = document.getElementById("snackbar");

const showSnackbar = (message, type = "") => {
  snackbar.innerText = message;
  snackbar.className = `show ${type}`.trim();
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "").trim();
  }, 3000);
};

/////////////////////
// Fetch Users
const getUsers = async () => {
  const url = "http://127.0.0.1:3000//api/users";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const options = { headers };

  const users = await fetchData(url, options);
  if (users.error) {
    console.error("Error fetching users!", users.error);
    return;
  }

  console.log("Fetched users:", users);

  const tableBody = document.querySelector(".tbody");
  tableBody.innerHTML = ""; // Clear table

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td><button class="check" data-id="${user.user_id}">Info</button></td>
      <td><button class="del" data-id="${user.user_id}">Delete</button></td>
      <td>${user.user_id}</td>
    `;
    tableBody.appendChild(row);
  });
  addEventListeners();
};

/////////////////////
// Fetch Single User by ID
const getUserById = async (userId) => {
  const url = `http://127.0.0.1:3000//api/users/${userId}`;
  const user = await fetchData(url);
  if (user.error) {
    console.error(`Error fetching user ID ${userId}:`, user.error);
    alert(`Error: ${user.error}`);
    return null;
  }
  return user;
};

/////////////////////
// Add Event Listeners
const addEventListeners = () => {
  document.querySelectorAll(".check").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const userId = event.target.dataset.id;
      const user = await getUserById(userId);
      if (user) {
        dialog.querySelector("p").innerHTML = `
          <div>User ID: <span>${user.user_id}</span></div>
          <div>Username: <span>${user.username}</span></div>
          <div>Email: <span>${user.email}</span></div>
          <div>Role: <span>${user.user_level}</span></div>
        `;
        dialog.showModal();
      }
    });
  });
};

/////////////////////
// Add User
const addUser = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();
  const email = document.querySelector("#email").value.trim();

  const url = "http://127.0.0.1:3000//api/users";
  const bodyData = { username, password, email };

  const options = {
    body: JSON.stringify(bodyData),
    method: "POST",
    headers: { "Content-type": "application/json" },
  };

  const response = await fetchData(url, options);

  if (response.error) {
    console.error("Error adding user!", response.error);
    showSnackbar("Error adding user, check fields!", "error");
    return;
  }

  showSnackbar("User added successfully!", "success");
  document.querySelector(".addform").reset();
  getUsers();
};

export { getUsers, addUser };
