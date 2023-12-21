

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const base_url = 'http://127.0.0.1:8000';
var desktop_view = true;

document.addEventListener('DOMContentLoaded', () => {

    // Show correct navbar (mobile vs desktop)
    if (window.innerWidth >= 428) {
        document.getElementById('mobile-navbar').classList.add('display-none');
        document.getElementById('desktop-navbar').classList.remove('display-none');
        desktop_view = true;
    } else {
        document.getElementById('mobile-navbar').classList.remove('display-none');
        document.getElementById('desktop-navbar').classList.add('display-none');
        desktop_view = false;
    }

    window.addEventListener('resize',() => {
        if (window.innerWidth >= 428) {
            document.getElementById('mobile-navbar').classList.add('display-none');
            document.getElementById('desktop-navbar').classList.remove('display-none');
            desktop_view = true;
        } else {
            document.getElementById('mobile-navbar').classList.remove('display-none');
            document.getElementById('desktop-navbar').classList.add('display-none');
            desktop_view = false;
        }
    })


    // Build the list view
    build_lists();


    // Code for add new list input and buttons
    document.getElementById('create-new-list-button').addEventListener('click', () => {
        fetch(`${base_url}/add_list`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                'new_list_name': document.getElementById('new-list-name').value,
                'new_list_description': document.getElementById('new-list-description').value
            })
        })
        .then(response => response.json())
        .then(res => {
            build_lists();
            document.getElementById('create-new-list-div').style.display = 'none';
            document.getElementById('toggle-create-new-list-div-button').innerHTML = '+ New List';
            document.getElementById('new-list-name').value = '';
            document.getElementById('new-list-description').value = '';
        }) 
    })
    document.getElementById('toggle-create-new-list-div-button').addEventListener('click', () => {
        if (document.getElementById('create-new-list-div').style.display === 'none') {
            document.getElementById('create-new-list-div').style.display = 'block';
            document.getElementById('toggle-create-new-list-div-button').innerHTML = '- Create new list';
            document.getElementById('toggle-create-new-list-div-button').classList.add('active');
            document.getElementById('new-list-name').focus();
        } else {
            document.getElementById('create-new-list-div').style.display = 'none';
            document.getElementById('toggle-create-new-list-div-button').innerHTML = '+ Create new list';
            document.getElementById('toggle-create-new-list-div-button').classList.remove('active');
        }
    })


    // Back button event listener
    document.getElementById('back-button').addEventListener('click', () => {
        document.getElementById('view-all-lists-div').classList.remove('display-none');
        document.getElementById('view-individual-list-div').classList.add('display-none');
        document.getElementById('back-button').classList.add('display-none');

        document.getElementById('list-items-container').classList.add('display-none');
        document.getElementById('toggle-add-new-item-container').classList.add('display-none');
        document.getElementById('add-new-item-container').classList.add('display-none');
        document.getElementById('list-action-items').classList.add('list-action-active');
        document.getElementById('list-action-users').classList.remove('list-action-active');

        document.getElementById('users-container').classList.add('display-none');
        document.getElementById('toggle-add-user-container').classList.add('display-none');
        document.getElementById('add-user-container').classList.add('display-none');
        document.getElementById('add-user-message').innerHTML = '';
        document.getElementById('list-action-logs').classList.remove('list-action-active');

        // document.getElementById('nav-list-name').classList.add('display-none');
        document.getElementById('nav-brand-img-mobile').classList.remove('display-none');
        
    })

    // Individual list view buttons event listeners
    document.getElementById('list-action-users').addEventListener('click', (event) => {
        if (document.getElementById('list-action-users').classList.contains('list-action-active')) {
            return
        }

        document.getElementById('list-items-container').classList.add('display-none');
        document.getElementById('toggle-add-new-item-container').classList.add('display-none');
        document.getElementById('add-new-item-container').classList.add('display-none');
        document.getElementById('list-action-items').classList.remove('list-action-active');
        document.getElementById('list-action-users').classList.add('list-action-active');
        document.getElementById('add-new-item-input').value = '';
        document.getElementById('users-container').classList.remove('display-none');
        document.getElementById('toggle-add-user-container').classList.remove('display-none');
        document.getElementById('add-user-container').classList.add('display-none');
        document.getElementById('list-action-logs').classList.remove('list-action-active');
        document.getElementById('log-container').classList.add('display-none');
        document.getElementById('user-info-container').classList.remove('display-none');

        build_user_view();
    })

    document.getElementById('list-action-items').addEventListener('click', () => {
        if (document.getElementById('list-action-items').classList.contains('list-action-active')) {
            return
        }

        document.getElementById('list-items-container').classList.remove('display-none');
        document.getElementById('toggle-add-new-item-container').classList.remove('display-none');
        document.getElementById('add-new-item-container').classList.add('display-none');
        document.getElementById('list-action-items').classList.add('list-action-active');
        document.getElementById('list-action-users').classList.remove('list-action-active');
        document.getElementById('users-container').classList.add('display-none');
        document.getElementById('add-item-toggle-button').innerHTML = '+ Add item';
        document.getElementById('toggle-add-user-container').classList.add('display-none');
        document.getElementById('add-user-container').classList.add('display-none');
        document.getElementById('add-user-message').innerHTML = '';
        document.getElementById('list-action-logs').classList.remove('list-action-active');
        document.getElementById('log-container').classList.add('display-none');
        document.getElementById('user-info-container').classList.add('display-none');
    })

    document.getElementById('list-action-logs').addEventListener('click', () => {
        if (document.getElementById('list-action-logs').classList.contains('list-action-active')) {
            return
        }

        document.getElementById('list-items-container').classList.add('display-none');
        document.getElementById('toggle-add-new-item-container').classList.add('display-none');
        document.getElementById('add-new-item-container').classList.add('display-none');
        document.getElementById('list-action-items').classList.remove('list-action-active');
        document.getElementById('list-action-users').classList.remove('list-action-active');
        document.getElementById('list-action-logs').classList.add('list-action-active');
        document.getElementById('users-container').classList.add('display-none');
        document.getElementById('add-item-toggle-button').innerHTML = '+ Add item';
        document.getElementById('toggle-add-user-container').classList.add('display-none');
        document.getElementById('add-user-container').classList.add('display-none');
        document.getElementById('add-user-message').innerHTML = '';
        document.getElementById('log-container').classList.remove('display-none');
        document.getElementById('user-info-container').classList.add('display-none');

        build_logs();
    })
})


// Function to build the lists view in index page
// First empties the lists container, then fetches updated lists and rebuilds
function build_lists() {
    var div = document.getElementById('view-all-lists-container');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    fetch(`${base_url}/get_lists`)
    .then(response => response.json())
    .then(res => {
        if (res['Lists'].length === 0 && res['Foreign_lists'].length === 0) {
            let div = document.createElement('div');
            div.className = 'container text-center';

            let par = document.createElement('p');
            par.innerHTML = `&#129364<br>Welcome to List Companion! Seems like you don't have any lists yet. Please use the "Create new list" button to create a list!`;

            div.appendChild(par);
            document.getElementById('view-all-lists-container').appendChild(div);
        }

        // let title = document.createElement('h4');
        // title.innerHTML = 'Your lists';
        // document.getElementById('view-all-lists-container').appendChild(title)

        res['Lists'].forEach(list => {
            build_list_card(list, 'owner');
        });

        // title = document.createElement('h4');
        // title.innerHTML = 'Lists shared with you';
        // document.getElementById('view-all-lists-container').appendChild(title)

        res['Foreign_lists'].forEach(list => {
            build_list_card(list, 'foreign');
        })
    })
}


// Function to build each individual list card in the index page
// Called by previous build list view function
// Variables: 
// - list (json object containing list information)
// - type (string containing 'owner' or 'foreign', tells if the list belongs to the user logged in or not)
function build_list_card(list, type) {
    let card = document.createElement('div');
    card.className = 'card list-card mb-3 custom-list-card-1';

    let list_title = document.createElement('h5');
    list_title.className = 'card-header';
    if (type === 'owner') {
        list_title.innerHTML = list.list_name + ' &#127775';
    } else {
        list_title.innerHTML = list.list_name;
    }
    card.appendChild(list_title);

    if (type === 'owner') {
        let delete_list_span = document.createElement('span');
        delete_list_span.className = 'delete-list-button-span';
        list_title.appendChild(delete_list_span);

        let delete_list_button = document.createElement('button');
        delete_list_button.innerHTML = 'Delete List';
        delete_list_button.className = 'btn btn-danger btn-sm delete-list-button';
        delete_list_button.addEventListener('click', () => {
            let confirm = ConfirmDelete();
            if (confirm === false) {
                return
            }

            fetch(`${base_url}/delete_list`, {
                method: 'POST',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
                body: JSON.stringify({
                    'list_to_be_deleted': list.id
                })
            })
            .then(response => response.json())
            .then(res => {
                build_lists();
            })
        })
        delete_list_span.appendChild(delete_list_button);

    } else {
        let unsub_list_span = document.createElement('span');
        unsub_list_span.className = 'unsub-button-span';
        list_title.appendChild(unsub_list_span);

        let unsub_list_button = document.createElement('button');
        unsub_list_button.innerHTML = 'Unsubscribe';
        unsub_list_button.className = 'btn btn-warning btn-sm unsub-button';
        unsub_list_button.addEventListener('click', () => {
            let confirm = ConfirmDelete();
            if (confirm === false) {
                return
            }

            fetch(`${base_url}/unsub`, {
                method: 'POST',
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
                body: JSON.stringify({
                    'list_to_unsub': list,
                })
            })
            .then(response => response.json())
            .then(res => {
                build_lists();
            })

        })

        unsub_list_span.appendChild(unsub_list_button);
    }

    let list_body = document.createElement('div');
    list_body.addEventListener('click', () => {
        build_individual_list(list.id);

        document.getElementById('list-items-container').classList.remove('display-none');
        document.getElementById('toggle-add-new-item-container').classList.remove('display-none');
        document.getElementById('add-new-item-container').classList.add('display-none');
        // document.getElementById('nav-list-name').innerHTML = list.list_name;

        document.getElementById('current-list-id').innerHTML = list.id;

        // document.getElementById('nav-list-name').classList.remove('display-none');
        // document.getElementById('nav-brand-img-mobile').classList.add('display-none');

    })
    list_body.className = 'card-body';
    card.appendChild(list_body);

    let list_text = document.createElement('p');
    list_text.className = 'card-text';
    list_text.innerHTML = list.list_description;
    list_body.appendChild(list_text);

    list_text = document.createElement('p');
    list_text.className = 'card-text';
    list_text.innerHTML = `&#128081 <b>${list.owner_username}</b>`;
    let length = list.additional_users.length;
    if (length != 0) {
        list_text.innerHTML += ` + ${length} others`;
    }
    //list.additional_users.forEach((usr) => {
    //    list_text.innerHTML += `&#128100 ${usr}`
    //})
    list_body.appendChild(list_text);

    document.getElementById('view-all-lists-container').appendChild(card);
}


// Function to build the view for an individual list view
function build_individual_list(list_id) {

    // First set the visibilities for page components and adds active class for 'items' button in the top row
    document.getElementById('view-all-lists-div').classList.add('display-none');
    document.getElementById('view-individual-list-div').classList.remove('display-none');
    // document.getElementById('back-button').classList.remove('display-none');
    document.getElementById('list-action-items').classList.add('list-action-active');
    document.getElementById('log-container').classList.add('display-none');

    // Fetch items for the list in question
    fetch(`${base_url}/get_list_items/${list_id}`)
    .then(response => response.json())
    .then(res => {

        document.getElementById('desktop-list-name').innerHTML = res["List_name"];

        // Empty the list items container
        var div = document.getElementById('list-items-container');
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
        
        // Builds card for each item in the list and adds them to item container
        let length= res["List_items"].length;

        if (length === 0) {
            let card = document.createElement('div');
            card.className = 'card list-card custom-list-card-2 last-item-card text-center';

            let list_body = document.createElement('div');
            list_body.className = 'card-body';
            card.appendChild(list_body);

            let list_text = document.createElement('p');
            list_text.className = 'card-text';
            list_text.innerHTML = `&#129364<br>This list is empty. Please use the "Add item" button to start adding items to the list!`;
            list_body.appendChild(list_text);

            document.getElementById('list-items-container').appendChild(card);
        }

        let counter = 0;
        res["List_items"].forEach(item => {
            counter += 1;
            if (counter != length) {
                build_individual_list_item(item, list_id, false);
            } else {
                build_individual_list_item(item, list_id, true);
            }          
        })
    })

    // Empty the add new item toggle and inputs
    var div = document.getElementById('toggle-add-new-item-container');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
    var div = document.getElementById('add-new-item-container');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    // Build the add new item toggle and inputs
    build_add_item_containers(list_id);
}


// Function to build card for each item in a list
function build_individual_list_item(item, list_id, last) {
    let card = document.createElement('div');
    if (last === true) {
        card.className = 'card list-card custom-list-card-2 last-item-card';
    } else {
        card.className = 'card list-card custom-list-card-2';
    }

    let list_body = document.createElement('div');
    list_body.className = 'card-body';
    card.appendChild(list_body);

    let list_text = document.createElement('p');
    list_text.className = 'card-text';
    list_text.innerHTML = item.list_item_name;
    list_body.appendChild(list_text);

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList = 'form-check-input list-item-done-checkbox';
    if (item.list_item_done == true) {
        checkbox.checked = true;
        card.classList.add('bg-body-tertiary');
        list_text.classList.add('text-secondary');
    }
    checkbox.addEventListener('change', () => {
        fetch(`${base_url}/item_done`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                'done': checkbox.checked,
                'item': item.id
            })
        })
        .then(response => response.json())
        .then(res => {
            // build_individual_list(list_id)
        })

    })
    list_text.prepend(checkbox);

    let delete_item_span = document.createElement('span');
    delete_item_span.className = 'delete-list-button-span';
    list_text.appendChild(delete_item_span);

    let delete_item_button = document.createElement('button');
    delete_item_button.innerHTML = 'Remove';
    delete_item_button.className = 'btn btn-warning btn-sm delete-list-button';
    delete_item_button.addEventListener('click', () => {
        let confirm = ConfirmDelete();
        if (confirm === false) {
            return
        }

        fetch(`${base_url}/delete_item`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                'item_to_be_deleted': item.id
            })
        })
        .then(response => response.json())
        .then(res => {
            build_individual_list(list_id);
        })
    })
    delete_item_span.appendChild(delete_item_button);

    document.getElementById('list-items-container').appendChild(card);
}


// Builds the new item toggle and input and adds them to corresponding containers
function build_add_item_containers(list_id) {
    document.getElementById('add-new-item-container').classList.add('display-none');

    let input = document.createElement('input');
    input.type = 'text';
    input.classList = 'form-control mb-2';
    input.placeholder = 'Name';
    input.id = 'add-new-item-input';
    document.getElementById('add-new-item-container').appendChild(input);

    let button = document.createElement('button');
    button.classList = 'btn btn-primary';
    button.innerHTML = 'Add';
    button.addEventListener('click', () => {

        fetch(`${base_url}/add_item`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                'new_item': document.getElementById('add-new-item-input').value,
                'list_id': list_id
            })
        })
        .then(response => response.json())
        .then(res => {
            build_individual_list(list_id);
        })
    })
    document.getElementById('add-new-item-container').appendChild(button);

    button = document.createElement('button');
    button.classList = 'btn btn-primary mt-3 mb-2';
    button.id = 'add-item-toggle-button';
    button.innerHTML = '+ Add item';
    button.addEventListener('click', () => {
        if (document.getElementById('add-new-item-container').classList.contains('display-none')) {
            document.getElementById('add-new-item-container').classList.remove('display-none');
            button.innerHTML = '- Add item';
            button.classList.add('active');
            document.getElementById('add-new-item-input').focus();
        } else {
            document.getElementById('add-new-item-container').classList.add('display-none');
            button.innerHTML = '+ Add item';
            button.classList.remove('active');
        }
    })

    document.getElementById('toggle-add-new-item-container').appendChild(button);
}


// Builds the user view
function build_user_view() {

    // Empty div first
    var div = document.getElementById('users-container');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    // Get current list id
    let current_list_id = parseInt(document.getElementById('current-list-id').innerHTML);

    fetch(`${base_url}/get_users/${current_list_id}`)
    .then(response => response.json())
    .then(res => {

        // Add list owner first
        let card = document.createElement('div');
        card.className = 'card list-card custom-list-card-2';
        card.id = 'list-owner-card';

        let list_body = document.createElement('div');
        list_body.className = 'card-body';
        card.appendChild(list_body);

        let list_text = document.createElement('p');
        list_text.className = 'card-text';
        list_text.innerHTML = res.owner + ' &#127775';
        list_body.appendChild(list_text);

        document.getElementById('users-container').appendChild(card);

        // Add additional users
        let length = res.additional_users.length;
        if (length === 0) {
            card.classList.add('last-item-card');
        }
        let counter = 0;
        res.additional_users.forEach((user) => {
            counter += 1;
            card = document.createElement('div');
            if (counter === length) {
                card.className = 'card list-card custom-list-card-2 last-item-card';
            } else {
                card.className = 'card list-card custom-list-card-2';
            }

            let list_body = document.createElement('div');
            list_body.className = 'card-body';
            card.appendChild(list_body);

            let list_text = document.createElement('p');
            list_text.className = 'card-text';
            list_text.innerHTML = user;
            list_body.appendChild(list_text);

            // If logged in user is the list owner, add remove user button
            if (res.logged_user === res.owner) {
                let delete_item_span = document.createElement('span');
                delete_item_span.className = 'delete-list-button-span';
                list_text.appendChild(delete_item_span);

                let delete_item_button = document.createElement('button');
                delete_item_button.innerHTML = 'Remove';
                delete_item_button.className = 'btn btn-warning btn-sm delete-list-button';
                delete_item_button.addEventListener('click', () => {
                    let confirm = ConfirmDelete();
                    if (confirm === false) {
                        return
                    }

                    fetch(`${base_url}/remove_user_from_list`, {
                        method: 'POST',
                        headers: {'X-CSRFToken': csrftoken},
                        mode: 'same-origin',
                        body: JSON.stringify({
                            'user_to_be_removed': user,
                            "list_id": current_list_id
                        })
                    })
                    .then(response => response.json())
                    .then(res => {
                        build_user_view();
                    })
                })
                delete_item_span.appendChild(delete_item_button);
            }
            document.getElementById('users-container').appendChild(card);
        })
    build_add_user_containers(current_list_id, res.owner, res.logged_user);
    }) 
}


function build_add_user_containers(list_id, owner, logged_user) {

    // Empty divs
    var div = document.getElementById('toggle-add-user-container');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    var div = document.getElementById('add-user-container');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    document.getElementById('add-user-message').innerHTML = '';

    if (owner != logged_user) {
        return
    }

    let input = document.createElement('input');
    input.type = 'text';
    input.classList = 'form-control mb-2';
    input.placeholder = 'User';
    input.id = 'add-user-input';
    document.getElementById('add-user-container').appendChild(input);

    let button = document.createElement('button');
    button.classList = 'btn btn-primary';
    button.innerHTML = 'Add';
    button.addEventListener('click', () => {

        fetch(`${base_url}/add_user`, {
            method: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
            body: JSON.stringify({
                'user_to_be_added': document.getElementById('add-user-input').value,
                'list': list_id
            })
        })
        .then(response => response.json())
        .then(res => {
            if (res.Success === true) {
                build_user_view();
                document.getElementById('add-user-message').innerHTML = res.Message;
                document.getElementById('add-user-container').classList.add('display-none');
                document.getElementById('add-user-message').classList.add('text-success');
                document.getElementById('add-user-message').classList.remove('text-danger');
            } else {
                document.getElementById('add-user-message').innerHTML = res.Message;
                document.getElementById('add-user-message').classList.add('text-danger');
                document.getElementById('add-user-message').classList.remove('text-success');
            }
        })
    })
    document.getElementById('add-user-container').appendChild(button);

    button = document.createElement('button');
    button.classList = 'btn btn-primary mb-2 mt-3';
    button.innerHTML = '+ Add user';
    button.addEventListener('click', () => {
        if (document.getElementById('add-user-container').classList.contains('display-none')) {
            document.getElementById('add-user-container').classList.remove('display-none');
            button.innerHTML = '- Add user';
            button.classList.add('active');
            document.getElementById('add-user-input').focus();
        } else {
            document.getElementById('add-user-container').classList.add('display-none');
            button.innerHTML = '+ Add user';
            button.classList.remove('active');
        }      
    })

    document.getElementById('toggle-add-user-container').appendChild(button);
}


// Builds log view
function build_logs() {

    // Empty div
    var div = document.getElementById('log-container');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    let current_list_id = parseInt(document.getElementById('current-list-id').innerHTML);

    fetch(`${base_url}/get_logs/${current_list_id}`)
    .then(response => response.json())
    .then(res => {

        if (res['Log'].length === 0) {
            let card = document.createElement('div');
            card.className = 'card list-card custom-list-card-2 last-item-card text-center';

            let list_body = document.createElement('div');
            list_body.className = 'card-body font-italic';
            card.appendChild(list_body);

            let list_text = document.createElement('p');
            list_text.className = 'card-text';
            list_text.innerHTML = `&#129364<br>This log is empty. Please check here again once you have added something to the list!`;
            list_body.appendChild(list_text);

            document.getElementById('log-container').appendChild(card);
        } 

        let ul = document.createElement('ul');
        ul.className = 'list-group custom-user-ul';

        res.Log.forEach((log_message) => {
            let li = document.createElement('li');
            li.className = 'list-group-item';

            if (log_message.log_action === 'ADD') {
                li.innerHTML = `<b>${log_message.username}</b> added <b>${log_message.log_item}</b> (${log_message.log_date})`;
            } else if (log_message.log_action === 'DEL') {
                li.innerHTML = `<b>${log_message.username}</b> removed <b>${log_message.log_item}</b> (${log_message.log_date})`;
            } else if (log_message.log_action === 'DON') {
                li.innerHTML = `<b>${log_message.username}</b> marked <b>${log_message.log_item}</b> as done (${log_message.log_date})`;
            } else if (log_message.log_action === 'UND') {
                li.innerHTML = `<b>${log_message.username}</b> marked <b>${log_message.log_item}</b> as undone (${log_message.log_date})`;
            }
            ul.appendChild(li);
        })
        document.getElementById('log-container').appendChild(ul);
    })
}


// Confirm deletions in multiple places
function ConfirmDelete() {
  return confirm("Are you sure?");
}