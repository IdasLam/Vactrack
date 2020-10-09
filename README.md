# Vacktrack

This project was developed for the customer in the course PA1414 at Blekinge Institute of Technology. The web application was ment to be solving the problem where a family should be able to log and keep track of which member has taken which vaccine whilst also being able to get notifications when a vaccination is due.

## Prerequisites
Running this project will require you to have `git`, `docker` and `docker-compose` on your system. You will have to register a web app on `Firebase` before seting up the application. This web application will also require `Cloud Firestore`. Which should be configured so third party reads and writes is allowed.

The Gmail account used to send out emails must have been configured according to this [article](https://support.google.com/accounts/answer/6010255?hl=en).

The web application is defaulted to port `80`, which needs to be available.

Your `Cloud Firestore` database must have `articles`, with atleast 2 documents, and `family` collections. The collection `articles` must have the documents in this format, or it will not work as intended:

```javascript
{
    link: "https://www.lipsum.com/",
    title: "Your title",
    text: "Your text"
}
```

## Setup
Follow this setup guide to make sure that the application can run correctly. Please make sure to clone the project and also make sure that your terminal is in the folder `vactrack` before you start.

1. Run `bash init.bash` in your terminal and follow the instructions given.
2. Generate a private key file according to this [guide](https://firebase.google.com/docs/admin/setup#initialize-sdk).
3. Rename the generated json file to `serviceAccountKey` and procceed to add it to `vactrack/server`.
4. Run `docker-compose up` in your terminal
5. Go to [http://localhost/](http://localhost/).

Now the web aplication should be setup and running.

### Note

#### Port
If you like to change the default port in `docker-compose.yml`. Read more about how to change the port [here](https://docs.docker.com/compose/compose-file/#ports).

#### Email notification system
The email system will run once started and then check every hour if any more mails should be sent out.

## Run the web application in developer mode
If you want to run the web application mode then access docker-compose.yml and remove `.prod` from the docker files and under server add a volume `./server:/server`. Then run `docker-compose up`.

### Without docker
In both client and server run `npm i`, in the client run `npm run start` whilst in the server run `npm run dev`.