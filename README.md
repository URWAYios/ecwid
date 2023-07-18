# Adding URWAY as a Payment Provider in ECWID

- To add URWAY plugin in eciwd we will have to get access to merchant account
- after that you will have to do  changes in the repo using
  1. cloning the repo
  ```
  git clone https://github.com/URWAYios/ecwid.git
  ```
  2.  after cloning the repo go to env file and add the customer app credentials
      ```
      CLIENT_KEY= you will find in ecwid account settings
      CLIENT_SECRET= you will find in ecwid account settings
      ```
  3.  also you will go to the file called funciton.js
      ```
      app-id = same as the client_key
      ```
- now need to host the app in any hosting privder.
- after that need to contact ecwid support team to add urway for this store
- Need to mention the below in the email
  - url that we want the data to be sent to from eciwd side
    - it will be always like https://domainName/v1/urway/ecwid
  - the main url which is https://domainName
