Build:  
npm run tsc

Run:  
node build/app.js

Tests:  
npm run test

Start database:  
docker run --name kuvarastitdb -e POSTGRES_PASSWORD=kuvarastit -d -p 5432:5432 -v \$(pwd)/data:/var/lib/postgresql/data postgres

References:  
https://medium.com/javascript-in-plain-english/typescript-with-node-and-express-js-why-when-and-how-eb6bc73edd5d

https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai#toc-mocha-testing-environment
