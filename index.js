/*
* author: sweet
* date: 2021年8月24日
* descript: 实现一个简易的ToDoList
* */
let ul_todo = document.getElementById("todo");
let ul_finish = document.getElementById("finish");
let inputPlan = document.getElementById("input");
let buttonPlan = document.getElementById("header-right-button");

/*
 * 添加计划
 * @param {localStorage中的key} e
 * @param {计划内容} text
 * @param {计划完成状态} status
 */
function sw_addPlan(e, text, status) {
    let todoText;
    let date;
    if (e) { // 非首次加载，赋参数值
        date = e;
        todoText = text;
    } else { // 首次加载赋新值
        todoText = inputPlan.value;
        if (!todoText) {
            return;
        }
        date = "sweet-" + Date.now();
    }
    let li = document.createElement("li");
    let input = document.createElement("input");
    let p = document.createElement("p");
    let img = document.createElement("img");
    li.id = date;
    input.type = "checkbox";
    input.className = "checkbox";
    p.className = "todo-text";
    p.innerHTML = todoText;
    img.src = "./resources/trash.png";
    img.className = "deletePlan";
    input.addEventListener("change", sw_handleChange);
    img.addEventListener("click", sw_deletePlan);
    if (status) {
        ul_finish.appendChild(li);
        input.checked = true;
    } else {
        ul_todo.appendChild(li);
    }
    li.appendChild(input);
    li.appendChild(p);
    li.appendChild(img);
    if (!e) {
        let storageData = {
            text: todoText,
            finished: false
        }
        localStorage.setItem(date, JSON.stringify(storageData));
    }
    if (localStorage.getItem("firstLoad") === 'true') {
        localStorage.setItem("firstLoad", false);
    }
}

/*
 * 处理输入框事件
 */
function sw_handleSubmit() {
    sw_addPlan();
    inputPlan.value = ''; //清空输入框
}

/*
 * 处理复选框状态修改
 */
function sw_handleChange(e) {
    //得到复选框的父节点，然后把它加给finish
    let li = e.target.parentNode;
    let ul = li.parentNode.id;
    let p_node = li.children[1];
    let data = {
        text: p_node.innerHTML,
        finished: true
    }
    if (ul === 'todo') {
        ul_todo.removeChild(li);
        ul_finish.appendChild(li);
    } else {
        ul_finish.removeChild(li);
        ul_todo.appendChild(li);
        data.finished = false;
    }
    localStorage.setItem(li.id, JSON.stringify(data));
}

/*
 * 处理添加计划按钮点击事件
 */
function sw_handleClick() {
    sw_addPlan();
    inputPlan.value = ''; //清空输入框
}

/*
 * 删除计划
 */
function sw_deletePlan(e) {
    let li = e.target.parentNode;
    let ul = li.parentNode.id;
    if (ul === 'todo') {
        ul_todo.removeChild(li);
    } else {
        ul_finish.removeChild(li);
    }
    localStorage.removeItem(li.id); //也要从localStorage中删除
}

/*
 * 监听键盘按下
 */
function debounce(fn) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.call(this, arguments);
        }, 200);
    }
}

/*
 *处理键盘按下
 */
function handleEnter(args) {
    let e = args[0];
    if (e.keyCode === 13) {
        sw_handleSubmit();
    }
}

/**
 * 判断页面是否重加载，便于用户刷新页面后值仍存在
 */
function sw_firstLoad() {
    if (localStorage.getItem("firstLoad") === 'false') { //页面重新加载
        for (let i = 0; i < localStorage.length; i++) { //将localStorage中的值给页面
            let key = localStorage.key(i);
            if (key.indexOf("sweet") !== -1) { //拿到存储数据
                let data = JSON.parse(localStorage.getItem(key));
                sw_addPlan(key, data.text, data.finished);
            }
        }
        inputPlan.value = ''; //清空输入框
    } else { //首次加载页面为空
        localStorage.setItem("firstLoad", true);
    }
}

sw_firstLoad();
inputPlan.addEventListener("keydown", debounce(handleEnter));
buttonPlan.addEventListener("click", sw_handleClick);