function doTask() {
    Task.init();
    var pageInfo = Task.getPageInfo();
    const sending = browser.runtime.sendMessage(
        pageInfo.toJSONString()
    );
    sending.then(
        function(response) {
            if (response == "checkError") {
                doTask();
            }
            else if (Task.isLastPage()) {
                window.location.href = Task.getNextUrl();
            }
            else {
                const sending = browser.runtime.sendMessage("stop");
                sending.then(function(response) {});
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
        this.nextTitle = document.getElementsByClassName("fenxianga")[0]
            .getElementsByTagName("a")[0];
        console.log(this.fontElementArray);
        var bigImgDiv = document.getElementsByClassName('big_img')[0];
        this.imgElementArray = bigImgDiv.getElementsByTagName("img");
        console.log(this.imgElementArray);
    },
    "getCurrentTitle": function() {
        return this.getTitleShort(
                new String(document.title)
        );
    },
    "getNextTitle": function() {
        return this.getTitleShort(new String(this.nextTitle.innerHTML));
    },
    "getNextUrl": function() {
        var nextUrl = this.nextTitle.href;
        return nextUrl;
    },
    "getTitleShort": function(titleString) {
        const re = /(([a-zA-Z]|[\u4e00-\u9fa5])*)((\[\d\])?)/;
        return titleString.match(re)[1];
    },
    "getPageInfo": function() {
        var imgSrcArray = [];
        var pageInfoObj = {};
        for (var i = 0; i < this.imgElementArray.length; i++) {
            console.log("scan to " + this.imgElementArray[i].src);
            imgSrcArray.push({src:this.imgElementArray[i].src, ref:document.URL});
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
}

console.log("enter content_script.js");
function checkIsAutoRun(autoRunCallback) {
    const sending = browser.runtime.sendMessage("checkIsAutoRun");
    sending.then(
    function(response) {
        var isAutoRun = response;
        if (isAutoRun === true) {
            autoRunCallback();
        }
    });
}

checkIsAutoRun(doTask);

function getTitleShort(titleString) {
    const re = /(([a-zA-Z]|[\u4e00-\u9fa5])*)((\[\d\])?)/;
    return titleString.match(re)[1];
}
