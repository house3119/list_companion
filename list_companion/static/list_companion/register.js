

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth >= 428) {
        document.getElementById('register-div').classList.add('w-75')

    } else {

    }

    window.addEventListener('resize',() => {
        if (window.innerWidth >= 428) {
            document.getElementById('register-div').classList.add('w-75')

        } else {
            document.getElementById('register-div').classList.remove('w-75')

        }
    })
})