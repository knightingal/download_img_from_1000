function doTask() {
    Task.init();
    var pageInfo = Task.getPageInfo();
    chrome.extension.sendMessage(
        pageInfo.toJSONString(),
        function(response) {
            if (response == "checkError") {
                doTask();
            }
            else if (Task.isLastPage()) {
                window.location.href = Task.getNextUrl();
            }
            else {
                chrome.extension.sendMessage("stop", function(response) {});
            }
        }
    );
}

var Task = {
    "fontElementArray": [],
    "pElementArray": [],
    "init": function() {
        this.fontElementArray = [];
        this.pElementArray = [];


        this.fontElementArray = document.getElementsByTagName("font");
        console.log(this.fontElementArray);
        this.pElementArray = document.getElementsByTagName("p");
        console.log(this.pElementArray);
    },
    "getCurrentTitle": function() {
        return this.getTitleShort(
                new String(this.fontElementArray[4].innerHTML)
        );
    },
    "getNextTitle": function() {
        return this.getTitleShort(
                new String(this.fontElementArray[this.fontElementArray.length - 16].innerHTML)
        );
    },
    "getNextUrl": function() {
        var nextUrl = this.fontElementArray[this.fontElementArray.length - 16].parentNode.href;
        return nextUrl;
    },
    "getTitleShort": function(titleString) {
        return new String(titleString.slice(0, -4));
    },
    "getPageInfo": function() {
        var imgSrcArray = [];
        var pageInfoObj = {};
        for (var i = 2; i < this.pElementArray.length; i++) {
            console.log("scan to " + this.pElementArray[i].firstChild.src);
            imgSrcArray.push(this.pElementArray[i].firstChild.src);
        }
        pageInfoObj.imgSrcArray = imgSrcArray;
        pageInfoObj.title = this.getCurrentTitle();
        return pageInfoObj;
    },
    "isLastPage": function() {
        var nextTitle = this.getNextTitle();
        var currentTitle = this.getCurrentTitle();
        return nextTitle.localeCompare(currentTitle) == 0;
    }
    // ,
    // "doTask": function() {
    //     var getInfo = this.getPageInfo();
    //     console.log(getInfo);
    //     self.port.emit("sendPageInfo", getInfo);
    //     if (this.isLastPage() == 0) {
    //         self.port.emit("goToNextPage", this.getNextUrl());
    //     }
    //     else {
    //         self.port.emit("stopAndSendPageInfosToServer");
    //     }
    // }
}

console.log("enter content_script.js");
function checkIsAutoRun(autoRunCallback) {
    chrome.extension.sendMessage("checkIsAutoRun", function(response) {
        var isAutoRun = response;
        if (isAutoRun === true) {
            autoRunCallback();
        }
    });
}

checkIsAutoRun(doTask);

function getTitleShort(titleString) {
    return new String(titleString.slice(0, -4));
}
