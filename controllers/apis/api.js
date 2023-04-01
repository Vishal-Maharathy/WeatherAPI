const axios = require('axios')
const Temperature = require('../../model/temperature')
const apiKey = process.env.OPENWEATHER_API
const capitals = [
    "Amaravati",
    "Itanagar",
    "Dispur",
    "Patna",
    "Chandigarh",
    "Raipur",
    "Panaji",
    "Gandhinagar",
    "Chandigarh",
    "Shimla",
    "Srinagar",
    "Ranchi",
    "Bengaluru",
    "Thiruvananthapuram",
    "Bhopal",
    "Mumbai",
    "Imphal",
    "Shillong",
    "Aizawl",
    "Kohima",
    "Bhubaneswar",
    "Puducherry",
    "Chandigarh",
    "Jaipur",
    "Gangtok",
    "Chennai",
    "Hyderabad",
    "Agartala",
    "Lucknow",
    "Dehradun",
    "Kolkata",
    "Delhi", // Union Territory
    "Chandigarh", // Union Territory
    "Daman", // Union Territory
    "Silvassa", // Union Territory
    "Puducherry" // Union Territory
  ];
const cord = []
exports.api = (req, res)=>{
    res.status(200).json({
        message:"API Called!"
    })
}
exports.tempTask = async()=>{
    try{
        for(const i in capitals){
            let {data} = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${capitals[i]}&appid=${apiKey}`)
            const temperature = new Temperature({
                city: capitals[i].toLowerCase(),
                temperature: (data.main.temp-273).toFixed(2),
                date: new Date().toISOString().split('T')[0],
              })
            temperature.save()
        }
        console.log("Task Completed")
    }catch(err){
        console.log(err)
    }
}
exports.tempTrend = async(req, res)=>{
    try{
        const temperature = await Temperature.aggregate([
          {
            $match: {
              city: req.query.city,
              date: {
                $gte: req.query.from,
                $lte: req.query.till
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
              },
              dailyMinTemp: { $min: "$temperature" },
              dailyMaxTemp: { $max: "$temperature" },
              dailyAvgTemp: { $avg: "$temperature" }
            }
          },
          {
            $group: {
              _id: null,
              overallMinTemp: { $min: "$dailyMinTemp" },
              overallMaxTemp: { $max: "$dailyMaxTemp" },
              overallAvgTemp: { $avg: "$dailyAvgTemp" },
              dailyTemperatures: {
                $push: {
                  date: "$_id",
                  dailyMinTemp: "$dailyMinTemp",
                  dailyMaxTemp: "$dailyMaxTemp",
                  dailyAvgTemp: "$dailyAvgTemp"
                }
              }
            }
          }
        ]).exec()
        res.status(200).json(temperature)
    }catch(err){
        console.log(err)
    }
}
exports.minMaxTrend = async(req, res)=>{
    try{
        const temperature = await Temperature.aggregate([
            {
              $match: {
                city: req.query.city,
                date: {
                  $gte: req.query.from,
                  $lte: req.query.till
                }
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                },
                minTemp: { $min: "$temperature" },
                maxTemp: { $max: "$temperature" }
              }
            },
            {
              $sort:{_id:1}
            }
          ]).exec()
          
        res.status(200).json(temperature)
    }catch(err){
        console.log(err)
    }
}
exports.compCities = async(req, res)=>{
  try{
    const temperature = await Temperature.aggregate([
      {
        $match: {
            city: {$in: [req.query.city1, req.query.city2]}, 
            date: { 
              $gte: req.query.from, 
              $lte: req.query.till } 
        }
      },
      {
        $group: {
          _id: {
            city: "$city",
            day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
          },
          maxTemp: { $max: "$temperature" },
          minTemp: { $min: "$temperature" },
          avgTemp: { $avg: "$temperature" }
        }
      },
      {
        $group: {
          _id: "$_id.city",
          overallMinTemp: { $min: "$minTemp" },
          overallMaxTemp: { $max: "$maxTemp" },
          overallAvgTemp: { $avg: "$avgTemp" },
          byDay: {
            $push: {
              date: "$_id.day",
              maxTemp: "$maxTemp",
              minTemp: "$minTemp",
              avgTemp: "$avgTemp"
            }
          }
        }
      }
    ]).exec()
      res.status(200).json(temperature)
  }catch(err){
      console.log(err)
  }
}