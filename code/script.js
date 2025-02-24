const USER = 'molbimien';
const PROFILE_URL = `https://api.github.com/users/${USER}`
const REPOS_URL = `https://api.github.com/users/${USER}/repos`;

const profileContainer = document.getElementById('profile-container')
const projectsContainer = document.getElementById('projects');

// fetchProfile function
const fetchProfile = () => {
    fetch(PROFILE_URL)
        .then(res => res.json()) 
        .then(profileData => {
        profileContainer.innerHTML += `
            <img src=${profileData.avatar_url} class="profile-img">    
            <h2>${profileData.name}</h2>
            <p>${profileData.login}</p>
        `
        });
  }

  // fetchRepositories function
const fetchRepositories = () => {
    fetch(REPOS_URL)
        .then((res) => res.json())
        .then((data) => {
            const technigoRepositories = data.filter((repo) =>
            repo.name.includes('project-') && repo.fork
            );

            technigoRepositories.forEach((repo) => {
                projectsContainer.innerHTML += `
                <div class="card">
                    <a href="${repo.html_url}">
                    <h2>${repo.name}</h2>
                    <p>Default branch: ${repo.default_branch}</p>
                    <p>Most recent push: ${new Date(repo.pushed_at).toLocaleDateString()}</p>
                    <p id="commit-${repo.name}">Number of commits: </p>
                    </a>
                </div>
                `;
            });

            fetchPullRequestsArray(technigoRepositories);

            // Draw chart with technigoRepos data
			drawChart(technigoRepositories.length);
        });
};

const fetchPullRequestsArray = (allRepositories) => {
    allRepositories.forEach((repo) => {
        const PULL_URL = `https://api.github.com/repos/Technigo/${repo.name}/pulls?per_page=100`;
        
        fetch(PULL_URL)
            .then((res) => res.json())
            .then((data) => {
                const myPullRequest = data.find(
                    (pull) => pull.user.login === repo.owner.login
                );

                // Detect if we have pull request or not.
				// If yes - call fetchCommits function
				// If no - inform user that no pull request was yet done

            if (myPullRequest) {
                fetchCommits(myPullRequest.commits_url, repo.name);
            } else {
                document.getElementById(`commit-${repo.name}`).innerHTML =
                'This was a group project. No pull requests made by molbimien.';
            }
                
            });
    });
};

// fetchCommits function
const fetchCommits = (myCommitsUrl, myRepoName) => {
    fetch(myCommitsUrl)
        .then((res) => res.json())
        .then((data) => {
            document.getElementById(`commit-${myRepoName}`).innerHTML += data.length;

        }); 
};

fetchProfile();
fetchRepositories();
