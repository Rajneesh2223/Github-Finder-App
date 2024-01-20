async function searchUser() {
    const userName = document.getElementById('userName').value;
    const apiUrl = `https://api.github.com/search/users?q=${userName}`;

    try {
        const response = await fetch(apiUrl);
        const searchData = await response.json();

        const userList = document.getElementById('userList');
        userList.innerHTML = '';

        if (searchData.items && searchData.items.length > 0) {
            searchData.items.forEach(user => {
                const userCard = document.createElement('div');
                userCard.classList.add('user-card');
                userCard.innerHTML = `
                    <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
                    <h3>${user.login}</h3>
                `;
                userCard.addEventListener('click', () => showUserDetails(user.login));
                userList.appendChild(userCard);
            });
        } else {
            userList.innerHTML = '<p>No users found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function showUserDetails(userName) {
    window.location.href = `user-details.html?user=${userName}`;
}
