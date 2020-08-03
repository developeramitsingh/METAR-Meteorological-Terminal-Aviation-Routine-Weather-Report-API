module.exports = {

	parseData:(data)=>{
		let obj = {
			"data":{}
		}
		let arr= data.split(" ")
		function getTemperature(arr){
		  let temp = arr.filter(function(elem){    
		   if (elem.indexOf("/") > -1){
		     let el = elem.split("/")     
		     return ((el.length == 2) && (el[0].length <= 3))
		   }
		  });
		  let temp2 = temp[0].split("/")
		  temp2  = temp2.map((elem)=>{return elem.replace("M", "-")})
		  return temp2[0]
		}

		let temper = getTemperature(arr);

		function convertToF(temp){
		  let f = (temp*9/5)+32
		  return f + " F" 
		}

		function getWind_Direction(arr){
		  let final = [];
		  let temp = arr.filter((elem)=>{return elem.endsWith("KT")})
		  temp = temp[0].replace("KT","")  
		  
		  if(temp.indexOf("G") >-1){    
		    let wind = temp.substr(temp.length-5)
		    wind = wind.split("G")
		    let direction = temp.substr(0,3)
		    wind = `${wind[0]} gusting to ${wind[1]} knots (${parseInt(wind[0]*1.151)} mph to ${parseInt(wind[1]*1.151)} mph)`
		    final.push(wind)
		    final.push(direction)
		    
		  }else{    
		    let wind = temp.substr(temp.length-2)
		    wind = `${wind} knots (${parseInt(wind*1.151)} mph)`
		    let direction = temp.substr(0,3)
		    final.push(wind)
		    final.push(direction)
		  } 
		 return final
		}

		let windarr = getWind_Direction(arr);

		let faren = convertToF(temper);
		let station = arr[2];
		let lastObserv = arr[0] + " at " + arr[1]+ " GMT";
		let finalTemper = `${temper} C (${faren})`;
		let wind  = `S at ${windarr[0]}`
		let direct = windarr[1];
		
		obj.data["station"] = station;
		obj.data["last_observation"] = lastObserv;
		obj.data["temperature"] =  finalTemper;
		obj.data["wind"] = wind;
		obj.data["direction"] = direct;
		
		return obj;
	}	
	

}