// master data upload - Script

class AutomationScript {
  static masterDataOutput = "";

  // Static member
  static parenth1 = ["1"];
  static parenth2 = ["1"];

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

  // Funcitonality to fetch the parents availabe in the updated heirarchy
  fetchParentH1() {
    automationObject.parenth1 = []
    automationObject.masterDataOutput.forEach((element) => {
      try {
        let parentElement = element["'Management'"].toString().replace('"', "").replace('"', "");
        if (!automationObject.parenth1.includes(parentElement)) {
          automationObject.parenth1.push(parentElement);
          let optionElement = document.createElement("option");
          optionElement.value = parentElement;
          optionElement.innerHTML = parentElement;
          let selectionMember = document.getElementById("parenth1select");
          selectionMember.appendChild(optionElement);
        }
      } catch (error) {
        console.log(error.toString());
      }
    });
    // document.getElementById("outputarea").innerHTML = automationObject.parenth1;
    swal(
      "Extract  Data Process",
      "Data has been processed successfully",
      "success"
    );
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
      automationObject.parenth1 = [];
      automationObject.parenth2 = [];
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

function showPopupAlert(message) {
  let alertArea = document.getElementById("alert");
  alertArea.style.display = "block";
  alertArea.innerHTML = message;
}

function hidePopupAlert() {
  let alertArea = document.getElementById("alert");
  alertArea.style.display = "none";
}

function activateMasterData() {
  showPopupAlert("Uploading and Processing the Dimension... please wait");
  let dimension = document.getElementById("masterData").value;
  document.getElementById("showdim").innerHTML = dimension;
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
  hidePopupAlert();
}

function alphabetizeList() {
  var sel = $(listField);
  var selected = sel.val(); // cache selected value, before reordering
  var opts_list = sel.find("option");
  opts_list.sort(function (a, b) {
    return $(a).text() > $(b).text() ? 1 : -1;
  });
  sel.html("").append(opts_list);
  sel.val(selected); // set cached selected value
}

function processMasterData() {
  showPopupAlert("Processing the dimension, please wait....");
  let outputArea = document.getElementById("outputarea");
  automationObject.generateIcons(outputArea);
  automationObject.fetchParentH1();
  //alphabetizeList("select.parenth1select option");
  hidePopupAlert();
}

// -----------------------------------------------------------   automationObject.generateIcons()
const getDataFormTemp = document.getElementById("getDataForm");
getDataFormTemp.addEventListener("submit", function (e) {
  e.preventDefault();
  activateMasterData();
});
