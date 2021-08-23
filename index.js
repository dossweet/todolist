let data = {};
let unflist = document.getElementById("unf");
let finlist = document.getElementById("fin");

function handleClick(e) {
    let li = e.target.parentNode;
    delete data[li.id];
    localStorage.setItem("data", JSON.stringify(data));
    reRender();
}

/*处理input按钮提交*/
function handleSubmit() {
    let input = document.getElementById("text");
    if (input.value === '') {
        alert("待办内容不能为空！");
        return;
    } else if (input.value.length > 15) {
        alert("15个字以内，不能再多了");
        return;
    }
    let date = Date.now();
    let li = document.createElement("li");
    let p = document.createElement("p");
    let checkbox = document.createElement("input");
    let button = document.createElement("button");
    let buttext = document.createTextNode("删除");
    let text = document.createTextNode(input.value);
    li.id = date;
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.addEventListener("change", handleChange);
    button.addEventListener("click", handleClick);
    button.appendChild(buttext);
    li.appendChild(checkbox);
    p.appendChild(text);
    li.appendChild(p);
    li.appendChild(button);
    unflist.appendChild(li);
    data[date] = {
        text: input.value,
        finished: false
    };
    localStorage.setItem("data", JSON.stringify(data));
    input.value = '';
}

/*监听待办事项状态*/
function handleChange(e) {
    let li = e.target.parentNode
    let key = li.id;
    data[key].finished = e.target.checked;
    localStorage.setItem("data", JSON.stringify(data));
    reRender();
}

/*清空list*/
function clear(list) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

/*重新渲染list*/
function reRender() {
    clear(unflist);
    clear(finlist);
    renderList();
}

/*渲染list列表*/
function renderList() {
    data = JSON.parse(localStorage.getItem("data")) || {};
    for (let key in data) {
        let li = document.createElement("li");
        let p = document.createElement("p");
        let text = document.createTextNode(data[key].text);
        let checkbox = document.createElement("input");
        let button = document.createElement("button");
        let buttext = document.createTextNode("删除");
        li.id = key;
        checkbox.type = "checkbox";
        checkbox.className = "check";
        checkbox.checked = data[key].finished;
        checkbox.addEventListener("change", handleChange);
        button.appendChild(buttext);
        button.addEventListener("click", handleClick);
        p.appendChild(text);
        li.appendChild(checkbox);
        li.appendChild(p);
        li.appendChild(button);
        if (data[key].finished) {
            finlist.appendChild(li);
        } else {
            unflist.appendChild(li);
        }
    }
}

/*固定周期判断键盘是否按下*/
function debounce(fn) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.call(this, arguments);
        }, 200);
    }
}

/*处理键盘回车按下*/
function handleEnter(args) {
    let e = args[0];
    if (e.keyCode === 13) {
        handleSubmit();
    }
}

let input = document.getElementById("text");
let submit = document.getElementById("submit");
window.addEventListener("load", renderList);
submit.addEventListener("click", handleSubmit);
input.addEventListener("keydown", debounce(handleEnter));