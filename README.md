# List Companion

## Introduction
Hello and welcome! This is my final project for CS50 Web - List Companion. List Companion is a web app used to create, share and manipulate checklists with other users.

## Design
List Companion is built using Django on the back-end and Javascript on the front-end. The application is mobile-responsive as I planned it from the start to be used mostly with mobile devices. However, the app is very usable on desktops as well. List Companion functions primarily as a single-page app using Javascript to fetch and update the page contents.

I decided on this particular project as this kind of listing application is something me and my friends/family have been talking about. We have been trying multiple similar apps but none of them has been fully satisfying, so making my own seemed like a good idea!

## Distinctiveness and Complexity
_Is my project discting from the other projects in the course?_

List Companion uses some components introduced in previous CS50W projects (such as enabling users to register and log in) but the purpose of the app is it's own thing and clearly distinct from the other projects.

_Is my project more complex than the other projects in the course?_

Yes. Compared to my versions of the other projects in the course, List Companion has taken me definitely the most amount of time to plan and build. The numbers also support this as it has the most urlpatterns/routes (20), Models (4), Django Forms (6) and Javascript code (around 850 lines total). The models and their relations are more complicated as I've implemented in the previous projects. Styling and optimizing the user experience took it's time as well.

## Files
List of all the files for the web app **I created** or **modified** in some way:

### /capstone
* **README.md**
    * This file!
* **requirements.txt**
    * Requirements for the web app

### /capstone/capstone
* **settings.py**
    * Added 'list_companion' as an installed app
* **urls.py**
    * Updated urlspatterns to contain list_companion.urls

### /capstone/list_companion
* **admin.py**
    * Added all my models to admin site, also added filter_horizontal to List model's additional users (ManyToManyField)
* **forms.py**
    * 6 Django Forms (login, register, new list, change password, change email, delete account)
* **models.py**
    * 4 Django Models (user, list, list Item, log entry)
* **urls.py**
    * 20 urlspatterns used by the app
* **views.py**
    * 20 routes used by the app
    * Most of them are used to manipulate the database in various ways (create or delete lists, add or remove items from a list etc.)
    * I've tried to make sure in the back-end as well that only those users with permission can alter a particular list.

### /capstone/list_companion/static/list_companion
* **account.js**
    * Javascript used by Account Management Page ('/account')
    * Mostly just setting visibilities for various DOM elements when page is manipulated
* **list_companion_3.png**
    * Logo for the page! Thanks to my sister for these <3
* **list_companion_4.png**
    * Same as above!
* **login.js**
    * Javascript for the login page
    * Only few lines regarding the width of the elements on mobile vs. desktop devices
* **register.js**
    * Exactly same as above (could have probably used just one file...)
* **script.js**
    * Javascript used by the main page of the app (index, '/')
    * Bunch of eventlisteners and functions to make different requests to the server for manipulating contents and visibility of DOM elements
    * The biggest JS file on my app
* **styles.css**
    * Some custom style definitions

### /capstone/list_companion/templates
* **account.html**
    * Account Management page ('/account')
    * Extends main_template.html
* **index.html**
    * Main page of the app ('/')
    * Extends main_template.html
* **login_template.html**
    * Layout for login.html and register.html
* **login.html**
    * Login page ('/login')
    * Extends login_template.html
* **main_template.html**
    * Layout for index.html and account.html
    * Mostly contains the navbar
* **register.html**
    * Register page ('/register')
    * Extends login_template.html

## How to Run the Application
Assuming here that Python3 and pip are installed. For dev server:

1. Install requirements with command `pip install -r requirements.txt`
    * I don't recall installing any additional python packages for this project, but made requirements file just in case.
2. Change `base_url` variable for static files account.js (line 4) and script.js (line 4) if needed.
    * `base_url` is set to `'http://127.0.0.1:8000'` by default in both files.
3. Preliminary database is included in the files and migration should not be necessary.
    * If for some reason database file is not included, run command `python3 manage.py migrate` in same folder with `manage.py` file.
4. Move to folder with `manage.py` file and start the server with command `python3 manage.py runserver`

## Finally
Thanks for an amazing course! Especially thanks to Brian - the lectures were very clearly presented and enjoyable!

-Antti
