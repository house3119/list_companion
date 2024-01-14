# List Companion
### Video Demo: [https://youtu.be/ZD-UQR2fBFM](https://youtu.be/ZD-UQR2fBFM)

## Table of Contents
* [Background](#background)
* [What is List Companion?](#what_is)
* [Design](#design)
* [Distinctiveness and Complexity](#distinctiveness)
* [How to Run](#how_to_run)
* [File Descriptions](#file_descriptions)

<a id="background"></a>
## Background
Me and my friends/family have been using a mobile app called Listonic to share shopping lists and other lists. Overall, the app is pretty nice and handy but I've felt it could be improved in some areas. This gave me an idea for this final project.

After everything I had learned from this course, I felt I had the means to try and create a similar note list app. This seemed like a project of appropriate size for the final project - complex enough, but not too involved.

<a id="what_is"></a>
## What is List Companion?
List Companion is a web application to create and share note lists with your friends and family.

To begin, the user needs to register and create an account. At the moment, this includes creating a username and inputting an email address. Username must be unique. The inputted email address is not used in any way at the moment.

After creating an account, the user can log in. This will show the user the main page (index) of the web app. Here the user can see his/her own lists and those lists other users have shared with him/her. Clicking on a list will show the user view for that individual list. On the top-right-hand-corner of each list card, there is a button to delete the list or unsubscribe from the list (depending if the user owns the list or is added as a user by someone else). From the index page, the user can also create a new list by giving it a name and optionally, a description.

Clicking on a list card will show the user view for the individual list, which includes:
* All the items on the list and options to add and remove items. User can also mark items as _Done_.
* Users currently on the list and options to add and remove users (if the user is the one who created/owns the list).
* Log of actions happened on the list (add item, remove item etc.) and who made them.

The nav bar includes the name of the web app on the left-hand-side. Clicking this will take the user to the index page. Clicking the _Menu_ link on the right-hand-side of the nav bar will bring up a small menu of links:
* **Home** takes the user back to the index page.
* **Account** takes the user to the account management page.
* **Log out** logs the user out.

In the account management page the user can check his/her username and email address. There are also options to change password, change email address and to delete account.

<a id="design"></a>
## Design
List Companion functions primarily as a single-page web application using Javascript (JS) to fetch information from the server and then update the page contents. Django was used as the framework for the back-end.

The application is mobile-responsive as I planned it from the start to be used mostly with mobile devices. Despite this, I tried to make sure that the app was intuitive and easy-to-use with a desktop as well.

Django Models and Sqlite3 are used as the database for the app. List Companion uses 4 models:
* **User** is used to store information about users. This utilizes **AbstractUser** provided by Django.
* **List** is used to store the lists. Each list has the owner/creator as a Foreign Key and the possible other users are included in a ManyToManyField.
* **List_item** is used to store each individual list item. Each item is linked to a corresponding **List** using a Foreign Key.
* **Log_entry** is used to store the log information. This includes the action happened (adding, deleting etc.) and also the corresponding **List** and **User** as a Foreign Keys. Corresponding **List_item** is included as a CharField (instead of a Foregn Key) to avoid deletion of related **Log_entries** when a **List_item** it deleted.

Bootstrap CSS and JS are used for styling and some functionalities.

<a id="distinctiveness"></a>
## Distinctiveness and Complexity
The main purpose of this app is on my opinion, clearly different from the other projects in the course. List Companion uses some similar concepts introduced in the previous projects (such as enabling the users to register and log in) but these are all implemented from the scratch. Also, concepts like these are very common to almost all web apps, so I don't think they take away from distinctiveness of the app.

The single-page design of the app is fairly complex and required quite a bit of thinking on how to implement. The models and their relations are also more complicated than I've implemented in the previous CS50 Web projects. Styling the pages and optimizing the user experience took quite a bit of time and effort as well.

Also, compared to my versions of the other projects in the course, List Companion has taken me definitely the most amount of time to plan and build. Comparing to my versions of the previous projects, it also has most urlpatterns/routes (20), Django Forms (6) and JS code (around 850 lines total).

<a id="how_to_run"></a>
## How to Run
Assuming here that Python3 and pip are installed. For dev server:

1. Install requirements with command `pip install -r requirements.txt`
    * I don't recall installing any additional python packages for this project, but made requirements file just in case.
2. Change `base_url` variable for static files account.js (line 4) and script.js (line 4) if needed.
    * `base_url` is set to `'http://127.0.0.1:8000'` by default in both files.
3. Preliminary database is included in the files and migration should not be necessary.
    * If for some reason database file is not included, run command `python3 manage.py migrate` in same folder with `manage.py` file.
4. Move to folder with `manage.py` file and start the server with command `python3 manage.py runserver`

<a id="file_descriptions"></a>
## File Descriptions
Here I go through all the files for the web app **I created** or **modified** in some way. I organized the files by location as indicated in the subtitles.

### /capstone
* ```README.md``` contains documentation for the web app (this file).
* ```requirements.txt``` contains the requirements for the app.

### /capstone/capstone
* ```settings.py``` contains the settings for the Django project. The only change I made was to add **list_companion** as an installed app.
* In ```urls.py``` I updated urlspatterns to contain **list_companion.urls**.

### /capstone/list_companion
* In ```admin.py``` I added all my models to admin site, I also added **filter_horizontal** to **List** model's additional users (ManyToManyField).
* ```forms.py``` contains 6 custom Django forms (login_form, register_form, new_list, change_password_form, change_email_form and delete_account_form).
* ```models.py``` contains the privously described 4 Django models (User, List, List_item, Log_entry).
* ```urls.py``` contains the 20 urlspatterns used by the app.
* ```views.py``` contains code for the routes. Most of them are used to manipulate the database in various ways (create or delete lists, add or remove items from a list etc.) I've tried to make sure that only those users with permission can alter a particular list.

### /capstone/list_companion/static/list_companion
* All the static files used by the app are contained here.
* ```account.js``` contains the JS used by Account Management Page (/account). This includes mostly setting visibilities for various DOM elements when page is manipulated.
* ```list_companion_3.png``` and ```list_companion_4.png``` are the logos for the app. These were kindly provided by my sister.
* ```login.js``` contains the JS for the login page. Only few lines regarding the width of the elements on mobile vs. desktop devices.
* ```register.js``` contains the JS for the register page. The contents are pretty much identical to ```login.js```.
* ```script.js``` contains the JS used by the main page of the app (index, '/'). This includes a bunch of eventlisteners and functions to make different requests to the server for manipulating contents and visibility of DOM elements. By far the largest JS file of the app.
* Finally, ```styles.css``` contains some custom style definitions.

### /capstone/list_companion/templates
* This folder contains all the html templates used by the app.
* ```account.html``` contains the account Management page (/account) and ```index.html``` contains the main page of the app (index, '/'). These both extend the ```main_template.html```, which in addition to **head**, contains mostly just the nav bar.
* ```login.html``` contains the login page (/login) and ```register.html``` contains the registeration page (/register). These two extend the ```login_template.html```.

