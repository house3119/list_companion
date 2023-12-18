
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const base_url = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {

    // Show correct navbar (mobile vs desktop)
    if (window.innerWidth >= 428) {
        document.getElementById('mobile-navbar').classList.add('display-none')
        document.getElementById('desktop-navbar').classList.remove('display-none')
    } else {
        document.getElementById('mobile-navbar').classList.remove('display-none')
        document.getElementById('desktop-navbar').classList.add('display-none')

        // document.getElementById('nav-title').innerHTML = 'My Account';
        // document.getElementById('back-button').classList.remove('display-none');
        // document.getElementById('account-title').classList.add('display-none');
    }

    window.addEventListener('resize',() => {
        if (window.innerWidth >= 428) {
            document.getElementById('mobile-navbar').classList.add('display-none')
            document.getElementById('desktop-navbar').classList.remove('display-none')
        } else {
            document.getElementById('mobile-navbar').classList.remove('display-none')
            document.getElementById('desktop-navbar').classList.add('display-none')
        }
    })

    document.getElementById('back-button').addEventListener('click', () => {
        home()
    })

    // Change Password
    document.getElementById('change-password-button').addEventListener('click', () => {
        document.getElementById('change-password-div').classList.remove('display-none');
        document.getElementById('account-buttons-div').classList.add('display-none');
        document.getElementById('message-div').innerHTML = '';

        document.getElementById('back-button').addEventListener('click', () => {
            account()
        })

        document.getElementById('account-title').classList.add('display-none');

        document.getElementById('change-password-form').removeAttribute('novalidate')

    })
    document.getElementById('change-password-cancel').addEventListener('click', () => {
        document.getElementById('change-password-div').classList.add('display-none');
        document.getElementById('account-buttons-div').classList.remove('display-none');

        document.getElementById('back-button').addEventListener('click', () => {
            home()
        })

        document.getElementById('account-title').classList.remove('display-none')

    })


    // Change Email
    document.getElementById('change-email-button').addEventListener('click', () => {
        document.getElementById('change-email-div').classList.remove('display-none');
        document.getElementById('account-buttons-div').classList.add('display-none');
        document.getElementById('message-div').innerHTML = '';

        document.getElementById('back-button').addEventListener('click', () => {
            account()
        })

        document.getElementById('account-title').classList.add('display-none')

        document.getElementById('change-email-form').removeAttribute('novalidate')

    })
    document.getElementById('change-email-cancel').addEventListener('click', () => {
        document.getElementById('change-email-div').classList.add('display-none');
        document.getElementById('account-buttons-div').classList.remove('display-none');

        document.getElementById('back-button').addEventListener('click', () => {
            home()
        })

        document.getElementById('account-title').classList.remove('display-none')


    })


    // Delete Account
    document.getElementById('delete-account-button').addEventListener('click', () => {
        document.getElementById('delete-account-div').classList.remove('display-none');
        document.getElementById('account-buttons-div').classList.add('display-none');
        document.getElementById('message-div').innerHTML = '';

        document.getElementById('back-button').addEventListener('click', () => {
            account()
        })

        document.getElementById('account-title').classList.add('display-none')

        document.getElementById('delete-account-form').removeAttribute('novalidate')
    })
    document.getElementById('delete-account-cancel').addEventListener('click', () => {
        document.getElementById('delete-account-div').classList.add('display-none');
        document.getElementById('account-buttons-div').classList.remove('display-none');

        document.getElementById('back-button').addEventListener('click', () => {
            home()
        })

        document.getElementById('account-title').classList.remove('display-none')


    })

})

function home() {
    window.location = base_url;
}

function account() {
    window.location = `${base_url}/account`
}