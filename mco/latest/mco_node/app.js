
/////////                Requiring modules         /////////
const express = require('express');
const app = express();
const fs = require("fs");
const dates = require("./dates.js");
const sqlite3 = require('sqlite3').verbose();


/*   custom modules
const names = require("./name.js");

console.log(names.name1)
console.log(names.pets.pet1)
*/





///////// For parsing post requests  
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


//Defining a public directory
app.use('/public', express.static('public'));  




// OR
/*
 Create application/x-www-form-urlencoded parser 
//var urlencodedParser = bodyParser.urlencoded({ extended: false })
 Then Add it as a 2nd parameter when defining a post page

/////////                                           /////////*/



 
  


// Handling '/' request
app.get('/', (req, res) => {
    var dataToBESent ="";
    dataToBESent += '<h2>Hello from Express.js server!!</h2>';
    dataToBESent += '<title>Main</title>';
     
    res.send(dataToBESent);// can be used once

    console.log("Serving one request with these headers: \n"+JSON.stringify(req.query));
   
});
app.get('/main', function(req, res) {
    res.sendFile('views/index.html', {root: __dirname })
});


app.get('/Data', function(req, res) {
    const content = fs.readFileSync("views/p1.html");
    const content2 = fs.readFileSync("views/p2.html");
    var db = new sqlite3.Database('database.sqlite');


    interval = req.query.interval;
    const intervalArr = interval.split(" - ");

   

    let st = Math.floor(new Date(intervalArr[0]).getTime() / 1000);
    console.log(st)

    let st2 = Math.floor(new Date(intervalArr[1]).getTime() / 1000);
    console.log(st2)




    start = st;
    end = st2;

    console.log("data request");

    let sql = "SELECT * from Generator_state where timestamp >= "+start+" and timestamp <= "+end;

    
    let sql2 = "SELECT * from voltage where timestamp >= "+start+" and timestamp <= "+end; 
 let p1 = "{x: [";
   let p2 = "],y:[ ";
   let p3 = "],marker: {color: 'rgb(255, 0, 0)',size: 10},type: 'scatter'}];";
   let p3_2 = "],   marker: {color: 'rgb(0, 0, 255)',size: 10,line: {color: 'rgb(0, 0, 0)',width: 0}} ,mode:'markers',type: 'scatter'}];"


    let data ="";
    var x="",y="",t="";
    var x2="",y2="",t2="";
db.all(sql2, [], (err, rows) => {

    if (err) {
                console.log(err) ;
    }else{
        
                rows.forEach((row) => {
                   
                    console.log(row);
                x+="\'"+dates.unixToDate(row.timestamp)+"\'," ;
               // console.log(dates.unixToDate(row.timestamp));
                y+=""+row.voltage_val+",";
              //  res.send(rows);
              
    });





    db.all(sql, [], (err, rows) => {

        if (err) {
                    console.log(err) ;
        }else{
            
                    rows.forEach((row) => {
                       
                        console.log(row);
                    x2+="\'"+dates.unixToDate(row.timestamp)+"\'," ;
                   // console.log(dates.unixToDate(row.timestamp));
                    y2+=""+row.state_change+",";
                  //  res.send(rows);
                  
        });
    
       console.log(x)
       data+=(" var data = ["+p1+x+p2+y+p3);
       data+="\n\n";
       data+=(" var data2 = ["+p1+x2+p2+y2+p3_2 );

let page= content+data+content2;
res.send(page); 
        
        }
        });








    

    
    }
    });
   
    db.close();

   });
  


















   app.get('/addChange', function(req, res) {

    var db = new sqlite3.Database('database.sqlite');
    var x;

  
let sql = "INSERT INTO Generator_state (state_change,timestamp) VALUES("+req.query.state+",strftime('%s','now'))";

    console.log("state change recoding request")



db.all(sql, [], (err, rows) => {

if (err) {
            console.log(err) ;
}else{
            rows.forEach((row) => {
            console.log(row.name);
            
});
  res.send("request done");          
}
});



    

   });




















   app.get('/addChangeVoltage', function(req, res) {

    var db = new sqlite3.Database('database.sqlite');
    var x;

  
let sql = "INSERT INTO voltage (voltage_val,timestamp) VALUES("+req.query.voltage+",strftime('%s','now'))";

    console.log("voltage recording request");
    console.log("V="+req.query.voltage);


db.all(sql, [], (err, rows) => {

if (err) {
            console.log(err) ;
            res.send("there was an error!"); 
}else{
 
res.send("request done");      
}
});



    

   });


















   
   app.get('/lastStateChange', function(req, res) {
    

    var db = new sqlite3.Database('database.sqlite');
   

  
let sql = "SELECT * from Generator_state where timestamp =(select max(timestamp) from Generator_state)";
db.all(sql, [], (err, rows) => {

    if (err) {
                console.log(err) ;
    }else{
                rows.forEach((row) => {
                console.log(rows);
                res.send(rows);
    });
            
    }
   
    });

    

   })

  





















































// Server setup
var server = app.listen(8080,'0.0.0.0', () => {
    var host = server.address().address;
   var port = server.address().port;
    console.log('server listening on port 8080');
});


