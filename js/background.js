var isAutoRun = false;

var totalRequest = {};
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    
    if (request === "checkIsAutoRun") {
        sendResponse(isAutoRun);
    } else if (request === "stop" ){
        isAutoRun = false;
        xmlhttp = new XMLHttpRequest()
        console.log(totalRequest);
        xmlhttp.open("POST", "http://127.0.0.1:8000/local1000/urls1000/", true)
        // xmlhttp.open("POST", "http://127.0.0.1:8081/startDownload/", true)
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState==4) {
                if (xmlhttp.status==200) {
                    console.log("http://127.0.0.1:8081/startDownload/ return " 
                        + xmlhttp.responseText)
                }
            }
        }
        xmlhttp.send(JSON.stringify(totalRequest));
        totalRequest = {};
    } else {
        var pageInfo = JSON.parse(request);
        isAutoRun = true;
        if (totalRequest["title"] === undefined) {
            totalRequest["title"] = pageInfo["title"];
            totalRequest["imgSrcArray"] = pageInfo["imgSrcArray"];
        } else if (totalRequest["title"] === pageInfo["title"]) {
            totalRequest["imgSrcArray"] = totalRequest["imgSrcArray"].concat(pageInfo["imgSrcArray"]);
        }
        
        sendResponse(null);
    }
    
});
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {
        code: "doTask()"
    }, function() {console.log("callback");}

    );
    
});
