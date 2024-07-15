## Prerequisites
- You have to have Node 20 installed on your machine
- You need to have Docker installed on your machine

## Installation
1. Start a postgres database, that the app can connect to. (Look at typeOrmConfig.ts)
2. Open a terminal and navigate to project root "junior_challenge"
3. run `npm install`
4. run `npm run build`
5. run `npm run start:prod` (You should now see a new table in the database)
6. In bears.sql is some data you can populate this table with
7. You can now try out the app in your browser
8. You can run the test with npm run test

## Tasks
1. Bears can have one or multiple colors. Create an entity "Color" with a ManyToMany relationship to Bear.
   - First change the code, then run `npm run migration:generate WhateverName`
   - A New typeORM migration will be placed in the root folder. You have to put it in src/persistence/migrations
   - When you run the app, the new migration will be run against the database.
   - You have to populate the new tables with data by hand (You can write an SQL script)
2. Create an endpoint that lets you search for bears by their colors.
3. Write a test for your new endpoint (extend bear.controller.spec.ts).