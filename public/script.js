let editId = null;
let isAuthenticated = false;
function savePassword() {
    const site = document.getElementById("site").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (editId) {
        fetch(`http://localhost:3000/update/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ site, username, password })
        })
        .then(res => res.text())
        .then(() => {
            alert("Updated!");
            editId = null;
            document.getElementById("saveBtn").innerText = "Save";
        

        // CLEAR INPUTS
        document.getElementById("site").value = "";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        });
    } else {
        fetch("http://localhost:3000/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ site, username, password })
        })
        .then(res => res.text())
        .then(() => {
            alert("Password Saved!");
        
            
        //Clear inputs
        document.getElementById("site").value = "";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        });
    }
}

function getPasswords() {

    if (!isAuthenticated) {
        console.log("Blocked: Not authenticated");
        return;   // ❌ stop here
    }

    console.log("Fetching passwords...");

    fetch("http://localhost:3000/get")
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("list");
        list.innerHTML = "";

        data.forEach(item => {
            const li = document.createElement("li");
          li.innerHTML = `
    <div class="data">
        <p><strong>Email:</strong> ${item.site}</p>
        <p><strong>Username:</strong> ${item.username}</p>
        <p>
            <strong>Password:</strong> 
            <span id="pass-${item._id}">********</span>
           <button class="toggle-btn" onclick="togglePassword('${item._id}', '${item.password}')">👁️</button>
        </p>
    </div>

    <div class="btn-group">
        <button onclick="editPassword('${item._id}', '${item.site}', '${item.username}', '${item.password}')">Edit</button>
        <button onclick="deletePassword('${item._id}')">Delete</button>
    </div>
`;
            list.appendChild(li);
        });
    });
}

function editPassword(id, site, username, password) {
    document.getElementById("site").value = site;
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;

    editId = id;

    document.getElementById("saveBtn").innerText = "Update";
}

function deletePassword(id) {
    fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE"
    })
    .then(res => res.text())
    .then(() => {
        alert("Deleted!");
        getPasswords();
    });
}

function checkAccess() {
    const master = prompt("Enter Master Password:");

    if (master === "1234") {
        isAuthenticated = true;   // ✅ unlock
        getPasswords();
    } else {
        alert("Wrong Password!");
    }
}

function togglePassword(id, realPassword) {
    const passField = document.getElementById(`pass-${id}`);
    const btn = passField.nextElementSibling;

    if (passField.innerText === "********") {
        passField.innerText = realPassword;
        btn.innerText = "🙈";
    } else {
        passField.innerText = "********";
        btn.innerText = "👁️";
    }
}