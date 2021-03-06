var searchButton = document.getElementById('searchButton');
var array = [];

localStorage.setItem("recents", JSON.stringify(array));
recents = JSON.parse(localStorage.getItem("recents"));

function getProfile() {

	var user = document.querySelector('.user');
	user.textContent = '';
	var pinnedRepositories = document.querySelector(".repositories-wall");
	pinnedRepositories.textContent = '';
	var userName = document.getElementById('userName').value;
	var searchedQueries = document.querySelector('.searched-queries');
	if (userName) {
		recents.push(userName);
		var queryTitle = document.querySelector('.queries h3');
		queryTitle.textContent = 'recent research';
		var recentQuery = document.createElement('li');
		recentQuery.textContent = recents[recents.length - 1];
		searchedQueries.appendChild(recentQuery);
	}

	var correctName = userName.trim().replace(/\s+/g, '');
	if (correctName) {
		var loading = document.querySelector('.loading');
		loading.style.display = 'block';
		loading.textContent = 'loading..';

		//fetch
		fetch("https://api.github.com/users/" + correctName).then(function (r) {
			console.log(r.status);
			if (r.status == 200) {
				loading.textContent = '';
				loading.style.display = 'none';
				return r.json();
			} else {
				loading.textContent = '';
				console.log('not found');
				var notFound = document.createElement('div');
				notFound.setAttribute('class', 'errorMessage');
				notFound.textContent = 'Name not found 😞';
				pinnedRepositories.appendChild(notFound);
			}
		}).then(function (data) {
			//User
			var userAvatar = document.createElement("img");
			userAvatar.setAttribute("class", "user-avatar");
			userAvatar.src = data.avatar_url;

			var userName = document.createElement("div");
			userName.setAttribute("class", "user-name");
			userName.textContent = data.login;

			var userBio = document.createElement("div");
			userBio.setAttribute("class", "user-bio");
			userBio.textContent = data.bio;

			var userLocation = document.createElement("div");
			userLocation.setAttribute("class", "user-location span");
			userLocation.textContent = data.location;

			var userBlog = document.createElement("div");
			userBlog.setAttribute("class", "user-blog span");
			userBlog.textContent = data.blog;

			user.appendChild(userAvatar);
			user.appendChild(userName);
			user.appendChild(userBio);
			user.appendChild(userLocation);
			user.appendChild(userBlog);
			//Repositories


			fetch(data.repos_url).then(function (r) {
				console.log(r.status);

				return r.json();
			}).then(function (repos) {
				repos.forEach(function (repo) {
					var repoItem = document.createElement("div");
					repoItem.setAttribute("class", "repositories-wall-item");

					var repoItemTitle = document.createElement("div");
					repoItemTitle.setAttribute("class", "repositories-wall-item__title");
					var repoItemDescription = document.createElement("div");
					repoItemDescription.setAttribute("class", "repositories-wall-item__description");
					var repoItemLanguage = document.createElement("div");
					repoItemLanguage.setAttribute("class", "repositories-wall-item__language");

					repoItemTitle.textContent = repo.name;
					repoItemDescription.textContent = repo.description;
					repoItemLanguage.textContent = repo.language;

					repoItem.appendChild(repoItemTitle);
					repoItem.appendChild(repoItemDescription);
					repoItem.appendChild(repoItemLanguage);
					pinnedRepositories.appendChild(repoItem);
				});
			});
		});
	}
}
searchButton.addEventListener('click', getProfile);

document.body.addEventListener("keyup", function (e) {

	if (e.which == 13 || e.keyCode == 13) {
		getProfile();
		return false;
	}
	return true;
});