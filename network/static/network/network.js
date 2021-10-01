document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#new-post').addEventListener('click', () => {
        load_compose();
    });

    document.querySelector('#all-posts').addEventListener('click', () => {
        load_posts();
        getAllPosts();
    });
});

// Show new post view
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

    document.querySelector('#profile-view').innerHTML= ''
    // Show posts and hide compose 
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'block';
}

function load_profile() {
    // Show profile and hide other views 
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'block';
}

async function getAllPosts() {
    // Get all posts
    const response = await fetch('/posts');
    const data = await response.json();

    // Delete data stored in posts-view
    document.querySelector('#posts-view').innerHTML= ''

    for (let i = 0; i < data.length; i++) {
        // Instantiate desired elements
        let div = document.createElement('div');
        let a = document.createElement('a');
        let anchorText = document.createTextNode(`${data[i]['username']}`);
        
        // Customize elements
        a.href= '#';
        a.className = 'anchors';
        
        // TODO: USE THIS DATA
        username = data[i]['username'];
        body = data[i]['body'];
        timestamp = data[i]['timestamp'];
        likes = data[i]['likes'];
        
        // Append elements
        a.appendChild(anchorText);
        div.append(a, ` -> ${body}`);
        document.querySelector('#posts-view').append(div);
    };

    // For each element in elements, add click listener
    let elements = document.querySelectorAll('.anchors');
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', () => {
            document.querySelector('#profile-view').innerHTML = '';
            getProfile(elements[i].innerText);
            load_profile();
        });
    };
};

async function getProfile(user) {
    // Get profile data 
    const response = await fetch(`/profile/${user}`);
    const data = await response.json();
    console.log(data);
    // Get profile's posts data
    const response2 = await fetch(`/profile/posts/${user}`);
    const data2 = await response2.json();
    console.log(data2);

    // Instantiate elements
    header = document.createElement('h3');
    p = document.createElement('p');
    btn = document.createElement('btn');

    // Customize elements
    header.innerHTML = data['username'];
    p.innerHTML = ` ${data['followers']} || ${data['following']}`;
    btn.className = 'btn btn-sm btn-outline-primary';
    btn.innerHTML = 'Follow';

    // Append desired elements to profile-view
    document.querySelector('#profile-view').append(header);
    document.querySelector('#profile-view').append(p);
    document.querySelector('#profile-view').append(btn);

    btn.addEventListener('click', () => {
        follow(user);
    });

    // For loop to apply instructions to every post
    for (let i = 0; i < data2.length; i++) {

        // Create elements for each post
        let p = document.createElement('p');
        let br = document.createElement('br');

        // Get the desired data to append
        username = data2[i]['username'];
        body = data2[i]['body'];
        timestamp = data2[i]['timestamp'];
        likes = data2[i]['likes'];

        // Customize data
        p.innerHTML = `${data2[i]['body']}`;

        // Append elements w/ data to div
        document.querySelector('#profile-view').append(p);
        document.querySelector('#profile-view').append(br);
    };
};

async function follow(user, button) {
    const response = await fetch(`profile/${user}/follow`);
    const data = await response.json();
    console.log(data)


    /*
    if (button.innerText == 'Follow') {
        const response = await fetch(`/profile/${user}`,  {
            method: 'PUT',
            body: JSON.stringify({
                follow: true
            })
        });

        if(response.status == 204) {
            console.log('OK!')
        }
        else {
            console.log('ERROR')
        };
    }
    else {
        const response = await fetch(`/profile/${user}`,  {
            method: 'PUT',
            body: JSON.stringify({
                follow: false
            })
        });

        if(response.status == 204) {
            console.log('OK!');
        }
        else { 
            console.log('ERROR');
        };
    }
    */
}

// Compose post 
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#compose-form').onsubmit = function() {
        const body = document.querySelector('#compose-body').value;
    
        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                body:body,
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        });
    };
});








