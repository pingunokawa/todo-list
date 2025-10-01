# To Do List
This is a technical test aims to create an end-to-end web application that allows the user to read, create and update a to-do list of duties of any kind.
Complex frameworks, ORM and frontend state managment solution is not allowed in this project.
### Quick start guide
Install Docker Desktop
Clone the application source code
Prepare the env file by copying the below content to /config/.env and replace "YOUROWNUSERNAME" & "YOUROWNSECRET"
```
DB_HOST=postgres
DB_PORT='5432'
DB_USER=YOUROWNUSERNAME
DB_PASSWORD="YOUROWNSECRET"
DB_NAME=postgres
REACT_APP_NODE_BACKEND_URI=http://localhost:8000

```

Start the appliication by Command
```
docker compose -f docker-compose.yml --env-file config/.env up -d
```

Stop the application by Command
```
docker compose -f docker-compose.yml --env-file config/.env stop
```

Helper scripts for bash is provided in scripts for starting and stopping the application

Todo-list Frontend: http://localhost:3000  
Todo-list api-doc: http://localhost:8000/api-docs

### Testing
Frontend Test:
```
cd frontend
npm ci -s
npm run test
```

Frontend Coverage:
```
cd frontend
npm ci -s
npm run coverage
```

Backend Test:
```
cd backend
npm ci -s
npm run test
```

Backend Coverage:
```
npm ci -s
cd backend
npm run coverage
```

### todo-list user guide
*<small>Viewing Duties: Upon entering the main screen, the application will display all existing duties.</small>*
![Viewing Duties](/frontend/public/list.png) 

*<small>Creating a Duty: To create a new duty in the todo-list, type the duty into the input box at the top of the screen and press the “ADD” button on the right.</small>*
![Creating a Duty](/frontend/public/add.png) 

*<small>Updating a Duty: To update a duty in the todo-list, click the “EDIT” button corresponding to the duty you wish to change.</small>*
![Edit a Duty](/frontend/public/edit1.png) 

*<small>Modify the duty as needed and press the “OK” button to save your changes. The updated duty will immediately appear in the todo-list on the main screen.</small>*
![Save a Duty](/frontend/public/edit2.png)

*<small>Deleting a Duty: To delete a duty, click the “Delete” button corresponding to the duty you wish to remove. The duty will be immediately removed from the todo-list.</small>*
![Deleting a Duty](/frontend/public/delete.png) 

*<small>Error handling Screen: To generate an error handling screen, stop backend instance and try add a duty on frontend. Error will be displayed.</small>*
![Error handling Screen](/frontend/public/error.png) 
