const APIURL = "https://api.github.com/users/";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
  const resp = await fetch(APIURL + username);
  const respData = await resp.json();
  createUserCard(respData);
  getRepos(username);
  saveSearchHistory(username);
}
async function getRepos(username) {
  const resp = await fetch(APIURL + username + "/repos");
  const respData = await resp.json();
  addReposToCard(respData);
}
function createUserCard(user) {
  const cardHTML = `    <div class="card">      <div>        <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />      </div>      <div class="user-info">        <h2>${user.name}</h2>        <p>${user.bio}</p>        <ul class="info">          <li>${user.followers}<strong>Followers</strong></li>          <li>${user.following}<strong>Following</strong></li>          <li>${user.public_repos}<strong>Public Repositories</strong></li>        </ul>        <div id="repos"></div>      </div>    </div>  `;
  main.innerHTML = cardHTML;
}
function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .forEach((repo) => {
      const repoEl = document.createElement("a");
      repoEl.classList.add("repo");
      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.innerText = repo.name;
      reposEl.appendChild(repoEl);
    });
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});
getUser("anoushkadhar123");


// Initialize search history array
let searchHistory = [];
form.addEventListener("submit",(e) => {
  e.preventDefault();
  const user = search.value;
  if(user) {
    getUser(user);
    search.value = "";
    searchHistory.push(user);
    displaySearchHistory();
  }
});
function displaySearchHistory() {
  const historyContainer = document.getElementById("search-history"); 
  historyContainer.innerHTML = "";    
  searchHistory.forEach((term) => {        
    const termEl = document.createElement("div");        
    termEl.innerText = term;        
    historyContainer.appendChild(termEl);    
  });
}
function clearSearchHistory() {
  searchHistory = [];
  displaySearchHistory();
}

// Function to add search item to history
function addToSearchHistory(username) {
  // Check if username already exists in history    
  const existingItemIndex = searchHistory.findIndex(item => item.username === username);
  // If username exists, update the search count    
  if (existingItemIndex !== -1) {
    searchHistory[existingItemIndex].count++;
  }
  else {
    // If username does not exist, add it to the history        
    searchHistory.push({ username: username, count: 1 });
  }
}
// Function to sort the history by oldest
function sortHistoryByOldest() {    
  searchHistory.sort((a, b) => {        
    return new Date(a.date) - new Date(b.date);    
  });
}
// Function to sort the history by newest
function sortHistoryByNewest() {    
  searchHistory.sort((a, b) => {        
    return new Date(b.date) - new Date(a.date);    
  });
}
// Function to sort the history by most searched
function sortHistoryByMostSearched() {    
  searchHistory.sort((a, b) => {        
    return b.count - a.count;    
  });
}
// Sort the history by oldest
sortHistoryByOldest();
console.log(searchHistory);
// Sort the history by newest
sortHistoryByNewest();
console.log(searchHistory);
// Sort the history by most searched
sortHistoryByMostSearched();
console.log(searchHistory);
