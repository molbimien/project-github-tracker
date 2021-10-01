const USER = 'molbimien';
const PROFILE_URL = `https://api.github.com/users/${USER}`
const REPOS_URL = `https://api.github.com/users/${USER}/repos`;

const profileContainer = document.getElementById('profile-container')
const projectsContainer = document.getElementById('projects');

const fetchProfile = () => {
    fetch(PROFILE_URL)
        .then(res => res.json()) 
        .then(profileData => {
        profileContainer.innerHTML += `
            <img src=${profileData.avatar_url} class="profile-img">    
            <h1>${profileData.login}</h1>
        `
        });
  }

const fetchRepositories = () => {
    fetch(REPOS_URL)
        .then((res) => res.json())
        .then((data) => {
            const technigoRepositories = data.filter((repo) =>
            repo.name.includes('project-') && repo.fork
            );

            technigoRepositories.forEach((repo) => {
                projectsContainer.innerHTML += `
                <div>
                    <a href="${repo.html_url}">${repo.name} with default branch ${repo.default_branch}</a>
                    <p>Recent push: ${new Date(repo.pushed_at).toDateString()}</p>
                    <p id="commit-${repo.name}">Commits amounts: </p>
                </div>
                `;
            });

            // Approach number 2
            fetchPullRequestsArray(technigoRepositories);

            // Draw chart with technigoRepos data
			drawChart(technigoRepositories.length);
        });
};

//Approach number 2
const fetchPullRequestsArray = (allRepositories) => {
    allRepositories.forEach((repo) => {
        const PULL_URL = `https://api.github.com/repos/Technigo/${repo.name}/pulls?per_page=100`;
        
        fetch(PULL_URL)
            .then((res) => res.json())
            .then((data) => {
                // console.log(`Mother repo for project ${repo.name}`, data)
                const myPullRequest = data.find(
                    (pull) => pull.user.login === repo.owner.login
                );

                // Detect if we have pull request or not.
				// If yes - call fetchCommits function
				// If no - inform user that no pull request was yet done
                // console.log(myPullRequest);

            if (myPullRequest) {
                fetchCommits(myPullRequest.commits_url, repo.name);
            } else {
                document.getElementById(`commit-${repo.name}`).innerHTML =
                'No pull reguest yet done :(';
            }
                
            });
    });
};


const fetchCommits = (myCommitsUrl, myRepoName) => {
    fetch(myCommitsUrl)
        .then((res) => res.json())
        // .then((data) => console log.(data));
        .then((data) => {
            document.getElementById(`commit-${myRepoName}`).innerHTML += data.length;

        }); 
};

fetchProfile();
fetchRepositories();
