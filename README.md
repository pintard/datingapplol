# **Dating App Demo**

This is a demo application of an SQL based react/node application, deployed on heroku. This is a multi-step form with a globally managed state. Including a simple API with one end point to check the current list of `users`.

The basic use case of this application is to fill every form field, and submit to a public api list consisting of users. Some predefined constraints are minimum age requirements, and simple form validation.

## **Usage**

To start, clone the git repository

```zsh
git clone https://github.com/pintard/datingapplol.git
```

Then `cd` to the **datingapplol** directory and download the project dependencies. Using npm,

```zsh
npm install
```

To demo the app in it's production form on **port 5000** of your local machine, first build the react client using,

```zsh
npm run build
```

Then run it using,

```zsh
npm run dev
```

To work concurrently on both the client and server-side application, run `npm run dev` in the top level directory, and `npm start` in the client directory, utilizing **port 3000** on your local machine.

## **PostgreSQL**

In order to utilize the full application you must be connected to a database. You can make changes to the locally connected database in the `/SQL/pgPool.js` file, where your server and database credentials can be configured.

You can create the table with the appropriate schemas by using the postgresql cli command,

```zsh
sudo -u postgres psql
```

if you have `psql` as an installed terminal package.

You can find a list of prewritten SQL scripts to construct the table in the SQL directory.
