
const accountSid = 'ACadffee35fa4c8487eb5bc63413bfee5e';
const authToken ='2eeaf66fd37711fe45e94c75687c1419';
const twilio=require('twilio')
const client = require('twilio')(accountSid, authToken);
 client.verify.services.create({friendlyName: 'LyFinder'})
                      .then(service => console.log(service.sid));
      //<!-- <%var e=parseInt(rows[i].emergency) %> -->                  
      // <% switch(e) {%>
					 //    	<% case 0 : %>
					 //    		<h4 class="card-title">Emergency : Extreme</h4>	
					 //    		<% break%>
					 //    	<% case 1 : %>
					 //    		<h4 class="card-title">Emergency : Moderate</h4>	
					 //    		<% break%>
					 //    	<% case 2 : %>
					 //    		<h4 class="card-title">Emergency : Low</h4>	
					 //    		<% break%>
					 //    	<% default :%>
					 //    		<h4 class="card-title">Emergency : Moderate</h4>	
					 //    		<% break%>
						// <%}%> 