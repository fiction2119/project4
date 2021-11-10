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
    document.querySelector('#edit-view').style.display = 'none';
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
    document.querySelector('#edit-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'block';
}

// Show profile view
function load_profile() {
    // Show profile and hide other views 
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#edit-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'block';
}

// Show following view
function load_following_posts() {

    // Show following and hide other views
    document.querySelector('#following-view').innerHTML = '';
    document.querySelector('#edit-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'block';
}

function load_edit_post() {
    // Show edit form
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#posts-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#edit-view').style.display = 'block';
}

// GET ALL POSTS OF ALL USERS
async function getPosts() {
    const response = await fetch('/posts');
    const data = await response.json();

    // Delete data stored in posts-view
    document.querySelector('#posts-view').innerHTML = '';

    loggedUser = document.querySelector('#username').innerText;


    // Formatting data and appending it to posts-view
    for (let i = 0; i < 10; i++) {
        // Instantiate desired elements
        let anchor_div = document.createElement('div');
        let anchor = document.createElement('a');
        let btn = document.createElement('button');


        // Declaring variables from data received
        let username = data[i]['username'];
        let body = data[i]['body'];
        let created = data[i]['created'];
        // let likes = data[i]['likes'];



        // Anchor customization w/ variables declared above
        let text = document.createTextNode(`${username} -> ${body}, on ${created}`);
        anchor.appendChild(text);
        anchor.href = `profile/${username}`;

        // On clicking the anchor, prevent default behaviour and get+ show profile data
        anchor.addEventListener('click', (event) => {
            document.querySelector('#profile-view').innerHTML = '';
            event.preventDefault();
            getProfile(username);
            load_profile();
        });


        // Appending anchor to div and div to posts-view
        anchor_div.append(anchor);

        if (loggedUser === username) {
            btn.innerText = 'Edit';
            btn.className = 'btn btn-outline-primary btn-sm';
            anchor_div.appendChild(document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'));
            anchor_div.append(btn);
        };


        document.querySelector('#posts-view').append(anchor_div);
    };

    // Declaring variables necessary for pagination
    let current_page = 1;
    let results_per_page = 10;
    let page_num = Math.ceil(data.length / results_per_page);

    // Validate page
    if (current_page < 1) current_page = 1;
    if (current_page > page_num) current_page = page_num;

    let view = document.querySelector('#posts-view');
    let api = `/posts`;

    makePagination(api, view, current_page, results_per_page, page_num);

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

    if (userPosts.length >= 10) {
        len = 10;
    }
    else {
        len = userPosts.length;
    };

    loggedUser = document.querySelector('#username').innerText;
    // For loop to apply instructions to every post
    for (let i = 0; i < len; i++) {

        // Create elements for each post
        let p = document.createElement('p');
        let br = document.createElement('br');

        // Get the desired data to append
        let username = userPosts[i]['username'];
        let body = userPosts[i]['body'];
        let created = userPosts[i]['created'];
        // let likes = userPosts[i]['likes'];

        // Customize data
        p.innerHTML = `${body}, on ${created}`;

        if (loggedUser === username) {
            btn.innerText = 'Edit';
            btn.className = 'btn btn-outline-primary btn-sm';
            anchor_div.appendChild(document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'));
            anchor_div.append(btn);
        };
        // Append elements w/ data to div
        document.querySelector('#profile-view').append(p);
        document.querySelector('#profile-view').append(br);
    };

    // Declaring variables necessary for pagination
    let current_page = 1;
    let results_per_page = 10;
    let page_num = Math.ceil(userPosts.length / results_per_page);

    console.log(page_num, userPosts.length, results_per_page);
    // Validate page
    if (current_page < 1) current_page = 1;
    if (current_page > page_num) current_page = page_num;

    let view = document.querySelector('#profile-view');
    let api = `/profile/posts/${username}`

    makePagination(api, view, current_page, results_per_page, page_num);

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

async function getFollowingPosts() {
    const response = await fetch('/following');
    const data = await response.json();

    if (data.length >= 10) {
        len = 10;
    }
    else {
        len = data.length;
    }

    loggedUser = document.querySelector('#username').innerText;

    for (let i = 0; i < len; i++) {

        // Instantiate desired elements
        let div = document.createElement('div');
        let anchor = document.createElement('a');

        // Declaring variables from data received
        let username = data[i]['username'];
        let body = data[i]['body'];
        let created = data[i]['created'];
        // let likes = data[i]['likes'];

        // Anchor customization w/ variables declared above
        let text = document.createTextNode(`${username} -> ${body}, on ${created}`);
        anchor.appendChild(text);
        anchor.href = `profile/${username}`;

        if (loggedUser === username) {
            btn.innerText = 'Edit';
            btn.className = 'btn btn-outline-primary btn-sm';
            anchor_div.appendChild(document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'));
            anchor_div.append(btn);
        };

        // On clicking the anchor, prevent default behaviour and get+show profile data
        anchor.addEventListener('click', (event) => {
            document.querySelector('#profile-view').innerHTML = '';
            event.preventDefault();
            getProfile(username);
            load_profile();
        });

        // Appending anchor to div and div to posts-view
        div.append(anchor);
        document.querySelector('#following-view').append(div);
    }

    // Declaring variables necessary for pagination
    let current_page = 1;
    let results_per_page = 10;
    let page_num = Math.ceil(data.length / results_per_page);

    // Validate page
    if (current_page < 1) current_page = 1;
    if (current_page > page_num) current_page = page_num;

    let view = document.querySelector('#following-view');
    let api = '/following';

    makePagination(api, view, current_page, results_per_page, page_num);
}

function makePagination(api, view, current_page, results_per_page, page_num) {


    // Declaring parent elements for pagination
    const nav = document.createElement('nav');
    nav.ariaLabel = "Page navigation";
    nav.id = "pagination_nav";

    let ul = document.createElement('ul');
    ul.className = "pagination justify-content-center";
    ul.id = "pagination_ul";
    // Making pagination 
    for (let btn = 0; btn <= 2; btn++) {
        // Instantiate elements
        let li = document.createElement('li');
        let a = document.createElement('a');
        let span = document.createElement('span');

        // Customize, addEventListener and append anchor + span to list item 
        a.className = "page-link";
        a.href = "#";

        span.className = "page-link";
        span.href = "#";

        // Previous button
        if (btn === 0) {
            a.innerText = "Previous";
            a.id = "btn_previous";
            a.addEventListener('click', () => {
                if (current_page > 1) {
                    current_page--;
                    changePage(api, view, current_page, page_num, results_per_page);
                }
            });

            li.append(a);
            li.className = "page-item";
        }
        // Current page 
        else if (btn === 1) {
            span.innerText = current_page;
            span.id = "page";

            li.append(span);
            li.className = "page-item";
        }
        // Next button
        else {
            a.innerText = 'Next';
            a.id = "btn_next";
            a.addEventListener('click', () => {
                if (current_page < page_num) {
                    current_page++;
                    changePage(api, view, current_page, page_num, results_per_page);
                }
            });
            li.append(a);
            li.className = "page-item";
        };
        ul.append(li);
    };

    nav.append(ul);
    view.append(nav);
}

async function changePage(api, view, current_page, page_num, results_per_page) {

    const response = await fetch(`${api}`);
    const data = await response.json();

    let btn_next = document.getElementById("btn_next");
    let btn_previous = document.getElementById("btn_previous");
    let page_span = document.getElementById("page");
    let btn = document.createElement("button");

    // Validate page
    if (current_page < 1) current_page = 1;
    if (current_page > page_num) current_page = page_num;

    view.innerHTML = "";

    loggedUser = document.querySelector('#username').innerText;

    for (let i = (current_page - 1) * results_per_page; i < (current_page * results_per_page) && i < data.length; i++) {

        if (String(view.id) === "profile-view") {
            let p = document.createElement('p');
            let br = document.createElement('br');

            // Get the desired data to append
            let username = data[i]['username'];
            let body = data[i]['body'];
            let created = data[i]['created'];
            // let likes = userPosts[i]['likes'];

            // Customize data
            p.innerHTML = `${body}, on ${created}`;

            // Append elements w/ data to div
            view.append(p);

            if (loggedUser === username) {
                btn.innerText = 'Edit';
                btn.className = 'btn btn-outline-primary btn-sm';
                view.append(btn);
            };

            view.append(br);
        }
        else {
            // Instantiate desired elements
            let anchor_div = document.createElement('div');
            let anchor = document.createElement('a');

            // Declaring variables from data received
            let username = data[i]['username'];
            let body = data[i]['body'];
            let created = data[i]['created'];
            // let likes = data[i]['likes'];

            // Anchor customization w/ variables declared above
            let text = document.createTextNode(`${username} -> ${body}, on ${created}`);
            anchor.appendChild(text);
            anchor.href = '#';

            // On clicking the anchor, prevent default behaviour and get+ show profile data
            anchor.addEventListener('click', (event) => {
                document.querySelector('#profile-view').innerHTML = '';
                event.preventDefault();
                load_profile();
                getProfile(username);
            });


            // Appending anchor to div and div to posts-view
            anchor_div.append(anchor);

            if (loggedUser === username) {
                btn.innerText = 'Edit';
                btn.className = 'btn btn-outline-primary btn-sm';
                anchor_div.appendChild(document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'));
                anchor_div.append(btn);
            };

            view.append(anchor_div);
        }
    }

    page_span.innerHTML = current_page;

    if (current_page == 1) {
        btn_previous.style.visibility = "hidden";
    }
    else {
        btn_previous.style.visibility = "visible";
    };

    if (current_page == page_num) {
        btn_next.style.visibility = "hidden";
    }
    else {
        btn_next.style.visibility = "visible";
    };

    makePagination(api, view, current_page, results_per_page, page_num);

};

// FOLLOW/UNFOLLOW
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

// Edit post 
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#edit-form').onsubmit = function () {
        const body = document.querySelector('#edit-body').value;

        fetch('/edit', {
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








