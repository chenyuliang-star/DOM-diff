import util from "./util";


class Element {
    constructor (tagname, attrs, children) {
        this.tagname = tagname; //标记类型
        this.attrs = attrs; //标签上面的属性
        this.children = children; //子元素
    }

    render () { //将虚拟dom渲染成真实dom
        const tag = document.createElement(this.tagname); //生成dom元素
        for (const key in attrs) { //将属性挂载到dom元素上
            util.setAttribute(tag, key, this.attrs[key]); //考虑到不同的属性，方式不一样，那么就封装一个函数
        }
        this.children.forEach((item, index) => {//对子元素的挂载 注意是递归挂载
            //如果也是element对象，那么就插入子元素的dom
            //如果是文本节点
            const child = item instanceof Element ? item.render() : document.createTextNode(item);
            tag.appendChild(child); //插入子元素
        })
        return tag;
    }
}

function createElement(tagname, attrs, children) {
    return new Element(tagname, attrs, children);
}

export default createElement;
 