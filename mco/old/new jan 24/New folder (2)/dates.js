
let unixToDate = (unix_timestamp)=>{
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
var date = new Date(unix_timestamp * 1000);


var year = date.getFullYear();
// Minutes part from the timestamp
var month = 1+ date.getMonth();
// Seconds part from the timestamp
var day = date.getDate();



// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = year +"-"+ month +"-"+ day+" "+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

return formattedTime;

/*
return date.toLocaleDateString("en-Uk")*/
}

module.exports = {
    unixToDate
}