const url = 'https://data.cityofnewyork.us/resource/f9bf-2cp4.json'


function createChart(ctx, labels, title, data, len) {
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels, // poverty, race, .. 
      datasets: [{
        label: title,
        data: data,
        backgroundColor: generateColors(len),
        borderColor: generateColors(len),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

}
const highestSAT = document.getElementById('highestSAT')
var ctx = document.getElementById('myChart');
const borderColor = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)'
]


const backgroundColor = [
  'rgba(255, 99, 132, 0.3)',
  'rgba(54, 162, 235, 0.3)',
  'rgba(255, 206, 86, 0.3)',
  'rgba(75, 192, 192, 0.3)',
  'rgba(153, 102, 255, 0.3)',
  'rgba(255, 159, 64, 0.3)'
]

const totalStd = document.querySelector('#totalStd')
const totalMean = document.querySelector('#totalMean')
const stdCtx = document.querySelector('#std')
const testTakersTotal = document.querySelector('#testTakersTotal')
const pData = document.querySelector('#pData')

var topTenCtx = document.getElementById('topTenCtx');
let test = async function () {
  await axios.get(url).then(response => {
    var filtered = response.data.filter((x) => {
      return parseInt(x.num_of_sat_test_takers) > 250
    })
    let schoolScores = {}

    filtered.forEach((x) => {
      schoolScores[x.school_name] = findTotal(x.sat_critical_reading_avg_score, x.sat_math_avg_score, x.sat_writing_avg_score)
    })
    console.log(schoolScores)
    testTakersTotal.innerText = filtered.length

    function findMean(x) {
      if (typeof x == 'string') {
        let mean = filtered.reduce((prev, next) => {
          prev += parseInt(next[x])
          return prev
        }, 0)
        return Math.round(mean / filtered.length)
      } else {
        let mean = x.reduce((prev, next) => {
          return prev += next
        }, 0)
        return Math.round(mean / x.length)
      }


    }

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(schoolScores),
        datasets: [{
          label: 'Data Averages of NY High Schools',
          data: Object.values(schoolScores),
          backgroundColor: generateColors(Object.keys(schoolScores).length, backgroundColor),
          borderColor: generateColors(Object.keys(schoolScores).length, borderColor),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });


    function standardDeviation(arr) {
      let mean = findMean(arr)
      let squares = []
      arr.forEach((x) => {
        squares.push(Math.pow(x - mean, 2))
      })
      return Math.round(Math.sqrt(findMean(squares)))

    }
    let std = standardDeviation(Object.values(schoolScores))
    console.log('std: ' + std)

    const meanOfTestTakers = findMean('num_of_sat_test_takers')
    const meanOfCritReading = findMean('sat_critical_reading_avg_score')
    const meanOfMath = findMean('sat_math_avg_score')
    const meanOfWriting = findMean('sat_writing_avg_score')

    const totalMeanScore = findTotal(meanOfCritReading, meanOfMath, meanOfWriting)


    console.log(filtered)
    console.log(meanOfTestTakers)
    console.log(totalMeanScore)
    totalMean.innerHTML = "Mean SAT score of all high schools: " + totalMeanScore

    totalStd.innerHTML = "Standard Deviation of all scores: " + std
    let sortedVals = Object.values(schoolScores)

    sortedVals.push(totalMeanScore)

    sortedVals = sortedVals.sort((a, b) => {
      return a - b
    })

    var meanIndex = sortedVals.indexOf(totalMeanScore)
    console.log('sorted: ' + sortedVals + 'meanIndex? ' + meanIndex)
    highestSortedVals = Object.values(schoolScores).sort((a, b) => {
      return b - a
    })

    var std2 = sortedVals.indexOf(1514)
    pData.innerText = `${std2} / ${filtered.length} of schools are within 1 standard deviation of the mean SAT scores. ${filtered.length - std2} / ${filtered.length} are outside 1 standard deviation and represent the top ${Math.floor(((filtered.length - std2) / filtered.length)*100)}% of the data`

    function generateColors(len, color) {
      console.log('STD: ' + std2)
      let colors = []

      for (let i = 0; i < len; i++) {

        if (colors == meanIndex) {
          colors.push(color[i % 5])
        }
        if (i < 1 || i > std2) {
          colors.push('rgba(0, 0, 0, 0.3)')
        } else {
          colors.push(color[i % 5])
        }
        console.log('i: ' + i)

      }
      console.log('border color: ' + colors.length)
      return colors
    }

    let lowest = Object.keys(schoolScores).sort(function (a, b) {
      return schoolScores[b] - schoolScores[a]
    })

    let lowestSchoolScores = {}
    for (let i = 0; i < lowest.length; i++) {
      lowestSchoolScores[lowest[i]] = [highestSortedVals[i]]
    }

    let lows = {}
    for (let i = 0; i < 5; i++) {
      lows[lowest[i]] = [highestSortedVals[i]]
    }

    let highestSchoolScores = {}
    for (let i = lowest.length - 1; i > lowest.length - 6; i--) {
      highestSchoolScores[lowest[i]] = highestSortedVals[i]
    }
    console.log('BBBBBB')
    console.log(highestSchoolScores)


    function generateColorsMean(len, color) {


      let colors = []
      for (let i = 0; i < len; i++) {
        if (i == meanIndex) {
          colors.push(borderColor[i % 5])
          i++
        }
        if (i < 1 || i > std2) {
          colors.push('rgba(0, 0, 0, 0.3)')
        } else {
          colors.push(color[i % 5])
        }
        console.log('2222i: ' + i)
      }
      console.log('AAAAA: ' + colors.length)
      return colors
    }

    var myChart = new Chart(stdCtx, {
      type: 'bar',
      data: {
        labels: sortedVals,
        datasets: [{
          label: 'Data Averages of NY High Schools',
          data: sortedVals,
          backgroundColor: generateColorsMean(Object.keys(schoolScores).length + 1, backgroundColor),
          borderColor: generateColors(Object.keys(schoolScores).length + 1, borderColor),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    // Object.values(schoolScores) [1429,1430,1440...] 
    // map to the names -> [lewis,worse,bad]  
    // schoolScores = {lewis: 1490, stuvesant: 1500} 
    console.log(highestSAT)


    for (let school in lows) {

      highestSAT.innerHTML += `<div class ="schoolScore"> <a href ="#${school}"><h2> ${school} </h2><h3> Average SAT score: ${schoolScores[school]} </a></h3>`

    }
    const lowestSAT = document.querySelector("#lowestSAT")
    for (let school in highestSchoolScores) {
      lowestSAT.innerHTML += `<div class ="schoolScore"> <a href ="#${school}"><h2> ${school} </h2><h3> Average SAT score: ${schoolScores[school]} </a></h3>`
    }


    const nyURL = 'https://data.cityofnewyork.us/resource/s52a-8aq6.json?year=2017-18&grade_8=0&$where=total_enrollment > 700'
    axios.get(nyURL).then(response => {
      let data = response.data

      console.log('LEN: ' + data.length)

      let filteredNY = data.filter((x) => {
        return x['year'] === "2017-18" && x['grade_k'] === "0"
      })

      console.log('CCCCCCCCC')
      console.log(filteredNY)
      let filteredArr = {}
      console.log(filteredNY)
      console.log(lowest)
      console.log('TEST: ' + lowest.indexOf(filteredNY[2]['school_name'].toUpperCase()))

      for (let i = 0; i < filteredNY.length; i++) {
        if (lowest.indexOf(filteredNY[i]['school_name'].toUpperCase()) >= 0) {
          filteredArr[filteredNY[i]['school_name']] = i
          lowestSchoolScores[filteredNY[i]['school_name'].toUpperCase()] = i
        }
      }
      console.log('DDDDDD')
      console.log(filteredArr)
      let filteredKeys = Object.keys(filteredArr)
      let topFiveSchools = {}
      for (let i = 0; i < filteredKeys.length; i++) {
        if (lowestSchoolScores[filteredKeys[i].toUpperCase()]) {
          topFiveSchools[filteredKeys[i]] = filteredArr[filteredKeys[i]]

        }
      }



      lowestSchoolScores["Bronx High School of Science".toUpperCase()] = 13


      let top10SAT = document.querySelector('#topTenList')
      //highestSAT (caps??) and filteredArr (no caps??) {'stu: 3} highest sat: stu: 2335








      //{stu: 3} // 
      //stuvesant, bronx .. 
      let economicMean = filteredNY.reduce((prev, next) => {

        return prev += parseInt(next['economic_need_index'])
      }, 0)

      let povertyMean = filteredNY.reduce((prev, next) => {
        return prev += parseInt(next['poverty_2'])
      }, 0)

      let englishMean = filteredNY.reduce((prev, next) => {
        return prev += parseInt(next['english_language_learners_2'])
      }, 0)

      economicMean = Math.round((economicMean) / filteredNY.length)
      povertyMean = Math.round((povertyMean) / filteredNY.length)
      englishMean = Math.round((englishMean) / filteredNY.length)

      let entries = (Object.entries(lowestSchoolScores))
      console.log('UGHH')
      console.log(entries)
      for (let i = 0; i < 5; i++) {
        top10SAT.innerHTML += `<div id ='${filteredNY[entries[i][1]]['school_name'].toUpperCase()}' class ='schoolEntry'> 
        <h2 class ="schoolName"> ${filteredNY[entries[i][1]]['school_name']} </h2>
        <p> Total Enrollment: ${filteredNY[entries[i][1]]['total_enrollment']} <p/>
        <p> Poverty Index: <span style = "color:teal">${filteredNY[entries[i][1]]['poverty_2']}% </span> | Average: ${povertyMean}%</p> 
        <p>Economic Need Index:  <span style ="color:teal"> ${filteredNY[entries[i][1]]['economic_need_index']} </span> | Average: ${economicMean}% </p> 
        <p> % of English Language Learners: <span style = "color:teal"> ${filteredNY[entries[i][1]]['english_language_learners_2']}% </span> | Average: ${englishMean}% </p>
        </div>
       
        `

      }

      let ind = entries.length - 1
      const lowList = document.querySelector("#topLowList")
      for (let i = 0; i < 5; i++) {
        topLowList.innerHTML += `<div id ='${filteredNY[entries[ind-i][1]]['school_name'].toUpperCase()}' class ='schoolEntry'> 
        <h2 class="schoolName"> ${filteredNY[entries[ind-i][1]]['school_name']} </h2>
        <p> Total Enrollment: ${filteredNY[entries[ind-i][1]]['total_enrollment']} <p/>
        <p> Poverty Index: <span style = "color:red">${filteredNY[entries[ind-i][1]]['poverty_2']}% </span> | Average: ${povertyMean}%</p> 
        <p>Economic Need Index:  <span style ="color:red"> ${filteredNY[entries[ind - i][1]]['economic_need_index']} </span> | Average: ${economicMean}% </p> 
        <p> % of English Language Learners: <span style ="color:red">${filteredNY[entries[ind - i][1]]['english_language_learners_2']}% </span> | Average: ${englishMean}% </p>
        </div>`
      }









      /*
      <p> Asian population: ${filteredNY[entries[i][1]]['asian_population1']}<p/>
            White population: ${filteredNY[entries[i][1]]['asian_population1']}<p/>
            Hispanic: ${filteredNY[entries[i][1]]['asian_population1']}<p/>
            Black:${filteredNY[entries[i][1]]['asian_population1']}<p/>
            Poverty Index: ${filteredNY[entries[i][1]]['asian_population1']}<p/>
            ESL learners: ${filteredNY[entries[i][1]]['asian_population1']}<p/>
            */






      console.log(filteredNY)







    }).catch((e) => {
      console.log(e)
    })
    /*function createChart(ctx,labels,title,data,len ) {
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels, // poverty, race, .. 
          datasets: [{
            label: title,
            data: data,
            backgroundColor: generateColors(len),
            borderColor: generateColors(len),
            borderWidth: 1
          }]
        },
        */




  }).catch(e => {
    console.log(e)
  })
}

test()