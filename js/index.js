var oFileIn;
var oJS;
var dataTable;
var modals;
var verify = false;
var objectWithLesions = {};
$(function () {
    oFileIn = document.getElementById("datasetRAW");
    if (oFileIn.addEventListener) {
        oFileIn.addEventListener('change', filePicked, false);
    }
});

function filePicked(oEvent) {
    document.getElementById('dataTable').innerHTML = ""
    document.getElementById('modalContainer').innerHTML = ""
    document.getElementById('headerTable').innerHTML = ""
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;

    var reader = new FileReader();

    reader.onload = function (e) {
        var data = e.target.result;
        var cfb = XLS.CFB.read(data, { type: 'binary' });
        var wb = XLS.parse_xlscfb(cfb);

        wb.SheetNames.forEach(function (sheetName) {

            var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
            var oJS = XLS.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
            console.log(oJS)
            var tableHeader = document.getElementById('headerTable');
            // var dataTable = document.getElementById('dataTable');

            for (let i = 0; i < oJS[0].length; i++) {
                if (oJS[0][i] === "Slice# polyp Prone") {
                    oJS[0][i] = "Polyp Prone";
                } else if (oJS[0][i] === "Slice# polyp Supine") {
                    oJS[0][i] = "Polyp Supine";
                }
                tableHeader.innerHTML +=
                    "<th>" +
                    oJS[0][i] +
                    "</th>"
            }
            for (let i = 1; i < oJS.length; i++) {
                modals = ""
                dataTable = "<tr data-toggle='modal' data-target='#exampleModal" + oJS[i][0] + "'>"
                for (let j = 0; j < oJS[i].length; j++) {
                    if (oJS[i][j] === undefined) {
                        oJS[i][j] = "-"
                    }
                    dataTable +=
                        "<td>" +
                        oJS[i][j] +
                        "</td>"
                }
                dataTable += "</tr>"
                modals += `
                    <div class="modal fade" id="exampleModal`+ oJS[i][0] + `" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">`+ oJS[i][1] + `</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body" id="bodyData`+ oJS[i][0] + `">
                                    ...
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>`
                document.getElementById('dataTable').innerHTML += dataTable
                document.getElementById('modalContainer').innerHTML += modals

            }
            verify = true;
            setTimeout(function () {
                for (let i = 1; i < oJS.length; i++) {
                    let search = "bodyData" + oJS[i][0]
                    console.log(search)
                    var bodyData = document.getElementById(search);
                    bodyData.innerHTML = oJS[i][0];
                }
                appendDataArrays(oJS)
            }, 3000);
        })

    }
    reader.readAsBinaryString(oFile);
}

function appendDataArrays(oJS) {
    // for (let i = 1; i <= 16; i++) {
    //     for (let j = 1; j <= 5; j++) {
    //         //    let key =  "lesion " + i + "." + j
    //         objectWithLesions["lesion " + i + "." + j] = ""
    //     }
    // }
    for (let i = 1; i < oJS.length; i++) {

        for (let indexL1 = 1; indexL1 <= 16; indexL1++) {
            let lessionArr = [];
            for (let indexL2 = 1; indexL2 <= 5; indexL2++) {
                //    let key =  "lesion " + i + "." + j
                lessionArr[i].push({
                    ["lesion " + indexL1 + "." + indexL2]: 
                        {
                            data: ""
                        }
                })
            }
            Object.assign(lessionArr, objectWithLesions);
        }
        for (let j = 4; j < oJS[i].length; j++) {
                // objectWithLesions[i].lesion.data = oJS[i][j]s
        }
    }
    console.log(objectWithLesions)

}