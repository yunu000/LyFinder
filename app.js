const express=require('express');
const app=express();
const port=5000
const bodyparser=require('body-parser')
// const sweet=require('sweetalert')
// const swal=sweet.swal();
// const popup = require('popups');
// Body Parser
app.use(bodyparser.urlencoded({extended:true}))

// Setting a static folder
app.use(express.static("public"))

// Setting view engine as ejs
app.set('view engine','ejs');

//sending otp
const accountSid = 'ACadffee35fa4c8487eb5bc63413bfee5e';
const authToken ='2eeaf66fd37711fe45e94c75687c1419';
const twilio=require('twilio')
const client1 = require('twilio')(accountSid, authToken);

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
// client.verify.services.create({friendlyName: 'LyFinder'})
//                       .then(service => console.log(service.sid));

// User InFormation
var user_name="";
var phoneN=0;
var user_email="";
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
	    
	res.sendFile(__dirname+"/homePage.html");
	});
})
// app.get("/message",(req,res)=>
// {
// 	res.sendFile(__dirname+"/message.html")
// })
// app.get("/verifystep1",(req,res)=>
// {
// 	res.sendFile(__dirname+"/verify_step_1.html");
// })
app.get("/profile",function(req,res)
{
	const query = `
	SELECT *
	FROM users
	WHERE email='${user_email}'
	`;
	client.query(query, (err, r) => {
	    if (err) {
	        console.error(err);
	        return;
	    }
		res.render("profile",{rows:r.rows})
	});
})
app.get("/post",function(req,res)
{
	res.sendFile(__dirname+"/post.html")
})
app.get("/login",function(req,res)
{
	res.render("logIn",{file1:"login",file2:"login",flag:false})
})
app.get("/signup",function(req,res)
{
	res.render("logIn",{file1:"login",file2:"signup"})
})
app.post("/login",function(req,res)
{
	console.log(req.body)
	const u_name=req.body.userName.toString();
	const query = `
	SELECT *
	FROM users
	WHERE email='${u_name}'
	`;
	client.query(query, (err, r) => {
	    if (err) {
	        console.error(err);
	        return;
	    }
	    // Storing User InFormation
	    user_name=r.rows[0].name;
	    user_email=r.rows[0].email;
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
				    
				res.render('index',{name:user_name,rows:r.rows});
			});		
		}
		else
		{
			res.render('login',{file1:'login',file2:'login',flag:true})
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
	// Storing User InFormation	
	user_name=name;

	// Query Firing
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

	res.sendFile(__dirname+"/verify_step_1.html");
});
app.post("/post",function(req,res)
{
	var currentdate = new Date(); 
	var date1=currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+currentdate.getDate();
	var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    console.log(datetime);
	const u_id=1;
	console.log(req.body);
	const bgroup=req.body.bgroup.toString();
	const address=req.body.address.toString();
	const unit=parseInt(req.body.unit.toString());
	const emergency=req.body.emergency.toString();
	console.log(bgroup,address,unit)
	const query = `
	INSERT INTO request (user_id,blood_type,unit,address,emergency)
	VALUES (${u_id},'${bgroup}',${unit},'${address}','${emergency}')
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
		res.render('index',{name:user_name,rows:r.rows})
	});
})
app.post("/verifystep1",function(req,res)
{
	phoneN=req.body.pno;
	client1.verify.services('VAb1c0c7be7d24a27845f4fbf0470a6052')
             .verifications
             .create({to: `+91${req.body.pno}`, channel: 'sms'})
             .then((data)=>
             {
             	res.sendFile(__dirname+"/verify_step_2.html")
             });
	res.sendFile(__dirname+"/verify_step_2.html")
})
app.post("/verifystep2",function(req,res)
{
	console.log(req.body.otp)
	client1.verify.services('VAb1c0c7be7d24a27845f4fbf0470a6052')
      .verificationChecks
      .create({to: `+91${phoneN}`, code: req.body.otp})
      .then(function(data){
      		console.log(data.status)
      		if(data.status=='approved')
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
				    
				res.render('index',{name:user_name,rows:r.rows});
				});
      		}	
      		// if(verification_check.status=='approved')
      		// 	res.send("verify")
      		// else
      		// 	res.send('not verified')
      	});
})
app.post("/profile_photo",function(req,res)
{
	console.log(req.body);
	// res.send("Hello");
})
app.listen(port)