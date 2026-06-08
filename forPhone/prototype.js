const japaneseDay = ["日", "月", "火", "水", "木", "金", "土"];

const today = new Date();
const year = document.getElementById("year");
const month = document.getElementById("month");
const generate = document.getElementById("generate");
const openLine = document.getElementById("openLine");
const output = document.getElementById("output");

let dayOfWeek = 0;
let half = 1;
let lastdate = 20;

let yearSelect = document.getElementById("year");
let thisYear = document.createElement("option");
thisYear.value = today.getFullYear();
thisYear.text = today.getFullYear();

let nextYear = document.createElement("option");
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
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
    showShift();
});

// LINEを開く
openLine.addEventListener("click", function () {
    location.href = "https://line.me/R/msg/text/?" + encodeURIComponent(output.value);
});

// 入力欄の生成
function addDate() {
    date();
    let outputDay = dayOfWeek;
    let parent = document.getElementById("left");
    for (let i = half; i <= lastdate.getDate(); i++) {
        var formRow = document.createElement("div");
        formRow.setAttribute("class", "inputRow")
        
        if(i == half + 9){
            parent = document.getElementById("right");
        }

        parent.append(formRow);

        var dateLabel = document.createElement("label");
        var newContent = document.createTextNode(i + "(" + japaneseDay[outputDay] + ")");
        dateLabel.appendChild(newContent);
        formRow.append(dateLabel);

        var inputStart = document.createElement("input");
        inputStart.setAttribute("type", "text");
        inputStart.setAttribute("class", "input");
        inputStart.setAttribute("id", i + "Start");
        inputStart.setAttribute("placeholder", " OFF ");
        inputStart.setAttribute("inputmode", "numeric");
        formRow.append(inputStart);

        var rightTo = document.createElement("label");
        rightTo.appendChild(document.createTextNode("～"));
        formRow.append(rightTo);

        var inputEnd = document.createElement("input");
        inputEnd.setAttribute("type", "text");
        inputEnd.setAttribute("class", "input");
        inputEnd.setAttribute("id", i + "End");
        inputEnd.setAttribute("inputmode", "numeric");
        formRow.append(inputEnd);

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
    document.querySelectorAll(".inputRow").forEach(el => el.remove());
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

// 入力後，自動でフォーカス遷移
window.addEventListener("keyup", event => {
    let focusNow = document.activeElement.id;

    if ((focusNow.includes("Start") || focusNow.includes("End")) && document.getElementById(focusNow).value > 250) {
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
        }
        
        document.getElementById(focusNow).focus();
    }
});
