const url = 'https://data.cityofnewyork.us/resource/f9bf-2cp4.json'
let test = async function () {
  await axios.get(url).then(response => {
    console.log(response)
  }).catch(e => {
    console.log(e)
  })
}
test()