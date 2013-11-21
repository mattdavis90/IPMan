IPMan
=====

IPMan allows a user to manage IP leases via a simple web interface.

Running IPMan
-------

IPMan requires the following packages;

- Node.js (with Express.js and MongoDB)
- MongoDB

MongoDB must be setup to use user authentication. The following will create a root user and also a user for the IPMan database. The ipMan database, username, and password are all user selectable.

    $ mongo
    > use admin
    > db.addUser("root", "password")
    > db.auth("root", "password")
    > use ipMan
    > db.addUser("ipMan", "password")

Edit the ipMan configuration to reflect your setup.

    exports.config = {
      "mongoUser": "ipMan",
      "mongoPwd" : "password",
      "mongoDB"  : "ipMan"
    }

Add root user account to the mongoDB.
Edit the addUser.js file.

    ...
    var password = "password";
    var name = "Root";
    ...

Add the user.

    $ node addUser.js

Run the server in node.

    $ node server.js