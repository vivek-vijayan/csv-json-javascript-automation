// master data upload - Script

class AutomationScript {
  static masterDataOutput = "";
  constructor(dimension, filetype = "csv") {
    this.dimension = dimension;
    this.filetype = filetype;
    console.log("Automation activated on the dimension: " + this.dimension);
    this.headingPart = new Array();
    this.bodyPart = {};
  }

  generateIcons(outputArea) {
    automationObject.masterDataOutput.forEach((element) => {
      let area = document.createElement("button");
      area.classList.add("btn");
      area.classList.add("btn-success");
      area.classList.add("button-margin");
      let xDATA = element['"ID"'];
      let data = document.createTextNode(
        xDATA.toString().replace('"', "").replace('"', "")
      );
      area.appendChild(data);
      outputArea.appendChild(area);
    });
  }

  // Function to fetch the master data from the user
  async getMasterDataFromUser(data) {
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

      var output = parseToCSV(
        event.target.result,
        this.headingPart,
        this.bodyPart
      );
      automationObject.masterDataOutput = output;
      console
    };
    fileVariable.readAsText(data);
    swal(
      data["name"] + " uploaded",
      "Data has been uploaded to the local cache",
      "success"
    );
  }
}
//  -- END OF CLASS ------------------------------------------

// GLOBAL VARIABLE ------------------------------------------
var automationObject = new AutomationScript("dimension");

// -- GLOBAL FUNCTIONS ---------------------------------------
function activateMasterData() {
  let dimension = document.getElementById("masterData").value;
  automationObject = new AutomationScript(dimension);
  if (dimension === "Select the master data template") {
    swal(
      "Dimension template required",
      "Select the master data dimension template from the list!",
      "error"
    );
    return;
  }
  if (document.getElementById("uploadedFile").files[0]) {
    automationObject.getMasterDataFromUser(
      document.getElementById("uploadedFile").files[0]
    );
  }
}

function processMasterData() {
  let outputArea = document.getElementById("outputarea");
  automationObject.generateIcons(outputArea);
}

// -----------------------------------------------------------   automationObject.generateIcons()
const getDataFormTemp = document.getElementById("getDataForm");
getDataFormTemp.addEventListener("submit", function (e) {
  e.preventDefault();
  activateMasterData();
});
