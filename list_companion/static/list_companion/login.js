

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth >= 428) {
        document.getElementById('login-div').classList.add('w-75');
    }

    window.addEventListener('resize',() => {
        if (window.innerWidth >= 428) {
            document.getElementById('login-div').classList.add('w-75');

        } else {
            document.getElementById('login-div').classList.remove('w-75');
        }
    })
})