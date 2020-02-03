const url = 'https://data.cityofnewyork.us/resource/f9bf-2cp4.json'
let test = async function () {
  await axios.get(url).then(response => {
    let filtered = response.data.filter((x) => {
      return parseInt(x.num_of_sat_test_takers) > 300

    })
    console.log(filtered)
  }).catch(e => {
    console.log(e)
  })
}
test()