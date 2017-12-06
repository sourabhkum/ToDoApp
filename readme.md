<h1>ToDo Application</h1>
<blockquote>
<p>User Authentication using JWT JSON WebToken in Node.js using Express, Used Joi for user input validation, mongoose for ORM</p>
</blockquote>
<h1>Installation</h1>
<code>npm install</code>
<h1>Setup</h1>
<p>Create .env file on root directory and add the below code</p>
<pre>MONGO_URI = mongodb://localhost:27017/TodoApp
     PORT = 3000
     NODE_ENV = development</pre>
<h1>Start an app</h2>
<code>npm start</code>
<h3>API Available</h3>
<h6>Register user</h6>
<pre>
<code>
http://127.0.0.1:3000/user
{   "name":"Sourabh",
  "mobile":9709317392,
  "email":"sourabh@gmail.com",
  "password":"123456"
}
</code>
</pre>
<h6>Login user</h6>
<pre>
<code>
http://127.0.0.1:3000/login
{
  "email":"sourabh@gmail.com",
  "password":"123456"
}
</code>
</pre>
<h6>Create To Do</h6>
<pre><code>
x-auth:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTI3OTdmMTI4MzQ5ODE4YjBjMGMyOGMiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTEyNTQ0MzM1fQ.U3ewSkICu9cr5lBqsooS78aElAQpFFdF2Vea4IxlxpY</code></pre>
<pre>
<code>
http://127.0.0.1:3000/todos
{
  "text":"Go to Market"
}
</code>
</pre>
