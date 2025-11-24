let users = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin' },
    { id: 2, username: 'superadmin', password: '1234', role: 'admin'},
    { id: 3, username: 'user1', password: 'pass1', role: 'user' },
    { id: 4, username: 'user2', password: 'pass2', role: 'user' },
    { id: 5, username: 'dinesh', password: 'dinesh', role: 'admin' }
];

const body = document.body;
function showScreen(screenId, backgroundClass) {
    body.classList.remove('login-bg.jpg', 'admin-bg', 'user-bg');
    body.classList.add(backgroundClass);
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}
function handleLogin() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorDisplay = document.getElementById('loginError');

    const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        errorDisplay.textContent = '';
        document.getElementById('password').value = ''; 

        if (user.role === 'admin') {
            renderAdminDashboard(); 
            showScreen('adminDashboard', 'admin-bg'); 
        } else {
            document.getElementById('welcomeMessage').innerHTML = `Welcome, **${user.username}**!`;
            showScreen('userDashboard', 'user-bg'); 
        }
    } else {
        errorDisplay.textContent = 'Invalid username or password.';
    }
}
function toggleAddUserForm(show) {
    const form = document.getElementById('addUserForm');
    form.style.display = show ? 'block' : 'none';
    document.getElementById('addUserError').textContent = '';
    if (show) {
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
    }
}
function addNewUser() {
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const errorDisplay = document.getElementById('addUserError');

    if (!newUsername || !newPassword) {
        errorDisplay.textContent = 'Username and Password cannot be empty.';
        errorDisplay.style.color = 'red';
        return;
    }
    if (users.some(u => u.username === newUsername)) {
        errorDisplay.textContent = 'User already exists. Choose a different username.';
        errorDisplay.style.color = 'red';
        return;
    }
    const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    const newId = maxId + 1;

    const newUser = {
        id: newId, 
        username: newUsername, 
        password: newPassword, 
        role: 'user'
    };
    users.push(newUser);
    errorDisplay.textContent = `User '${newUsername}' created successfully!`;
    errorDisplay.style.color = 'green';
    renderAdminDashboard();
    setTimeout(() => {
        toggleAddUserForm(false);
        errorDisplay.textContent = ''; 
    }, 1500);
}

function renderAdminDashboard() {
    const userListContainer = document.getElementById('userList');
    userListContainer.innerHTML = ''; 

    users.forEach(user => {
        if (user.role === 'admin') return; 

        const userRow = document.createElement('div');
        userRow.classList.add('user-row');
        userRow.id = `user-row-${user.id}`;
        
        userRow.innerHTML = `
            <div id="display-${user.id}">
                **${user.username}** (${user.role}) - Pass: ${user.password}
            </div>
            <div id="edit-${user.id}" style="display: none;">
                <input type="text" id="edit-user-${user.id}" value="${user.username}" style="width: 80px; margin-right: 5px;">
                <input type="text" id="edit-pass-${user.id}" value="${user.password}" style="width: 80px; margin-right: 5px;">
                <button id="update-btn" onclick="updateUser(${user.id})">Update</button>
                <button id="cancel-btn" onclick="toggleEdit(${user.id})">Cancel</button>
            </div>
            <button id="edit-btn" onclick="toggleEdit(${user.id})">Edit</button>
        `;
        userListContainer.appendChild(userRow);
    });
}
function toggleEdit(userId) {
    const displayDiv = document.getElementById(`display-${userId}`);
    const editDiv = document.getElementById(`edit-${userId}`);
    const row = document.getElementById(`user-row-${userId}`);
    const specificEditBtn = row.querySelector('#edit-btn');


    if (displayDiv.style.display !== 'none') {
        displayDiv.style.display = 'none';
        editDiv.style.display = 'block';
        if (specificEditBtn) specificEditBtn.style.display = 'none';
    } else {

        displayDiv.style.display = 'block';
        editDiv.style.display = 'none';
        if (specificEditBtn) specificEditBtn.style.display = 'block';
    }
}
function updateUser(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    const newUsername = document.getElementById(`edit-user-${userId}`).value;
    const newPassword = document.getElementById(`edit-pass-${userId}`).value;
    users[userIndex].username = newUsername;
    users[userIndex].password = newPassword;
    renderAdminDashboard();

   
}

function logout() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
    showScreen('loginScreen', 'login-bg');
}


document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('loginScreen').classList.contains('active')) {
        handleLogin();
    }


});

