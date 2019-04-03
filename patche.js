
import util from "./util";

//利用差异对象来进行调整
const REMOVE = "remove"; //节点被移走
const ATTRS = "attrs"; //节点属性变化
const REPLACE = "replace";
const TEXT = "text";
const allPatches;
let index = 0;


function patch (tree, patches) {
    allPatches = patches;
    walk(tree);
}


function walk(node) {
    let currenPatch = allPatches[index++]; //给每个节点找到对应得差异对象
    const nodeChild = node.chidlNodes;
    nodeChild.forEach( (item, index) => {
        walk(item); //去迭代子节点
    })
    if (currenPatch) doPatch(node, currenPatch); //根据差异对象进行修改
}

function doPatch(node, patches) {
    patches.forEach( (item, index) => {
        switch (patches.type) {
            case ATTRS: {
                const newAttrs = patches.attrs;
                for (const key in newAttrs) {
                   if (newAttrs[key]) util.setAttribute(node, key, newAttrs[key]);
                   else node.removeAttribute(key); //如果没有，那么就应该移走
                }
                break;
            }
            case TEXT: {
                node.textContent = patches.newValue;
                break;
            }
            case REMOVE: {
                node.parentNode.removeChild(node);
                break;
            }
            case REPLACE: {
                const newNode = newValue instanceof Element ? newValue.render() : document.createTextNode(newValue);
                node.parentNode.removeChild(newNode, node);
                break
            }
            default : break;
        }
    })
}