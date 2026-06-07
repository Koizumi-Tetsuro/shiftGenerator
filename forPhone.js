const japaneseDay = ["日", "月", "火", "水", "木", "金", "土"];

const today = new Date();
const year = document.getElementById("year");
const month = document.getElementById("month");
const generate = document.getElementById("generate");
const copy = document.getElementById("copy");
const output = document.getElementById("output");

var dayOfWeek = 0;
var half = 1;
var lastdate = 20;

var yearSelect = document.getElementById("year");
var thisYear = document.createElement("option");
thisYear.value = today.getFullYear();
thisYear.text = today.getFullYear();

var nextYear = document.createElement("option");
nextYear.value = today.getFullYear() + 1;
nextYear.text = today.getFullYear() + 1;

yearSelect.add(thisYear);
yearSelect.add(nextYear);

setmonth();
addDate();

// 期間に変更があった場合に更新
document.querySelectorAll(".select").forEach(select => {
    select.addEventListener("change", event => {
        date();
        reset();
    });
});

// 確定ボタン押下でシフト生成
generate.addEventListener("click", function () {
    showShift();
});

// コピーしてLINEを開く
copy.addEventListener("click", function () {
    navigator.clipboard.writeText(output.value);
    window.open("https://line.me/R/msg/text/", "_blank");
});

// 入力欄の生成
function addDate() {
    date();
    let outputDay = dayOfWeek;
    for (let i = half; i <= half + 8; i++) {
        var formRow = document.createElement("div");
        formRow.setAttribute("class", "formRow");
        var parentDiv = document.getElementById("inputForm");
        parentDiv.insertBefore(formRow, generate);

        var leftDate = document.createElement("label");
        var newContent = document.createTextNode(i + "(" + japaneseDay[outputDay] + ")");
        leftDate.appendChild(newContent);
        formRow.insertBefore(leftDate, formRow.firstChild);

        var leftStart = document.createElement("input");
        leftStart.setAttribute("type", "text");
        leftStart.setAttribute("class", "input");
        leftStart.setAttribute("id", i + "Start");
        leftStart.setAttribute("placeholder", " OFF ");
        leftStart.setAttribute("inputmode", "numeric");
        formRow.insertBefore(leftStart, leftDate.nextSibling);

        var rightTo = document.createElement("label");
        rightTo.appendChild(document.createTextNode("～"));
        formRow.insertBefore(rightTo, leftStart.nextSibling);

        var leftEnd = document.createElement("input");
        leftEnd.setAttribute("type", "text");
        leftEnd.setAttribute("class", "input");
        leftEnd.setAttribute("id", i + "End");
        leftEnd.setAttribute("inputmode", "numeric");
        formRow.insertBefore(leftEnd, rightTo.nextSibling);

        if (i + 9 <= lastdate.getDate()) {
            var rightDate = document.createElement("label");
            var newContent = document.createTextNode("　" + (i + 9) + "(" + japaneseDay[(outputDay + 2) % 7] + ")");
            rightDate.appendChild(newContent);
            formRow.insertBefore(rightDate, leftEnd.nextSibling);

            var shiftStart = document.createElement("input");
            shiftStart.setAttribute("type", "text");
            shiftStart.setAttribute("class", "input");
            shiftStart.setAttribute("id", (i + 9) + "Start");
            shiftStart.setAttribute("placeholder", " OFF ");
            shiftStart.setAttribute("inputmode", "numeric");
            formRow.insertBefore(shiftStart, rightDate.nextSibling);
            
            var leftTo = document.createElement("label");
            leftTo.appendChild(document.createTextNode("～"));
            formRow.insertBefore(leftTo, shiftStart.nextSibling);
            
            var shiftEnd = document.createElement("input");
            shiftEnd.setAttribute("type", "text");
            shiftEnd.setAttribute("class", "input");
            shiftEnd.setAttribute("id", (i + 9) + "End");
            shiftEnd.setAttribute("inputmode", "numeric");
            formRow.insertBefore(shiftEnd, leftTo.nextSibling);
        }

        outputDay = (outputDay + 1) % 7;
    }
}

// 現在の日にちから提出するシフト期間を設定
function setmonth() {
    const selected = document.getElementById("selectHalf");
    year.value = today.getFullYear();
    month.value = today.getMonth() + 1;

    if (today.getDate() > 5 && today.getDate() <= 20) {
        month.value = (Number(month.value) % 12) + 1;
        selected.value = "first";
        if (today.getMonth() == 11) {
            year.value++;
        }
    } else {
        if (today.getDate() > 20) {
            month.value = (Number(month.value) % 12) + 1;
            if (today.getMonth() == 11) {
                year.value++;
            }
        }
        selected.value = "second";
    }
}

// 初期化
function reset() {
    document.querySelectorAll(".formRow").forEach(formRow => formRow.remove());
    addDate();
}

// 入力値を時刻表示(hh:mm)へ変換
function splitTime(value) {
    if (!Number.isNaN(Number(value)) && (value >= 0 && value <= 2400)) {
        let str = String(Number(value));
        return (str.slice(0, -2) + ":" + str.slice(-2));
    } else {
        return "不正";
    }
}

// 生成スケジュール初日，最終日設定
function date() {
    half = document.getElementById("selectHalf").value == "first" ? 1 : 16;
    var firstdate = new Date(year.value, month.value - 1, half);
    dayOfWeek = firstdate.getDay();
    var last = (half == 1 ? 15 : 0);
    lastdate = new Date(year.value, month.value - last / 15, last);
}

// 希望シフトを出力
function showShift() {
    let outputDay = dayOfWeek;
    output.value = (month.value + "月" + (document.getElementById("selectHalf").value == "first" ? "前半" : "後半") + "の希望シフトです\n\n");
    let inputStart = "";
    let inputEnd = "";

    for (let i = half; i <= lastdate.getDate(); i++) {
        if (document.getElementById(i + "Start").value == "") {
            inputStart = "OFF";
            inputEnd = "";
        } else {
            inputStart = splitTime(document.getElementById(i + "Start").value) + "～";
            inputEnd = splitTime(document.getElementById(i + "End").value);
        }
        output.value += (i + "(" + japaneseDay[outputDay] + ")" + inputStart + inputEnd + ((i < lastdate.getDate()) ? "\n" : ""));
        outputDay = (outputDay + 1) % 7;
    }
}

// 入力欄のフォーカス遷移
window.addEventListener("keydown", event => {
    let focusNow = document.activeElement.id;

    // Enterキー押下時
    if (event.key == "Enter") {
        if (focusNow.includes("Start")) {
            if (document.getElementById(focusNow).value == "") {
                focusNow = Number(focusNow.replace("Start", "")) + 1 + "Start";
            } else {
                focusNow = focusNow.replace("Start", "") + "End"
            }
        } else if (focusNow.includes("End")) {
            focusNow = Number(focusNow.replace("End", "")) + 1 + "Start";
        }

        if (focusNow.includes(lastdate.getDate() + 1)) {
            focusNow = generate.id;
            if (event.key !== "ArrowRight") {
                showShift();
            }
        }
        document.getElementById(focusNow).focus();
    }
});
