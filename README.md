## About:
The intial version of a web application that allows users to create new accounts in order to buy and sell records. The application uses microservices architecture to seperate the system into individual services (authenication, orders, payments, etc.) each with their own database. All services communicate through a message-oriented middleware. A set of configuration files are included to build and deploy the application into a Kubernetes cluster. 

## What was used:
- TypeScript for type safety
- Next.js for client-side/UI
- NATS Streaming Server for event bus
- Express for route handling and middleware
- Stripe API for payment transactions
- Mongoose and MongoDB for database structuring/access
- Jest for unit testing
- Docker for creating service image files
- Kubernetes for container management 
