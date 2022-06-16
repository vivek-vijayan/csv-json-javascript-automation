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
    this.jv_count = 0;
    this.jv_map_list_with_dict = [];
    this.companyList = [];
    this.currencyList = [];

    // line variables
    this.lineVariables = [];

    this.jv_count_check = 1;
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
    this.dimensionMappingList = {
      ENTITY: ["JV EA Mapping"],
    };
    this.JVPCProperty = "To indicate member of the JV_EA";
    this.EAPCProperty = "JV Equity Accounting Entity targeted";
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
      } catch (error) {}
    });
  }

  fetchParentMembers(ParentMode) {
    automationObject.parenth = [];
    //let parentMember = automationObject.dimensionParentStructure[automationObject.dimension][ParentMode];
    // document.getElementById("parenthvalue").innerHTML = ParentMode;
    let parentMember = ParentMode;
    let selectionMember = document.getElementById("parentmemberselect");
    let searchMember = document.getElementById("search-list-show");
    while (selectionMember.hasChildNodes()) {
      selectionMember.removeChild(selectionMember.firstChild);
    }
    while (searchMember.hasChildNodes()) {
      searchMember.removeChild(searchMember.firstChild);
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
          optionElement.innerHTML = parentElement + " - " + memberDesc;
          optionElement.dataToken = parentElement;
          selectionMember.appendChild(optionElement);

          let searchOptionElement = document.createElement("option");
          searchOptionElement.value = parentElement;
          searchOptionElement.setAttribute("data-sub-text", memberDesc);
          searchOptionElement.innerHTML = parentElement + " - " + memberDesc;
          searchOptionElement.dataToken = parentElement;
          searchMember.appendChild(searchOptionElement);
        }
      } catch (error) {
        //console.log(error.toString() + parentMember.toString());
      }
    });
    //automationObject.fetchAddOnMapping();
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
      // console.log(parent_member[checkDim]);
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

  // Determining the tree and the respective mapping in the heirarchy
  determineTheTree(member) {
    automationObject.removeArrowFunction();
    let listOrder = document.createElement("ul");
    let jv_mapping_list = document.createElement("ul");
    let members = [];
    //console.log("Tree : " + member);
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

        // getting the company code stack
        try {
          if (!automationObject.companyList.includes(element["COMP_CODE"])) {
            automationObject.companyList.push(element["COMP_CODE"]);
          }
        } catch (e) {}

        // getting the currency stack
        try {
          if (
            !automationObject.currencyList.includes(element["Currency"]) &&
            element["Currency"] != "undefined"
          ) {
            automationObject.currencyList.push(element["Currency"]);
          }
        } catch (e) {}

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
          //console.log(error.toString());
        }

        // JV PC check
        try {
          if (element[automationObject.JVPCProperty].toString() === "Y") {
            let JVPC = document.createElement("span");
            JVPC.classList.add("badge");
            JVPC.classList.add("bg-danger");
            JVPC.classList.add("rounded-pill");
            JVPC.setAttribute("id", element["ID"].toString());
            let jv = document.createTextNode("JV PC");
            JVPC.appendChild(jv);
            listMembers.appendChild(JVPC);
            if (element[automationObject.JVPCProperty].toString() === "Y") {
              let jv = document.createTextNode(
                element[automationObject.EAPCProperty].toString()
              );

              // JV EA Dict mapping to show arrow
              let temp_dict = {
                jv: element["ID"].toString(),
                ea: "des" + element["ID"].toString(),
              };

              automationObject.jv_map_list_with_dict.push(temp_dict);
              // EAPC.appendChild(jv);
              // listMembers.appendChild(EAPC);

              // Updating the JV PC mapping list in the respective area
              console.log("Got EA");
              document.getElementById("mapping_name").innerHTML = "JV Mapping";
              let jv_mapping_item = document.createElement("li");
              console.log("Adding JV member in the mapping area");

              let jv_a_link = document.createElement("a");
              let link_data = document.createTextNode(element["ID"].toString());
              jv_a_link.appendChild(link_data);
              jv_a_link.setAttribute("href", "#" + element["ID"].toString());
              jv_a_link.setAttribute("id", "des" + element["ID"].toString());
              let jv_mem = document.createTextNode(
                "  " + element[automationObject.EAPCProperty].toString()
              );

              let EAPC = document.createElement("span");
              EAPC.classList.add("badge");
              EAPC.classList.add("bg-success");
              EAPC.classList.add("rounded-pill");
              EAPC.classList.add("spacingg");
              let content = document.createTextNode("EA PC");
              EAPC.appendChild(content);

              jv_mapping_item.appendChild(jv_a_link);
              jv_mapping_item.appendChild(jv_mem);
              jv_mapping_item.appendChild(EAPC);
              jv_mapping_list.appendChild(jv_mapping_item);
              automationObject.jv_count += 1;
              let sad_face = document.getElementById("sad-face");
              sad_face.style.display = "none";
            }
          }
        } catch (error) {
          console.log(error);
        }

        listOrder.appendChild(listMembers);
        checkCount++;
        if (
          automationObject.masterDataOutput.filter(
            this.findingWhetherItIsAParent
          )
        ) {
          // console.log("parent found");
          listMembers.appendChild(
            this.determineTheTree(element["ID"].toString())
          );
        }
      }

      document.getElementById("valuer2").innerHTML =
        automationObject.totalBaseMember.toString() + " members";
    });

    let jv_mapping_div = document.getElementById("jv_mapping");
    jv_mapping_div.appendChild(jv_mapping_list);
    console.log(automationObject.jv_count);
    console.log(automationObject.jv_count_check);
    let useless = document.createElement("span");
    
    return checkCount > 0 ? listOrder : useless;
  }

  // Generate arrow:
  arrowFunction() {
    try {
      let mappingArrayLength = automationObject.jv_map_list_with_dict.length;
      for (let i = 0; i < mappingArrayLength; i++) {
        var myLine = new LeaderLine(
          document.getElementById(
            automationObject.jv_map_list_with_dict[i]["ea"]
          ),
          document.getElementById(
            automationObject.jv_map_list_with_dict[i]["jv"]
          )
        );
        myLine.setOptions({
          color: "#0099ff",
        });

        myLine.hide();

        //myLine.show('fade', { duration: 300, timing: "linear" });
        automationObject.lineVariables.push(myLine);
        document.getElementById("showMappingLinks").checked = true;
      }
      // automationObject.jv_map_list_with_dict = [];
    } catch (e) {}
  }

  removeArrowFunction() {
    for (let i = 0; i < automationObject.lineVariables.length; i++) {
      automationObject.lineVariables[i].remove();
    }
    automationObject.lineVariables = [];
  }

  hideArrowFunction() {
    for (let i = 0; i < automationObject.lineVariables.length; i++) {
      automationObject.lineVariables[i].hide();
    }
  }

  showArrowFunction() {
    for (let i = 0; i < automationObject.lineVariables.length; i++) {
      automationObject.lineVariables[i].show();
    }
  }

  //myLine.position()
  reArrowFunction() {
    for (let i = 0; i < automationObject.lineVariables.length; i++) {
      automationObject.lineVariables[i].position();
    }
  }

  // Function to fetch the master data from the user
  async getMasterDataFromUser(data) {
    //console.log("Fetching the master data from the user....");
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
  }

  fetchAddOnMapping() {
    let selectionMember = document.getElementById("dimensionAdd-on-mapping");
    while (selectionMember.hasChildNodes()) {
      selectionMember.removeChild(selectionMember.firstChild);
    }

    let openMember = document.createElement("option");
    openMember.value = "select";
    openMember.innerHTML = "--- select ---";
    selectionMember.appendChild(openMember);

    automationObject.dimensionMappingList[this.dimension].forEach((element) => {
      let optionElement = document.createElement("option");
      optionElement.value = element;
      optionElement.innerHTML = element;
      optionElement.dataToken = element;
      selectionMember.appendChild(optionElement);
    });
  }

  updateStacks() {
    let selectionMember = document.getElementById("currency-stack");
    while (selectionMember.hasChildNodes()) {
      selectionMember.removeChild(selectionMember.firstChild);
    }

    for (let i = 0; i < automationObject.currencyList.length; i++) {
      let span_currency = document.createElement("span");
      span_currency.classList.add("badge");
      span_currency.classList.add("bg-primary");
      //span_currency.classList.add("rounded-pill");
      span_currency.classList.add("spacingg");
      let content = document.createTextNode(automationObject.currencyList[i]);
      span_currency.appendChild(content);
      document.getElementById("currency-stack").appendChild(span_currency);
    }

    let selectionMember2 = document.getElementById("company-stack");
    while (selectionMember2.hasChildNodes()) {
      selectionMember2.removeChild(selectionMember2.firstChild);
    }

    for (let i = 0; i < automationObject.companyList.length; i++) {
      let span_company = document.createElement("span");
      span_company.classList.add("badge");
      span_company.classList.add("bg-primary");
      //span_company.classList.add("rounded-pill");
      span_company.classList.add("spacingg");
      let content = document.createTextNode(automationObject.companyList[i]);
      span_company.appendChild(content);
      document.getElementById("company-stack").appendChild(span_company);
    }
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
  // showPopupAlert("Uploading and Processing the Dimension... please wait");
  let dimension = document.getElementById("masterData").value;

  document.getElementById("showdim").classList.toggle("anim-typewriter");
  document.getElementById("showdim").innerHTML = dimension;
  document.getElementById("showdim").classList.toggle("anim-typewriter");

  //document.getElementById("showdim1").innerHTML = dimension;
  //document.getElementById("showdim2").innerHTML = dimension;
  automationObject = new AutomationScript(dimension);
  if (dimension === "Select the master data template") {
    alert("Select the master data dimension template from the list!");
    return;
  }
  if (document.getElementById("uploadedFile").files[0]) {
    automationObject.getMasterDataFromUser(
      document.getElementById("uploadedFile").files[0]
    );
  }
  //hidePopupAlert();
  if (automationObject.dimension === "ENTITY") {
    document.getElementById("entity-related-stacks").style.display = "block";
  } else {
    document.getElementById("entity-related-stacks").style.display = "none";
  }
  processMasterData();
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
  //showPopupAlert("Processing the dimension, please wait....");
  document.getElementById("showdim").classList.toggle("anim-typewriter");
  let outputArea = document.getElementById("outputarea");
  //automationObject.generateIcons(outputArea);
  automationObject.populateParentList();
  //automationObject.fetchAddOnMapping();
  //alphabetizeList("select.parenth1select option");
  hidePopupAlert();
  alert("Data has been processed successfully");
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
  automationObject.removeArrowFunction();
  let outputarea = document.getElementById("outputarea");
  automationObject.totalBaseMember = 0;
  document.getElementById("showMember").innerHTML = document
    .getElementById("parentmemberselect")
    .value.toString();
  let selectionMember = outputarea;
  while (selectionMember.hasChildNodes()) {
    selectionMember.removeChild(selectionMember.firstChild);
  }

  let jvArea = document.getElementById("jv_mapping");
  while (jvArea.hasChildNodes()) {
    jvArea.removeChild(jvArea.firstChild);
  }

  let divmember = document.createElement("div");
  let sad_face = document.getElementById("sad-face");
  sad_face.style.display = "block";
  document.getElementById("mapping_name").innerHTML = "";
  divmember.appendChild(
    automationObject.determineTheTree(
      document.getElementById("parentmemberselect").value
    )
  );
  document.getElementById("showMappingDiv").style.display = "block";
  outputarea.appendChild(divmember);
  loadFolder();
  automationObject.showArrowFunction();
  automationObject.updateStacks();
  automationObject.currencyList = [];

  automationObject.arrowFunction();
  automationObject.jv_map_list_with_dict = [];
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
        automationObject.hideArrowFunction();
        $(this).siblings("ul").slideToggle("slow");
        e.preventDefault();
        //automationObject.removeArrowFunction();
        document.getElementById("showMappingDiv").style.display = "none";
      });
    });
  });
}

function toggleDesign() {
  document.getElementById("showdim").classList.toggle("anim-typewriter");
}

function updateSearchItemInParent() {
  document.getElementById("parentmemberselect").value =
    document.getElementById("searchArea").value;
}

function toggleMappingView() {
  let member = document.getElementById("showMappingLinks");
  if (member.checked == false) {
    automationObject.hideArrowFunction();
  } else {
    automationObject.showArrowFunction();
  }
}
