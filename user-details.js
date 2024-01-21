window.onload = function () {
    const userName = getUserNameFromUrl();
    if (userName) {
        fetchUserData(userName);
        document.getElementById('userName').innerText = userName;
        fetchAndDisplayRepositories(userName, 1);
    }
};

async function fetchUserData(userName) {
    const accessToken = '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';
    const apiUrl = `https://api.github.com/users/${userName}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API request failed with status: ${response.status}`);
        }

        const user = await response.json();

        document.getElementById('userImage').src = user.avatar_url || 'default-image.jpg';
        document.getElementById('twitterAddress').innerText = user.twitter || 'No Twitter address available';
        document.getElementById('userBio').innerText = user.bio || 'No bio available';
        document.getElementById('userLocation').innerText = user.location || 'No location available';
        document.getElementById('userEmail').innerText = user.email || 'No email available';
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function fetchAndDisplayRepositories(userName, page) {
    const perPage = 10;
    const accessToken = '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';
    const apiUrl = `https://api.github.com/users/${userName}/repos?page=${page}&per_page=${perPage}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API request failed with status: ${response.status}`);
        }

        const repoData = await response.json();

        const repoListContainer = document.getElementById('repoList');
        repoListContainer.innerHTML = '';

        if (repoData.length > 0) {
            repoData.forEach(repo => {
                const repoItem = document.createElement('div');
                repoItem.classList.add('repo-item');
                repoItem.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <h4>TOPICS</h4>
                    <div class="box1">
                        <ul>
                            ${repo.topics ? repo.topics.map(topic => `<li>${topic}</li>`).join('') : '<li>Not specified</li>'}
                        </ul>
                    </div>`;
                repoListContainer.appendChild(repoItem);
            });

            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = '';
            const pagination = createPaginationUI(page, repoData.length, perPage);
            paginationContainer.appendChild(pagination);
        } else {
            repoListContainer.innerHTML = '<p>No repositories found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function createPaginationUI(currentPage, totalItems, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    const previousButton = document.createElement('button');
    previousButton.innerText = 'Previous';
    previousButton.addEventListener('click', () => {
        fetchAndDisplayRepositories(getUserNameFromUrl(), currentPage - 1);
    });
    pagination.appendChild(previousButton);

    for (let i = 1; i <= 100; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.addEventListener('click', () => {
            fetchAndDisplayRepositories(getUserNameFromUrl(), i);
        });

        if (i === currentPage) {
            button.classList.add('active');
        }

        pagination.appendChild(button);
        

    }

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.addEventListener('click', () => {
        fetchAndDisplayRepositories(getUserNameFromUrl(), currentPage + 1);
    });
    pagination.appendChild(nextButton);

    return pagination;
}




function getUserNameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('user');
}
