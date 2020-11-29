const express=require('express');
const app=express();
const port=5000
const bodyparser=require('body-parser')

// Body Parser
app.use(bodyparser.urlencoded({extended:true}))

// Setting a static folder
app.use(express.static("public"))

// Setting view engine as ejs
app.set('view engine','ejs');

// Connecting postgres
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'blood_donor',
    password: '@08Yashpandey',
    port: 5432,
});
client.connect(function(){
		console.log("Connected");
});

// Handling various routes

app.get("/",function(req,res)
{
	res.render('index');
})
app.get("/:file",function(req,res)
{
	res.render("login",{file1:"login",file2:req.params.file})
})
app.post("/login",function(req,res)
{
	console.log(req.body)
	const u_name=req.body.userName.toString();
	const query = `
	SELECT password
	FROM users
	WHERE email='${u_name}'
	`;
	client.query(query, (err, r) => {
	    if (err) {
	        console.error(err);
	        return;
	    }
	    console.log(r.rows[0].password)
	    console.log(req.body.password.toString())
	   	if(r.rows[0].password==req.body.password.toString())
			res.send(html='<h1>Logged In</h1>');
		else
			res.send(html='<h1>Incorrect Password</h1>');
	});
})
app.post("/signup",function(req,res)
{
	console.log(req.body)
	const name=req.body.name.toString();
	const age=parseInt(req.body.age.toString());
	const email=req.body.email.toString();
	const bgroup=req.body.bgroup.toString();
	const address=req.body.address.toString();
	const pno=parseInt(req.body.pno.toString());
	const pass=req.body.pass.toString();
	const cpass=req.body.cpass.toString();
	console.log(name,age,email,bgroup,address,pno,pass)	
	const query = `
	INSERT INTO users (name,age,email,phone_no,blood_group,address,password)
	VALUES ('${name}',${age},'${email}',${pno},'${bgroup}','${address}','${pass}')
	`;
	const query1= `
	SELECT *
	FROM users
	`;
	client.query(query, (err, r) => {
	    if (err){
	        console.error(err);
	        return;
	    }
	});
	res.render('index')
});
app.listen(port)