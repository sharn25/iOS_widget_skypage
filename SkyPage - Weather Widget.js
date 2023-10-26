// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;


//API_KEY
let API_WEATHER = "API_HERE";//Load Your api here
let CITY_WEATHER = "6954929";//add your city ID(disabled please USE LAT LONG)
let UNIT_TYPE = "C";//C for Celius and F for fernite
let TEXT_COLOR = "#000000";//Text color
let BG_COLOR = "f8f8f8";//background color
let FONT = "Avenir";//Text Font
let FONT_BOLD = "Avenir-Heavy";//Text Font bold
let MODE = "M";// A - get the location on auto, M - get location from city ID(Manual)
let LAT = "28.4499";
let LONG = "77.5278";

// Create Widget
const widget = new ListWidget()

// Create fonts
let fontsmalltxt = new Font(FONT,12)
let fontbigtxt = new Font(FONT,40)
let fontsmallheavytxt = new Font(FONT_BOLD,11)

// Create colors
let textColor = new Color(TEXT_COLOR)
let bg_color = new Color(BG_COLOR)

// Get storage
var fm = FileManager.iCloud();
var base_path = fm.documentsDirectory() + "/weather_sb/";

//Get widget
await createWidget_small()
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

// Create Widget Small
async function createWidget_small() {
    
  // get weather Data
  let unit_id = "";
  let unit_s = "";
  let unit_id_open_metro = "";
  if(UNIT_TYPE=="F"){
    unit_id = "imperial";
    unit_id_open_metro = "fahrenheit"
    unit_s = "°";
  }else{
    unit_id = "metric";
    unit_s = "°";
    unit_id_open_metro = "celsius"
  }
	
  //let wetherurl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=" + unit_id;
  let wetherurl = "https://api.openweathermap.org/data/2.5/weather?lat=" + LAT + "&lon=" + LONG + "&appid=" + API_WEATHER + "&units=" + unit_id;
  let url2 = "https://api.open-meteo.com/v1/forecast?latitude="+ LAT +"&longitude="+LONG+"&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&forecast_days=1&temperature_unit=" + unit_id_open_metro;
  if(MODE === "A"){
    Location.setAccuracyToBest();
    let curLocation = await Location.current();
    wetherurl = "https://api.openweathermap.org/data/2.5/weather?lat=" + curLocation.latitude + "&lon=" + curLocation.longitude + "&appid=" + API_WEATHER + "&units=" + unit_id;
    url2 = "https://api.open-meteo.com/v1/forecast?latitude="+ curLocation.latitude +"&longitude="+curLocation.longitude+"&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto&forecast_days=1&temperature_unit=" + unit_id_open_metro;
    
  }
  
  const weatherJSON = await fetchWeatherData(wetherurl);
  const weatherJSONnew = await fetchWeatherData(url2)
  console.log(weatherJSONnew)
  const cityName = weatherJSON.name;
  const weatherarry = weatherJSON.weather;
  const iconData = weatherarry[0].icon;
  const weathername = weatherarry[0].main;
  const curTempObj = weatherJSON.main;
  const curTemp = Math.round(curTempObj.temp);
  const highTemp = Math.round(curTempObj.temp_max);
  const lowTemp = Math.round(curTempObj.temp_min);
  const feel_like = curTempObj.feels_like;
  const humidity = curTempObj.humidity;
  //Completed loading weather data

  // seacond weather data
  const hiTempnew = Math.round(weatherJSONnew.daily.temperature_2m_max[0])
  const lowTempnew = Math.round(weatherJSONnew.daily.temperature_2m_min[0])
  const curTempnew = Math.round(weatherJSONnew.current_weather.temperature)
  console.log(hiTempnew)
  console.log(lowTempnew)

  // init widget parameters
  widget.backgroundColor = bg_color
  widget.setPadding(0, 10, 0, -95)
  
  // create two cols stack 
  let main_row = widget.addStack()
  main_row.layoutHorizontally()
  main_row.addSpacer(2)
  let weather_col = main_row.addStack()
  weather_col.layoutVertically()
  main_row.addSpacer()
  let ills_col = main_row.addStack()
  ills_col.layoutVertically()
  
  // Weather detail section start
  weather_col.addSpacer(15)
  
  // add high low temp details
  const hi_low_row = weather_col.addStack()
  hi_low_row.layoutHorizontally()
  hi_low_row.addSpacer(3)
  
  const hilowtxt = hi_low_row.addText(hiTempnew + unit_s + ' | ' + lowTempnew + unit_s)
  hilowtxt.textColor = textColor;
  hilowtxt.font = fontsmalltxt
    
  weather_col.addSpacer(0)

  // Current Tempature 
  const temptxt = weather_col.addText(curTempnew + unit_s)
  temptxt.textColor = textColor;
  temptxt.font = fontbigtxt
    
  weather_col.addSpacer(0)

  // Icon and Hummidity Row
  let icon_hum_row = weather_col.addStack()
  icon_hum_row.layoutHorizontally()
    
  var icon = Image.fromFile(await fetchimage(iconData + "_ico"))
  const iconImg = icon_hum_row.addImage(icon)
  iconImg.imageSize = new Size(20, 20)
  
  icon_hum_row.addSpacer(5)
  
  let hum_row = icon_hum_row.addStack()
  hum_row.layoutVertically()
  hum_row.addSpacer(2)
  const humtxt = hum_row.addText(humidity +'%')
  humtxt.textColor = textColor;
  humtxt.font = fontsmalltxt
  
  weather_col.addSpacer(2)

  // weather condition name
  let condition_row = weather_col.addStack()
  condition_row.layoutHorizontally()
  condition_row.addSpacer(1)
  const conditiontxt = condition_row.addText(weathername)
  conditiontxt.textColor = textColor;
  conditiontxt.font = fontsmallheavytxt
    
  weather_col.addSpacer(2)
  
  // weather city Name
  let location_row = weather_col.addStack()
  location_row.layoutHorizontally()
  location_row.addSpacer(1)
  const locationtxt = location_row.addText(cityName)
  
  locationtxt.textColor = textColor;
    locationtxt.font = fontsmallheavytxt
    
  weather_col.addSpacer()
    
    ills_col.addSpacer(11)
  // create and add illustration
  let ills_row = ills_col.addStack()
  ills_row.layoutHorizontally()
  ills_row.addSpacer()
  
  var image = Image.fromFile(await fetchimage(iconData + "_bg"))
    const illsImg = ills_row.addImage(image)
  illsImg.imageSize = new Size(150, 150)
  
  widget.addSpacer();
  
}


// Helper Functions

// Load image from local drive
async function fetchimagelocal(image){
  var finalPath = base_path + image;
  let dir = fm.documentsDirectory();
  console.log(dir)
  if(fm.fileExists(finalPath)==true){
    console.log("file exists: " + finalPath);
    return finalPath;
  }else{
      throw new Error("Error file not found: " + image);
  }
  
}
  
// Fetch Image from Url
async function fetchimageurl(url) {
	const request = new Request(url)
	var res = await request.loadImage();
	return res;
}

//get Json weather
async function fetchWeatherData(url) {
  const request = new Request(url);
  const res = await request.loadJSON();
  return res;
}

// Load image from local drive
async function fetchimage(path){
  var finalPath = base_path + path + ".png";
  if(fm.fileExists(finalPath)==true){
    console.log("file exists: " + finalPath);
    return finalPath;
  }else{
    //throw new Error("Error file not found: " + path);
    if(fm.fileExists(base_path)==false){
      console.log("Directry not exist creating one.");
      fm.createDirectory(base_path);
    }
    console.log("Downloading file: " + finalPath);
    await downloadimg(path);
    if(fm.fileExists(finalPath)==true){
      console.log("file exists after download: " + finalPath);
      return finalPath;
    }else{
      throw new Error("Error file not found: " + path);
    }
  }
}

// download image from url
async function downloadimg(path){
    const url = "https://github.com/sharn25/ios_widget_skypage/raw/master/weather_skypage.json";
    const data = await fetchWeatherData(url);
    var dataimg = null;
    var name = null;
    if(path.includes("bg")){
      dataimg = data.background;
      name = path.replace("_bg","");
    }else{
      dataimg = data.icon;
      name = path.replace("_ico","");
    }
    var imgurl=null;
    switch (name){
      case "01d":
        imgurl = dataimg._01d;
      break;
      case "01n":
        imgurl = dataimg._01n;
      break;
      case "02d":
        imgurl = dataimg._02d;
      break;
      case "02n":
        imgurl = dataimg._02n;
      break;
      case "03d":
        imgurl = dataimg._03d;
      break;
      case "03n":
        imgurl = dataimg._03n;
      break;
      case "04d":
        imgurl = dataimg._04d;
      break;
      case "04n":
        imgurl = dataimg._04n;
      break;
      case "09d":
        imgurl = dataimg._09d;
      break;
      case "09n":
        imgurl = dataimg._09n;
      break;
      case "10d":
        imgurl = dataimg._10d;
      break;
      case "10n":
        imgurl = dataimg._10n;
      break;
      case "11d":
        imgurl = dataimg._11d;
      break;
      case "11n":
        imgurl = dataimg._11n;
      break;
      case "13d":
        imgurl = dataimg._13d;
      break;
      case "13n":
        imgurl = dataimg._13n;
      break;
      case "50d":
        imgurl = dataimg._50d;
      break;
      case "50n":
        imgurl = dataimg._50n;
      break;
    }
    const image = await fetchimageurl(imgurl);
    console.log("Downloaded Image");
    fm.writeImage(base_path+path+".png",image);
}
