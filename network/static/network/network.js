document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#new-post').addEventListener('click', () => {
        load_compose();
    });

    document.querySelector('#all-posts').addEventListener('click', () => {
        load_posts();
        getPosts();
    });

    document.querySelector('#following').addEventListener('click', () => {
        load_following_posts();
        getFollowingPosts();
    });
});

// Show compose view
function load_compose() {
    // Show compose form
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    // Clear composition field
    document.querySelector('#compose-body').value = '';
}

// Show posts view
function load_posts() {

    document.querySelector('#profile-view').innerHTML = ''
    // Show posts and hide compose 
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'block';
}

// Show profile view
function load_profile() {
    // Show profile and hide other views 
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'block';
}

// Show following view
function load_following_posts() {

    // Show following and hide other views
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'block';
}

// GET ALL POSTS OF ALL USERS
async function getPosts() {
    // Get all posts
    const response = await fetch('/posts');
    const data = await response.json();

    // Delete data stored in posts-view
    document.querySelector('#posts-view').innerHTML = ''

    for (let i = 0; i < data.length; i++) {
        // Instantiate desired elements
        let div = document.createElement('div');
        let anchor = document.createElement('a');

        // Declaring variables from data received
        let username = data[i]['username'];
        let body = data[i]['body'];
        let created = data[i]['created'];
        // let likes = data[i]['likes'];
        let user_id = data[i]['user_id'];

        // Anchor customization w/ variables declared above
        let text = document.createTextNode(`${username} -> ${body}, on ${created}`);
        anchor.appendChild(text);
        anchor.href = `profile/${username}`;

        // On clicking the anchor, prevent default behaviour and get+show profile data
        anchor.addEventListener('click', (event) => {
            document.querySelector('#profile-view').innerHTML = '';
            event.preventDefault();
            getProfile(username);
            load_profile();
        })

        // Appending anchor to div and div to posts-view
        div.append(anchor);
        document.querySelector('#posts-view').append(div);
    };
};
// GETTING FULL PROFILE DATA 
async function getProfile(username) {
    // Get current profile data 
    const response = await fetch(`/profile/${username} `);
    const userData = await response.json();

    // Instantiate elements, customize and append them
    let h4 = document.createElement('h4');
    h4.innerHTML = userData['username'];
    document.querySelector('#profile-view').append(h4);

    // Get profile's posts data
    const response2 = await fetch(`/profile/posts/${username} `);
    const userPosts = await response2.json();

    // For loop to apply instructions to every post
    for (let i = 0; i < userPosts.length; i++) {

        // Create elements for each post
        let p = document.createElement('p');
        let br = document.createElement('br');

        // Get the desired data to append
        let username = userPosts[i]['username'];
        let body = userPosts[i]['body'];
        let created = userPosts[i]['created'];
        // let likes = userPosts[i]['likes'];

        // Customize data
        p.innerHTML = `${username} -> ${body}, on ${created}`;

        // Append elements w/ data to div
        document.querySelector('#profile-view').append(p);
        document.querySelector('#profile-view').append(br);
    };

    // Retrieving data from api about follow info
    const response3 = await fetch(`profile/${username}/follow`);
    const followData = await response3.json();

    loggedUser = document.querySelector('#username').innerText;

    if (loggedUser != username) {
        // Button customization
        let btn = document.createElement('btn');
        btn.className = 'btn btn-sm btn-outline-primary';

        if (followData['is_following'] == false) {
            btn.innerHTML = "Follow"
            btn.addEventListener('click', () => {
                follow(username, btn);
            });
        }
        else {
            btn.innerHTML = "Unfollow"
            btn.addEventListener('click', () => {
                unfollow(username, btn);
            });
        };

        document.querySelector('#profile-view').append(btn);
    };
};

async function follow(user) {
    const response = await fetch(`/profile/${user}/follow`, {
        method: 'PUT',
        body: JSON.stringify({
            is_following: true
        })
    });

    if (response.status == 204) {
        console.log('OK!')
    }
    else {
        console.log('ERROR')
    };

    document.querySelector('#profile-view').innerHTML = '';
    getProfile(user);
    load_profile();
}

async function unfollow(user) {
    const response = await fetch(`/profile/${user}/follow`, {
        method: 'PUT',
        body: JSON.stringify({
            is_following: false
        })
    });

    if (response.status == 204) {
        console.log('OK!');
    }
    else {
        console.log('ERROR');
    };

    document.querySelector('#profile-view').innerHTML = '';
    getProfile(user);
    load_profile();
}

async function getFollowingPosts() {
    const response = await fetch('/following');
    const data = await response.json();
    console.log(data)

    document.querySelector('#following-view').innerHTML = '';


    // TO DO

    for (let i = 0; i < data.length; i++) {
        // Instantiate desired elements
        let div = document.createElement('div');
        let anchor = document.createElement('a');

        // Declaring variables from data received
        //let username = data[i]['username'];
        let body = data[i]['body'];
        let created = data[i]['created'];
        // let likes = data[i]['likes'];

        // Anchor customization w/ variables declared above
        let text = document.createTextNode(` -> ${body}, on ${created}`);
        anchor.appendChild(text);
        // anchor.href = `profile/${username}`;

        // On clicking the anchor, prevent default behaviour and get+show profile data
        anchor.addEventListener('click', (event) => {
            document.querySelector('#profile-view').innerHTML = '';
            event.preventDefault();
            getProfile(username);
            load_profile();
        })

        // Appending anchor to div and div to posts-view
        div.append(anchor);
        document.querySelector('#following-view').append(div);
    }
}



// Compose post 
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#compose-form').onsubmit = function () {
        const body = document.querySelector('#compose-body').value;

        fetch('/compose', {
            method: 'POST',
            body: JSON.stringify({
                body: body,
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
            });
    };
});








