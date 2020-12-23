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
const accountSid = 'AC249b5e7464048c9550a888beadc7f679';
const authToken ='0843b8ba652a988a064ef372a8d7aab0';
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
// client1.verify.services.create({friendlyName: 'LyFinder'})
//                       .then(service => console.log(service.sid));

// User InFormation
var user_name="";
var phoneN=0;
var user_email="";
var user_id="";
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
app.get("/index",(req,res)=>
{
	const query = `
	select * from request order by emergency,date desc
	`;
	client.query(query, (err, r) => {
		if (err) {
			console.error(err);
			return;
		}
				    
		res.render('index',{name:user_name,rows:r.rows});
	});
})
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
	    user_id=r.rows[0].user_id;
	    const query1= `
		SELECT *
		FROM request
		WHERE user_id='${user_id}'
		`;
		client.query(query1, (err, rs) => {
		    if (err) {
		        console.error(err);
		        return;
		    }
	    console.log(r.rows,"\n",rs.rows)
		res.render("profile",{rows:r.rows,row:rs.rows})
		});
	});
})
app.get("/bbank",(req,res)=>
{
	const query1= `
		SELECT *
		FROM blood_bank
		`;
		client.query(query1, (err, rs) => {
		    if (err) {
		        console.error(err);
		        return;
		    }
		res.render("bloodbank",{rows:rs.rows,name:user_name})
		});
})
app.get("/bloodbank:file",(req,res)=>
{
	var id=req.params.file;
	const query1= `
		SELECT *
		FROM blood_stock
		where bb_id=${id}
		`;
		client.query(query1, (err, rs) => {
		    if (err) {
		        console.error(err);
		        return;
		    }
		res.render("blood_stock",{rows:rs.rows})
		});
})
app.get("/respond",(req,res)=>
{
	res.render("respond");
})
app.get("/post",function(req,res)
{
	res.render("post",{name:user_name})
})
app.get("/login",function(req,res)
{
	res.render("logIn",{file1:"login",file2:"login",flag:false})
})
app.get("/signup",function(req,res)
{
	res.render("logIn",{file1:"login",file2:"signup",flag:false})
})
app.post("/login",function(req,res)
{
	// console.log(req.body)
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
	    user_id=r.rows[0].user_id;
	    phoneN=r.rows[0].phone_no;
	    console.log(user_name,user_email,user_id,phoneN)
		if(r.rows[0].password==req.body.password.toString())
		{

			const query = `
			select * from request order by emergency,date desc
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
	user_email=email;
	// Query Firing
	const query = `
	INSERT INTO users (name,age,email,phone_no,blood_group,address,password)
	VALUES ('${name}',${age},'${email}',${pno},'${bgroup}','${address}','${pass}')
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
	// var currentdate = new Date(); 
	// var date1=currentdate.getFullYear()+"-"+(currentdate.getMonth()+1)+"-"+currentdate.getDate();
	// var datetime = "Last Sync: " + currentdate.getDate() + "/"
 //                + (currentdate.getMonth()+1)  + "/" 
 //                + currentdate.getFullYear() + " @ "  
 //                + currentdate.getHours() + ":"  
 //                + currentdate.getMinutes() + ":" 
 //                + currentdate.getSeconds();
 //    console.log(datetime);
	// const query2= `
	// SELECT user_id 
	// FROM users
	// WHERE email=${user_email}`;
	// client.query(query, (err, r) => {
	//     if (err){
	//         console.error(err);
	//         return;
	//     }
	// 	user_id=r.rows[0].user_id;
	// });
	const query3= `
	SELECT *
	FROM users
	WHERE email='${user_email}'
	`;
	client.query(query3, (err, r) => {
	    if (err) {
	        console.error(err);
	        return;
	    }
	    user_id=r.rows[0].user_id;
	});
	console.log(req.body);
	const bgroup=req.body.bgroup.toString();
	const address=req.body.address.toString();
	const unit=parseInt(req.body.unit.toString());
	const patientName=req.body.patientName.toString();
	const location=req.body.location.toString()
	const emergency=parseInt(req.body.emergency.toString());
	console.log(patientName,emergency)
	const query = `
	INSERT INTO request (user_id,blood_type,unit,address,emergency)
	VALUES (${user_id},'${bgroup}',${unit},'${address}','${emergency}')
	`;
	const query1= `
	select * from request order by emergency,date desc
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
	client1.verify.services('VA59a77b96265b6c5a00ae7daf038e8f7e')
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
	client1.verify.services('VA59a77b96265b6c5a00ae7daf038e8f7e')
      .verificationChecks
      .create({to: `+91${phoneN}`, code: req.body.otp})
      .then(function(data){
      		console.log(data.status)
      		if(data.status=='approved')
      		{
      			const query = `
				select * from request order by emergency,date desc
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