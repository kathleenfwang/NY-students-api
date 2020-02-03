const url = 'https://data.cityofnewyork.us/resource/f9bf-2cp4.json'

function findTotal(a, b, c) {
  return Math.round(parseInt(a) + parseInt(b) + parseInt(c))
}

function standardDeviation() {
  findMean
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

function generateColors(len, color) {
  let colors = []
  for (let i = 0; i < len; i++) {
    colors.push(color[i % 5])
  }
  return colors
}
const backgroundColor = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)'
]

const totalStd = document.querySelector('#totalStd')
const totalMean = document.querySelector('#totalMean')
const stdCtx = document.querySelector('#std')
const highestSATDiv = document.querySelector('#highestSAT')
let test = async function () {
  await axios.get(url).then(response => {
    var filtered = response.data.filter((x) => {
      return parseInt(x.num_of_sat_test_takers) > 400
    })
    let schoolScores = {}
    let highestSchoolScores = {}
    filtered.forEach((x) => {
      schoolScores[x.school_name] = findTotal(x.sat_critical_reading_avg_score, x.sat_math_avg_score, x.sat_writing_avg_score)
    })
    console.log(schoolScores)

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

    highestSortedVals = Object.values(schoolScores).sort((a, b) => {
      return b - a
    })

    let meanIndex = sortedVals.indexOf(totalMeanScore)
    console.log('m i :' + meanIndex)

    let lowest = Object.keys(schoolScores).sort(function (a, b) {
      return schoolScores[b] - schoolScores[a]
    })

    console.log(lowest)
    let lowestSchoolScores = {}
    for (let i = 0; i < lowest.length; i++) {
      lowestSchoolScores[lowest[i]] = highestSortedVals[i]
    }
    console.log(lowestSchoolScores)

    function generateColorsMean(len, color) {
      let colors = []
      for (let i = 0; i < len; i++) {
        if (i == meanIndex) {
          colors.push(borderColor[0])
        } else {
          colors.push(color[i % 5])
        }
      }
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


  }).catch(e => {
    console.log(e)
  })
}

test()