const express = require('express');
const redis = require('redis');
const fetch = require('node-fetch');
const {parseData} = require('./parseData')


const REDIS_PORT = process.env.PORT || 16349;
const REDIS_HOST = process.env.REDISCLOUD_URL;

const client = redis.createClient(REDIS_HOST, {no_ready_check: true});

const app = express();

client.on('connect', function() {
    console.log('Redis connected');
});



app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');  
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


async function getData(req, res){
  try{
    console.log("fetching data..")

    let {scode} = req.query;    
    scode  = scode.toUpperCase();

    const response = await fetch(`https://tgftp.nws.noaa.gov/data/observations/metar/stations/${scode}.TXT`);

    if(!response.ok){
      res.status(500).json({"err":response.statusText})
    }else{
      let data = await response.text();    
      data  = data.replace(/(\r\n|\n|\r)/gm," ");   
      let parsedData = await parseData(data)
      client.hmset(scode, parsedData.data)  
      client.expire(scode, 300);

      res.status(200).json(parsedData)  
    }    


  }catch(err){
    console.log(err)
    res.status(500)
  }
}

function hasCache(req, res, next){
  let {scode, nocache}  = req.query;
  scode  = scode.toUpperCase();
  if(nocache == 1){
    next()
  }else{
    client.exists(scode, function(err, reply){
      if (reply == 1){
        console.log("Retrieved from cache...")
         client.hgetall(scode, (err, data)=>{
            if(err){res.status(500).json({"msg":err})}
            res.status(200).json({data})
         })
      }else{
        console.log("Doesn't exists...");
        next()
      }
    })
    
  }
}

app.get("/metar/ping", (req, res)=>{
  res.status(200);
  res.send({"data":"pong"});

});

app.get("/metar/info", hasCache, getData);

//page not found with 404
app.use((req, res, next)=>{
	var err = new Error('Page not Found');
	err.status = 404;
	next(err)
});

//handling errors
app.use((err, req, res, next)=>{
	res.status(err.status || 500);
	res.send(err.message);
})


const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=>console.log('server stared at port ' + PORT ));