/**
 * 所有的可选项
 */
var options = [
    { text: "不限", value: -1 },
    { text: "100万", value: 100 },
    { text: "200万", value: 200 },
    { text: "300万", value: 300 },
    { text: "400万", value: 400 },
    { text: "500万", value: 500 },
    { text: "600万", value: 600 },
    { text: "700万", value: 700 },
    { text: "800万", value: 800 },
    { text: "900万", value: 900 },
    { text: "1000万", value: 1000 },
    { text: "1100万", value: 1100 },
    { text: "1200万", value: 1200 },
    { text: "1300万", value: 1300 },
];
/**
 * 配置对象
 */
var config = {
    ul: document.getElementById("selectContainer"),
    h1: document.getElementById("title"),
    liWidth: 100, //每个li的宽度
    containerWidth: 800 //容器宽度
}
//最大的marginLeft 
config.maxLeft = config.containerWidth / 2;
//最小的marginLeft
config.minLeft = config.maxLeft - (options.length - 1) * config.liWidth

/**
 * 根据提供的options数组，生成li，并将其加入到ul中
 */
function createLis() {
    for (var i = 0; i < options.length; i++) {
        var opt = options[i]; //拿到一个选项对象
        var li = document.createElement("li");
        li.style.width = config.liWidth + "px";//手动设置li的宽度
        li.innerHTML = "<span>" + opt.text + "</span><i></i>";
        //将选项的值放入元素的value属性中（自定义属性）
        li.setAttribute("value", opt.value);
        config.ul.appendChild(li);
    }
}

/**
 * 设置ul的宽度
 */
function setUlWidth() {
    var width = config.liWidth * options.length; //得到ul的宽度
    config.ul.style.width = width + "px";
}

/**
 * 设置目前选中的值，该函数会导致界面发生变化
 * @param {*} value 
 */
function setChoose(value) {
    //得到选中的下标
    var index = -1;
    for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        if (opt.value === value) {
            index = i; //记录找到的下标
            break; //找到了就不用找了
        }
    }
    if (index === -1) {
        //设置的value值不存在，什么都不做
        return;
    }
    //计算ul元素的margin-left
    //ul元素的margin-left属性，在0.5秒内完成变化
    config.ul.style.transition = "margin-left 0.5s";
    var marginLeft = config.containerWidth / 2 - index * config.liWidth;
    config.ul.style.marginLeft = marginLeft + "px";
}

/**
 * 根据ul当前的margin-left的值，获取目前选中的option对象
 */
function getChoose() {
    var marginLeft = parseFloat(config.ul.style.marginLeft);
    //根据margin-left的值，计算出当前选中的下标
    var index = (config.maxLeft - marginLeft) / config.liWidth;
    index = Math.round(index); //四舍五入
    return options[index];
}

/**
 * 注册拖动事件
 */
function regEvent() {
    //选中文本事件
    config.ul.onselectstart = function () {
        return false; //阻止默认行为
    }
    config.ul.onmousedown = function (e) {
        //移除过渡效果
        this.style.transition = "";//this->ul
        var x = e.pageX; //记录按下时鼠标的横坐标
        var marginLeft = parseFloat(this.style.marginLeft); //this->ul
        window.onmousemove = function (e) {
            var newX = e.pageX; //记录鼠标移动时的横坐标
            var disX = newX - x; //相对于鼠标按下时移动的距离
            var newLeft = marginLeft + disX; //计算出新的marginLeft
            if (newLeft > config.maxLeft) {
                newLeft = config.maxLeft;
            }
            else if (newLeft < config.minLeft) {
                newLeft = config.minLeft;
            }
            config.ul.style.marginLeft = newLeft + "px";
            setTitle();
        }

        window.onmouseup = function (e) {
            window.onmousemove = null;
            //归位
            var opt = getChoose();//拿到选中的对象
            setChoose(opt.value); //设置选中的值
        }
    }
}

/**
 * 设置标题
 */
function setTitle() {
    var opt = getChoose();
    config.h1.innerText = "选中的文本：" + opt.text + "，选中的值：" + opt.value;
}


/**
 * 初始化函数
 */
function init() {
    setUlWidth();
    createLis();
    setChoose(-1);
    regEvent();
    setTitle();
}

init();