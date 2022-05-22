// master data upload - Script

class AutomationScript {
  constructor(dimension, filetype = "csv") {
    this.dimension = dimension;
    this.filetype = filetype;
    console.log("Automation activated on the dimension: " + this.dimension);
    this.headingPart = new Array();
    this.bodyPart = {};
  }

  // Function to fetch the master data from the user
  getMasterDataFromUser(data) {
    console.log("Fetching the master data from the user....");
    var fileVariable = new FileReader();
    fileVariable.onload = function (event) {
      function parseToCSV(str, headList, bodyList) {
        const heading = str.slice(0, str.indexOf("\n")).split(",");
        const body = str.slice(str.indexOf("\n") + 1).split("\n");
        const arr = body.map(function (row) {
          const values = row.split(",");
          const el = heading.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
          }, {});
          return el;
        });
        return arr;
      }
      console.log(
        parseToCSV(event.target.result, this.headingPart, this.bodyPart)
      );
    };
    fileVariable.readAsText(data);
    swal(
      data["name"] + " uploaded",
      "Data has been uploaded to the local cache",
      "success"
    );
  }
}
//  -- END OF CLASS
// GLOBAL FUNCTIONS ------------------------------------------
function activateMasterData() {
  let dimension = document.getElementById("masterData").value;
  if (dimension === "Select the master data template") {
    swal(
      "Dimension template required",
      "Select the master data dimension template from the list!",
      "error"
    );
    return;
  }
  let automationObject = new AutomationScript(dimension);
  if (document.getElementById("uploadedFile").files[0]) {
    automationObject.getMasterDataFromUser(
      document.getElementById("uploadedFile").files[0]
    );
  }
}

// -----------------------------------------------------------
const getDataFormTemp = document.getElementById("getDataForm");
getDataFormTemp.addEventListener("submit", function (e) {
  e.preventDefault();
  activateMasterData();
});
