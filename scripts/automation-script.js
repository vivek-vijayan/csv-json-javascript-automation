// master data upload - Script

class AutomationScript {
  constructor(dimension, filetype = "csv") {
    this.dimension = dimension;
    this.filetype = filetype;
    console.log("Automation activated on the dimension: " + this.dimension);
  }

  // Function to fetch the master data from the user
  getMasterDataFromUser() {
    console.log("Fetching the master data from the user....");
  }
}

//  -- END OF CLASS

// GLOBAL FUNCTIONS

function activateMasterData() {

let dimension = document.getElementById('masterData').value
if(dimension==='Select the master data template') {
    alert('Select the proper dimension before processing it.')
    return;
}
  let a = new AutomationScript(dimension);

}
