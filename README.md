# Vactrack

This project was developed for a customer in the course PA1414 at Blekinge Institute of Technology in 2020. The web application was meant to solve the problem where a family should be able to log and keep track of which family member has taken which vaccine whilst also being able to an email notification when a vaccination is due.

## Prerequisites

### System
Running this project will require you to have `docker` and `docker-compose` on your system.


### Firebase
This project requires that you have created a project and register an app on `Firebase`. To create a project and register app follow step 1 and 2 in this [guide](https://firebase.google.com/docs/web/setup).

Your `Firebase project` must have the [Google sign in enabled](https://firebase.google.com/docs/auth/web/google-signin), otherwise login will not work.

This application will also require a created database in `Cloud Firestore`.  Follow this [guide](https://firebase.google.com/docs/firestore/quickstart) to setup a database in Cloud Firestore. When seting up the database make sure to update the `rules` to the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Other

The Gmail account used to send out emails must have been configured according to this [article](https://support.google.com/accounts/answer/6010255?hl=en).

The web application is defaulted to port `80`, which needs to be available.

In your `Cloud Firestore` the collection `articles` must have the documents in this format, or it will not work as intended:

```javascript
{
    link: "https://www.lipsum.com/",
    title: "Your title",
    text: "Your text"
}
```

## Setup
Before starting make sure you have everything setup under Prerequisites.

Follow this setup guide to make sure that the application can run correctly. Please make sure to clone the project and also make sure that your terminal is in the folder `vactrack` before you start.

1. Run `bash init.bash` in your terminal and follow the instructions carefully.
2. Generate a private key file according to this [guide](https://firebase.google.com/docs/admin/setup#initialize-sdk).
3. Rename the generated json file to `serviceAccountKey` and procceed to add it to `vactrack/server`.
4. Run `docker-compose up` in your terminal
5. Go to [http://localhost/](http://localhost/).

Along with docker-compose up the database will get initialised in `Cloud Firestore`.
Now the web aplication should be setup and running.

### Notes

#### Port
If you like to change the default port in `docker-compose.yml`. Read more about how to change the port [here](https://docs.docker.com/compose/compose-file/#ports).

#### Email notification system
The email system will run once started and then check every hour if any more mails should be sent out.

## Run the web application in developer mode
If you want to run the web application mode then access docker-compose.yml and remove `.prod` from the docker files and under server add a volume `./server:/server`. Then run `docker-compose up`.

### Without docker
In both client and server run `npm i`, in the client run `npm run start` whilst in the server run `npm run dev`.

## Contact
Project was developed by Ida Lam. Reatch me at lammetida@gmail.com.