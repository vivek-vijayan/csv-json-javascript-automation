// master data upload - Script

class AutomationScript {
  static masterDataOutput = "";

  // Static member
  static parentcheck = [];
  static parenth = [];

  constructor(dimension, filetype = "csv") {
    this.dimension = dimension;
    this.filetype = filetype;
    console.log("Automation activated on the dimension: " + this.dimension);
    this.headingPart = new Array();
    this.bodyPart = {};
    this.parentcheck = ["1"];
    this.totalBaseMember = 0;
    this.dimensionParentStructure = {
      ENTITY: [
        "Management",
        "Hyperion BHI",
        "Stat Structure",
        "MGNT Excl JV",
        "Joint Venture Only",
        "MGNT Equity Acc",
        "JV Equity Acc",
      ],
      FLOW: ["PARENTH1", "PARENTH2", "PARENTH3", "PARENTH4"],
      ACCOUNT: ["PARENTH1", "PARENTH2", "PARENTH3", "PARENTH4"],
    };
    this.JVPCProperty = "To indicate member of the JV_EA";
    this.EAPCProperty = "JV_ACC";
  }

  generateIcons(outputArea) {
    while (outputArea.hasChildNodes()) {
      outputArea.removeChild(outputArea.firstChild);
    }
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
  populateParentList() {
    let selectionMember = document.getElementById("parentselect");
    while (selectionMember.hasChildNodes()) {
      selectionMember.removeChild(selectionMember.firstChild);
    }

    automationObject.dimensionParentStructure[
      automationObject.dimension
    ].forEach((element) => {
      try {
        let parentElement = element;
        automationObject.parentcheck.push(parentElement);
        let optionElement = document.createElement("option");
        optionElement.value = parentElement;
        optionElement.innerHTML = parentElement;
        selectionMember.appendChild(optionElement);
      } catch (error) {
        console.log(error.toString());
      }
    });
  }

  fetchParentMembers(ParentMode) {
    automationObject.parenth = [];
    //let parentMember = automationObject.dimensionParentStructure[automationObject.dimension][ParentMode];
    document.getElementById("parenthvalue").innerHTML = ParentMode;
    let parentMember = ParentMode;
    let selectionMember = document.getElementById("parentmemberselect");
    while (selectionMember.hasChildNodes()) {
      selectionMember.removeChild(selectionMember.firstChild);
    }
    let openMember = document.createElement("option");
    openMember.value = "All";
    openMember.innerHTML = "All";
    selectionMember.appendChild(openMember);

    automationObject.masterDataOutput.forEach((element) => {
      try {
        let parentElement = element[parentMember].toString();
        let memberDesc = element["Description"].toString();
        // .replace('"', "")
        // .replace('"', "");
        if (!automationObject.parenth.includes(parentElement)) {
          automationObject.parenth.push(parentElement);
          let optionElement = document.createElement("option");
          optionElement.value = parentElement;
          optionElement.setAttribute("data-sub-text", memberDesc);
          optionElement.innerHTML = parentElement;
          optionElement.dataToken = parentElement;
          selectionMember.appendChild(optionElement);
        }
      } catch (error) {
        console.log(error.toString() + parentMember.toString());
      }
    });
  }

  // INTERNAL FUNCTIONS -----------------
  findMemberByID(member) {
    return member["ID"] == document.getElementById("parentmemberselect").value;
  }

  // ----------------------------------

  fetchParentMemberDetails(member, parenth) {
    // finding its parent
    let parentDisplaySpan = document.getElementById("valuer1");
    try {
      let parent_member = automationObject.masterDataOutput.find(
        this.findMemberByID
      );
      let checkDim = document.getElementById("parentselect").value.toString();
      console.log(parent_member[checkDim]);
      if (parent_member[checkDim].length > 0) {
        parentDisplaySpan.classList.remove("bg-danger");
        parentDisplaySpan.classList.add("bg-success");
        parentDisplaySpan.innerHTML = parent_member[checkDim];
      } else {
        parentDisplaySpan.classList.remove("bg-success");
        parentDisplaySpan.classList.add("bg-danger");
        parentDisplaySpan.innerHTML = "No parent member";
      }
    } catch (error) {
      parentDisplaySpan.classList.remove("bg-success");
      parentDisplaySpan.classList.add("bg-danger");
      parentDisplaySpan.innerHTML = "No parent member";
    }
  }

  // MAXEFFORT data function  -- RECURSIVE member -------------------------------------------------
  findingWhetherItIsAParent(checkMember) {
    return automationObject.parenth.includes(checkMember);
  }
  determineTheTree(member) {
    let listOrder = document.createElement("ul");
    let members = [];
    console.log("Tree : " + member);
    var checkCount = 0;
    automationObject.masterDataOutput.forEach((element) => {
      let listMembers = document.createElement("li");
      if (element[document.getElementById("parentselect").value] == member) {
        //  members.push(element["ID"]);
        let text = document.createTextNode(
          element["ID"].toString() +
            " - " +
            element["Description"].toString() +
            "  "
        );
        listMembers.appendChild(text);

        // Currency
        try {
          let currency = document.createElement("span");
          //  <span class="badge bg-primary">Primary</span>
          currency.classList.add("badge");
          currency.classList.add("bg-secondary");
          currency.classList.add("rounded-pill");
          let curr = document.createTextNode(element["Currency"].toString());
          currency.appendChild(curr);
          listMembers.appendChild(currency);
          if (curr.length > 1) {
            automationObject.totalBaseMember++;
          }
        } catch (error) {
          console.log(error.toString());
        }

        // JV PC check
        try {
          if (element[automationObject.JVPCProperty].toString() === "Y") {
            let JVPC = document.createElement("span");
            JVPC.classList.add("badge");
            JVPC.classList.add("bg-danger");
            JVPC.classList.add("rounded-pill");
            let jv = document.createTextNode("JV PC");
            JVPC.appendChild(jv);
            listMembers.appendChild(JVPC);
            if (element[automationObject.JVPCProperty].toString() === "Y") {
              let EAPC = document.createElement("span");
              EAPC.classList.add("badge");
              EAPC.classList.add("bg-success");
              EAPC.classList.add("rounded-pill");
              let jv = document.createTextNode(
                element[automationObject.EAPCProperty].toString()
              );
              EAPC.appendChild(jv);
              listMembers.appendChild(EAPC);
            }
          }
        } catch (error) {
          console.log(error.toString());
        }

        listOrder.appendChild(listMembers);
        checkCount++;
        if (
          automationObject.masterDataOutput.filter(
            this.findingWhetherItIsAParent
          )
        ) {
          console.log("parent found");
          listMembers.appendChild(
            this.determineTheTree(element["ID"].toString())
          );
        }
      }
      document.getElementById("valuer2").innerHTML =
        automationObject.totalBaseMember.toString() + " members";
    });
    let useless = document.createElement("span");
    console.log(members);
    return checkCount > 0 ? listOrder : useless;
  }

  // Function to fetch the master data from the user
  async getMasterDataFromUser(data) {
    console.log("Fetching the master data from the user....");
    var fileVariable = new FileReader();
    fileVariable.onload = function (event) {
      function parseToCSV(str, headList, bodyList) {
        const heading = str
          .replace('"', "")
          .replace('"', "")
          .slice(0, str.indexOf("\n"))
          .split(",");
        const body = str
          .replace('"', "")
          .replace('"', "")
          .slice(str.indexOf("\n") + 1)
          .split("\n");
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
  document.getElementById("showdim1").innerHTML = dimension;
  document.getElementById("showdim2").innerHTML = dimension;
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
  var selected = sel.val();
  var opts_list = sel.find("option");
  opts_list.sort(function (a, b) {
    return $(a).text() > $(b).text() ? 1 : -1;
  });
  sel.html("").append(opts_list);
  sel.val(selected);
}

function processMasterData() {
  // ------------------  PROCESS BUTTON
  showPopupAlert("Processing the dimension, please wait....");
  let outputArea = document.getElementById("outputarea");
  //automationObject.generateIcons(outputArea);
  automationObject.populateParentList();
  //alphabetizeList("select.parenth1select option");
  hidePopupAlert();
  swal(
    "Extract  Data Process",
    "Data has been processed successfully",
    "success"
  );
}

function fetchParentMemberFromSelection() {
  // ----- On change ------ PARENT select dropdown
  automationObject.fetchParentMembers(
    document.getElementById("parentselect").value
  );
}

function fetchParentMemberDetails() {
  automationObject.fetchParentMemberDetails(
    document.getElementById("parentmemberselect").value,
    document.getElementById("parentselect").value
  );
}

function generateTree() {
  let outputarea = document.getElementById("outputarea");
  automationObject.totalBaseMember = 0;
  document.getElementById("showMember").innerHTML = document
    .getElementById("parentmemberselect")
    .value.toString();
  let selectionMember = outputarea;
  while (selectionMember.hasChildNodes()) {
    selectionMember.removeChild(selectionMember.firstChild);
  }
  let divmember = document.createElement("div");
  divmember.appendChild(
    automationObject.determineTheTree(
      document.getElementById("parentmemberselect").value
    )
  );
  outputarea.appendChild(divmember);
  loadFolder();
}

const getDataFormTemp = document.getElementById("getDataForm");
getDataFormTemp.addEventListener("submit", function (e) {
  //------------------------------ UPLOAD BUTTON
  e.preventDefault();
  activateMasterData();
});

function loadFolder() {
  $(document).ready(function () {
    var allFolders = $(".directory-list li > ul");
    allFolders.each(function () {
      var folderAndName = $(this).parent();
      folderAndName.addClass("folder");
      var backupOfThisFolder = $(this);
      $(this).remove();
      folderAndName.wrapInner("<a href='#' />");
      folderAndName.append(backupOfThisFolder);
      folderAndName.find("a").click(function (e) {
        $(this).siblings("ul").slideToggle("slow");
        e.preventDefault();
      });
    });
  });
}
