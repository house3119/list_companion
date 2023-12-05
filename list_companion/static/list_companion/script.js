
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const base_url = 'http://127.0.0.1:8000';


document.addEventListener('DOMContentLoaded', () => {

    // Build the list view once the index page is loaded
    build_lists()


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
            build_lists()
            document.getElementById('create-new-list-div').style.display = 'none';
            document.getElementById('toggle-create-new-list-div-button').innerHTML = '+ New List'
            document.getElementById('new-list-name').value = '';
            document.getElementById('new-list-description').value = '';
        }) 
    })
    document.getElementById('toggle-create-new-list-div-button').addEventListener('click', () => {
        if (document.getElementById('create-new-list-div').style.display === 'none') {
            document.getElementById('create-new-list-div').style.display = 'block';
            document.getElementById('toggle-create-new-list-div-button').innerHTML = '- New List'
        } else {
            document.getElementById('create-new-list-div').style.display = 'none';
            document.getElementById('toggle-create-new-list-div-button').innerHTML = '+ New List'
        }
    })


    // Back button event listener
    document.getElementById('back-button').addEventListener('click', () => {
        document.getElementById('view-all-lists-div').classList.remove('display-none');
        document.getElementById('view-individual-list-div').classList.add('display-none');
        document.getElementById('back-button-div').classList.add('display-none');

        document.getElementById('list-items-container').classList.add('display-none');
        document.getElementById('toggle-add-new-item-container').classList.add('display-none');
        document.getElementById('add-new-item-container').classList.add('display-none');
        document.getElementById('list-action-items').classList.add('list-action-active');
        document.getElementById('list-action-users').classList.remove('list-action-active');

        document.getElementById('users-container').classList.add('display-none')
        document.getElementById('toggle-add-user-container').classList.add('display-none')
        document.getElementById('add-user-message').innerHTML = '';
        
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
        document.getElementById('users-container').classList.remove('display-none')
        document.getElementById('toggle-add-user-container').classList.remove('display-none')
        document.getElementById('add-user-container').classList.add('display-none')

        build_user_view()
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
        document.getElementById('toggle-add-user-container').classList.add('display-none')
        document.getElementById('add-user-container').classList.add('display-none')
        document.getElementById('add-user-message').innerHTML = '';
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
        res['Lists'].forEach(list => {
            build_list_card(list)
        });
    })
}


// Function to build each individual list card in the index page
// Called by previous build list view function
function build_list_card(list) {
    let card = document.createElement('div');
    card.className = 'card list-card';

    let list_title = document.createElement('h5');
    list_title.className = 'card-header'
    list_title.innerHTML = list.list_name;
    card.appendChild(list_title);

    let delete_list_span = document.createElement('span');
    delete_list_span.className = 'delete-list-button-span';
    list_title.appendChild(delete_list_span);

    let delete_list_button = document.createElement('button');
    delete_list_button.innerHTML = 'Delete';
    delete_list_button.className = 'btn btn-warning btn-sm delete-list-button';
    delete_list_button.addEventListener('click', () => {
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
            build_lists()
        })
    })
    delete_list_span.appendChild(delete_list_button);

    let list_body = document.createElement('div');
    list_body.addEventListener('click', () => {
        build_individual_list(list.id)

        document.getElementById('list-items-container').classList.remove('display-none');
        document.getElementById('toggle-add-new-item-container').classList.remove('display-none');
        document.getElementById('add-new-item-container').classList.add('display-none');

        document.getElementById('current-list-id').innerHTML = list.id;
    })
    list_body.className = 'card-body';
    card.appendChild(list_body);

    let list_text = document.createElement('p');
    list_text.className = 'card-text';
    list_text.innerHTML = list.list_description;
    list_body.appendChild(list_text);

    document.getElementById('view-all-lists-container').appendChild(card);
}


// Function to build the view for an individual list view
function build_individual_list(list_id) {

    // First set the visibilities for page components and adds active class for 'items' button in the top row
    document.getElementById('view-all-lists-div').classList.add('display-none');
    document.getElementById('view-individual-list-div').classList.remove('display-none');
    document.getElementById('back-button-div').classList.remove('display-none');
    document.getElementById('list-action-items').classList.add('list-action-active');

    // Fetch items for the list in question
    fetch(`${base_url}/get_list_items/${list_id}`)
    .then(response => response.json())
    .then(res => {
        // Empty the list items container
        var div = document.getElementById('list-items-container');
        while(div.firstChild){
            div.removeChild(div.firstChild);
        }
        
        // Builds card for each item in the list and adds them to item container
        res["List_items"].forEach(item => {
            build_individual_list_item(item, list_id)
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
    build_add_item_containers(list_id)
    
}


// Function to build card for each item in a list
function build_individual_list_item(item, list_id) {
    let card = document.createElement('div');
    card.className = 'card list-card';

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
    list_text.prepend(checkbox)

    let delete_item_span = document.createElement('span');
    delete_item_span.className = 'delete-list-button-span';
    list_text.appendChild(delete_item_span);

    let delete_item_button = document.createElement('button');
    delete_item_button.innerHTML = 'Remove';
    delete_item_button.className = 'btn btn-warning btn-sm delete-list-button';
    delete_item_button.addEventListener('click', () => {
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
            build_individual_list(list_id)
        })
    })
    delete_item_span.appendChild(delete_item_button);

    document.getElementById('list-items-container').appendChild(card)
}


// Builds the new item toggle and input and adds them to corresponding containers
function build_add_item_containers(list_id) {
    document.getElementById('add-new-item-container').classList.add('display-none')

    let input = document.createElement('input');
    input.type = 'text';
    input.classList = 'form-control';
    input.placeholder = 'Name';
    input.id = 'add-new-item-input';
    document.getElementById('add-new-item-container').appendChild(input)

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
            build_individual_list(list_id)
        })

    })
    document.getElementById('add-new-item-container').appendChild(button)

    button = document.createElement('button');
    button.classList = 'btn btn-primary';
    button.id = 'add-item-toggle-button'
    button.innerHTML = '+ Add item';
    button.addEventListener('click', () => {
        if (document.getElementById('add-new-item-container').classList.contains('display-none')) {
            document.getElementById('add-new-item-container').classList.remove('display-none')
            button.innerHTML = '- Add item';
        } else {
            document.getElementById('add-new-item-container').classList.add('display-none')
            button.innerHTML = '+ Add item';
        }
        
    })

    document.getElementById('toggle-add-new-item-container').appendChild(button)
}


// Builds the user view
function build_user_view() {

    // Empty div first
    var div = document.getElementById('users-container');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    // Get current list id
    let current_list_id = parseInt(document.getElementById('current-list-id').innerHTML)

    fetch(`${base_url}/get_users/${current_list_id}`)
    .then(response => response.json())
    .then(res => {

        // Add list owner first
        let card = document.createElement('div');
        card.className = 'card list-card';

        let list_body = document.createElement('div');
        list_body.className = 'card-body';
        card.appendChild(list_body);

        let list_text = document.createElement('p');
        list_text.className = 'card-text';
        list_text.innerHTML = res.owner + ' &#127775';
        list_body.appendChild(list_text);

        document.getElementById('users-container').appendChild(card)

        // Add additional users
        res.additional_users.forEach((user) => {
            card = document.createElement('div');
            card.className = 'card list-card';

            let list_body = document.createElement('div');
            list_body.className = 'card-body';
            card.appendChild(list_body);

            let list_text = document.createElement('p');
            list_text.className = 'card-text';
            list_text.innerHTML = user
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
                        build_user_view()
                    })
                })
                delete_item_span.appendChild(delete_item_button);
            }

            document.getElementById('users-container').appendChild(card)
        })    
    })

    build_add_user_containers(current_list_id)
}


function build_add_user_containers(list_id) {

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


    // Check if current logged in user is the owner of the list, return if not
    fetch(`${base_url}/get_user_info/${list_id}`)
    .then(response => response.json())
    .then(res => {
        if (res.Owner === false) {
            return
        }
    })

    let input = document.createElement('input');
    input.type = 'text';
    input.classList = 'form-control';
    input.placeholder = 'Username';
    input.id = 'add-user-input';
    document.getElementById('add-user-container').appendChild(input)

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
            console.log(res)

            if (res.Success === true) {
                build_user_view()
                document.getElementById('add-user-message').innerHTML = res.Message;
                document.getElementById('add-user-container').classList.add('display-none')
            } else {
                document.getElementById('add-user-message').innerHTML = res.Message;
            }
        })

    })
    document.getElementById('add-user-container').appendChild(button)

    button = document.createElement('button');
    button.classList = 'btn btn-primary';
    button.innerHTML = '+ Add user';
    button.addEventListener('click', () => {
        if (document.getElementById('add-user-container').classList.contains('display-none')) {
            document.getElementById('add-user-container').classList.remove('display-none')
            button.innerHTML = '- Add user';
        } else {
            document.getElementById('add-user-container').classList.add('display-none')
            button.innerHTML = '+ Add user';
        }
        
    })

    document.getElementById('toggle-add-user-container').appendChild(button)
}