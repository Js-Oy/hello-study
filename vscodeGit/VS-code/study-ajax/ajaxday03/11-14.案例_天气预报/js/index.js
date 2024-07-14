/**
 * 目标1：默认显示-北京市天气
 *  1.1 获取北京市天气数据
 *  1.2 数据展示到页面
 */
const render=(cityCode)=>{
    myAxios({
        url:'http://hmajax.itheima.net/api/weather',
        method:'get',
        params:{
            city:cityCode
        }
    }).then(res=>{
        // console.log(res);
        // console.log(res.data.dateLunar);
        const timeOne=`<span class="dateShort">${res.data.dateShort}</span>
        <span class="calendar">农历&nbsp;
          <span class="dateLunar">${res.data.dateLunar}</span>
        </span>`
        document.querySelector('.top-box .title').innerHTML=timeOne
        document.querySelector('.top-box .area').innerHTML=res.data.area
        const nowWeather=` <div class="tem-box">
        <span class="temp">
          <span class="temperature">${res.data.temperature}</span>
          <span>°</span>
        </span>
      </div>
      <div class="climate-box">
        <div class="air">
          <span class="psPm25">${res.data.psPm25}</span>
          <span class="psPm25Level">${res.data.psPm25Level}</span>
        </div>
        <ul class="weather-list">
          <li>
            <img src="${res.data.weatherImg}" class="weatherImg" alt="">
            <span class="weather">${res.data.weather}</span>
          </li>
          <li class="windDirection">${res.data.windDirection}</li>
          <li class="windPower">${res.data.windPower}</li>
        </ul>
      </div>`
     document.querySelector('.weather-box').innerHTML=nowWeather
     const {data}=res
    const {todayWeather}=data

    const todayWer=`<div class="range-box">
        <span>今天：</span>
        <span class="range">
          <span class="weather">${todayWeather.weather}</span>
          <span class="temNight">${todayWeather.temNight}</span>
          <span>-</span>
          <span class="temDay">${todayWeather.temDay}</span>
          <span>℃</span>
        </span>
      </div>
      <ul class="sun-list">
        <li>
          <span>紫外线</span>
          <span class="ultraviolet">${todayWeather.ultraviolet}</span>
        </li>
        <li>
          <span>湿度</span>
          <span class="humidity">${todayWeather.humidity}</span>%
        </li>
        <li>
          <span>日出</span>
          <span class="sunriseTime">${todayWeather.sunriseTime}</span>
        </li>
        <li>
          <span>日落</span>
          <span class="sunsetTime">${todayWeather.sunsetTime}</span>
        </li>
      </ul>`
      document.querySelector('.today-weather').innerHTML=todayWer
    //   console.log(data.dayForecast);
      const weekWeather=data.dayForecast.map((item=>{
        return`<li class="item">
          <div class="date-box">
            <span class="dateFormat">${item.dateFormat}</span>
            <span class="date">${item.date}</span>
          </div>
          <img src="./imgs/多云.png" alt="" class="weatherImg">
          <span class="weather">${item.weather}</span>
          <div class="temp">
            <span class="temNight">${item.temNight}</span>-
            <span class="temDay">${item.temDay}</span>
            <span>℃</span>
          </div>
          <div class="wind">
            <span class="windDirection">${item.windDirection}</span>
            <span class="windPower">${item.windPower}</span>
          </div>
        </li>`  
      })).join('')
      document.querySelector('.week-wrap').innerHTML=weekWeather
    })
}

//目标2：根据关键字，展示匹配的城市列表
//2.1给搜索框绑定输入事件
//2.2获取到输入内容后，发送请求，获取匹配城市列表
//2.3渲染城市列表
document.querySelector('.search-city').addEventListener('input',e=>{
    // console.log(e.target.value);
    myAxios({
        url:'http://hmajax.itheima.net/api/weather/city',
        method:'get',
        params:{
            city:e.target.value
        }
    }).then(res=>{
        // console.log(res);
        document.querySelector('.search-list').innerHTML=res.data.map(item=>{
            // console.log(item);
            return`<li class="city-item" data-code="${item.code}">${item.name}</li>`
        }).join('')
    })
})

//目标3：点击不同的城市，页面显示不同天气的城市
//3.1给所有的城市绑定事件 =>事件委托
//3.2点击当前的城市，得到城市code值
document.querySelector('.search-list').addEventListener('click',e=>{
    if(e.target.tagName=='LI'){
        render(e.target.dataset.code)
        document.querySelector('.search-city').value=''
        document.querySelector('.search-list').innerHTML=''
    }
})