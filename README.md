# The Canteen

### Video demo: <link>
### Website link: https://the-canteen.up.railway.app/

## Description: 
The canteen is a web application based on the Flask framework of Python! It is an application where you can make a reservation for the day you want to eat in your campus canteen. In this way, the canteen can be more organised and produce less food waste. The application is based on principal pages: **Index**, **Reservation**, **Payment**, **Personal Info**, and **History**. It also contains a user registration page and a login page. In fact, a user can log in or register and get some default balance. They can reserve a day in the reservation page, cancel the reservation, update their personal information, and recharge their account balance. Also, users can see the list of days they have eaten on the history page. 

For this project i had to extend my knowledge in SQLAlchelyORM, more intermidiate Javascript (async await concept) and Bootstrap. 

## Installation
1. Clone the repository or download zip file
2. Create a virtual environment
3. Install dependencies with `pip install -r requirements.txt`
4. Run `flask run --debug`

> [!NOTE]
> Project require an internet connection to be able to get bootstrap icons. 

## Tech stack 
- **HTML, CSS**
- **Bootstrap 5.3.8**
- **Bootstrap Icons**
- **Vanilla JS**
- **Python Flask**
- **SQLite3**, and **SQLAlchemy ORM**

## Folders and Files
Here is the list of the most important files of the application.\
Each HTML page has its own JS file for interactive functionality. 

### static
This folder contains all CSS, JS, and images of the project.
- Bootstrap is imported in `sass/main.scss`, where the main theme color is customized and some other modifications are applied as well.
- **style.css** is used to add some custom styles and animations to the application. 
- **calender.css** is used to style the calendar on the **reservation** page.

### templates
Contains all HTML files of this website. 

### helpers.py
Contains a helper function called `login_required()`, which prevents users from accessing all routes without login, except the login and register routes.

### models.py 
In this file, I defined all SQLAlchemyORM tables, and then those tables are imported in **app.py**.

### cantine.db
This is the database file for SQLite3 which contains all data of the web application.
It contains 4 tables: 
- users: contains all user data. 
- tier_price: contains all tier prices.
- reservation: contains all reserved day lists by all users. 
- recharge_code: contains all recharge codes.

### requirements.txt
Contains all required files needed for the backend.

### app.py
Main back-end file of the application which contains all core functionalities and routes.
The DB engine is initialized in this file. The database is set to the filesystem. 
Flask sessions are also set to the filesystem.

Each session expires after 30 minutes. The user must re-login to continue using the application. 

This file contains 7 main routes which represent 7 HTML pages.
`/`: **index.html**  
`/login`: **login.html**  
`/register`: **register.html**  
`/reservation`: **reservation.html**  
`/payments`: **payments.html**  
`/personal_info`: **personal_info.html**  
`/history`: **history.html**

There are 2 sub-routes which are used by `reservation.html`:
`/reservation_data`: get all reserved dates to the front-end  
`/remove_reservation`: remove a specific reserved date requested by the user. 

### layout.html and layout.js
- **layout.html** contains the navbar of the website and all header files. `layout.html` is extended in every other HTML file. 
- The **navbar** contains the title of the application, nav items, username, last login time, and a logout button. If there is no user logged in, it shows the campus name instead of the username and a login button.
- **layout.js** contains toast message functionality and a function to make the navbar more interactive.

## Routes

### /index
This route is the main page of the website. It shows up when the user logs in successfully or registers to the application.
- Shows user information: Name, Class, Tier, Balance. 
- Shows four cards (reservation, payments, personal info, history) which contain a button and route names. 

### /login
The login page contains 2 inputs: **username** and **password**. 
Input data is collected by JavaScript and sent to the backend using the JS Fetch function.
Once the back-end validation is done, a new session is created for the user.

### /register
This page contains a register form where the user needs to enter their information, email, and choose a username and password. 
There is some validation on the front end and also on the back end after fetching all data via JS.
Once validation is done, all data are saved to the database table.

### /reservation    
This is the most important route of the application. It shows an interactive calendar and a list of reserved days.
- Users can click and reserve a day with confirmation in a modal. 
- Users can remove a reservation.
- Users can see all reserved days as a list.
- The calendar changes color based on unreserved days, reserved days, and passed days. 

Data is fetched to the back end and all reserved day lists are saved in the reservation table in **cantine.db**.
Removing a reservation is managed by a sub-route called `/remove_reservation`.
Once any change happens, the calendar and list reload to get the new reserved list, which is managed by another route called `/reservation_data`.

### /payments
This page is used to let users recharge their account balance. 16-digit recharge codes are already in the database table `recharge_code`. Users are supposed to know or get a code and then enter it in the input field. If the code is correct, the account gets the associated balance from the recharge code.

### /personal_info
This page shows users their personal information and lets them modify it. For now, the app only allows users to modify their email.

### /history
This page shows users all days they have eaten in the cantine. If a user reserved a day, did not cancel it, and the day is a passed day, that means the app counts that reserved day as a day the user has already eaten in the cantine.