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
	const query = `
	SELECT *
	FROM request
	`;
	client.query(query, (err, r) => {
	    if (err) {
	        console.error(err);
	        return;
	    }
	    
	res.render('index',{rows:r.rows});
	});
})
app.get("/post",function(req,res)
{
	res.sendFile(__dirname+"/post.html")
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
	   	if(r.rows[0].password==req.body.password.toString())
	   	{

			const query = `
			SELECT *
			FROM request
			`;
			client.query(query, (err, r) => {
			    if (err) {
			        console.error(err);
			        return;
			    }
			    
			res.render('index',{rows:r.rows});
			});
	   	}
		else
		{
			alert("Incorrect Password");
			res.render('login',{file1:'login',file2:'login'})
		}
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
app.post("/post",function(req,res)
{
	const u_id=1;
	console.log(req.body);
	const bgroup=req.body.bgroup.toString();
	const address=req.body.address.toString();
	const unit=parseInt(req.body.unit.toString());
	console.log(bgroup,address,unit)
	const query = `
	INSERT INTO request (user_id,blood_type,unit,address)
	VALUES (${u_id},'${bgroup}',${unit},'${address}')
	`;
	const query1= `
	SELECT *
	FROM request
	`;
	client.query(query, (err, r) => {
	    if (err){
	        console.error(err);
	        return;
	    }
	});
	client.query(query1, (err, r) => {
	    if (err){
	        console.error(err);
	        return;
	    }
		res.render('index',{rows:r.rows})
	});
})
app.listen(port)