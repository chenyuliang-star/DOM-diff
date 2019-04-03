//diff算法，比较俩棵虚拟dom树的差异，返回一个差异对象，用来将原来的虚拟dom树转化成新的虚拟dom树
import util from "./util";

// diff算法
//1： 同层比较
//2： 如果父亲节点的类型不同，那么整个树直接丢弃
//3： 相同类型的兄弟节点，利用Key属性

const REMOVE = "remove"; //节点被移走
const ATTRS = "attrs"; //节点属性变化
const REPLACE = "replace";
const TEXT = "text";
let Index = 0;

function diff(oldTree, newTree) {
    const patches = {}; //用来保存差异的对象
    walk(oldTree, newTree, Index, patches); //递归，按照diff算法的规则来检查
    return  patches; //返回差异对象
}

function diffChildren(oldChild, newChild, patches) {
    if (oldChild instanceof Array) {
        oldChild.forEach( (item, index) => {
            if (newChild) { //去挨个检测子元素，注意这里没有利用key属性，默认匹配时按顺序得
                walk(item, newChild[index], ++Index, patches);
            }
        })
    }
}

function countChild(oldChild) { //计算子元素有多少个节点
    let count = oldChild.length;
    if (oldChild instanceof Array ) {
        oldChild.forEach((item, index) => {
            if (item instanceof Element) { //如果还是element, 那么就应该递归查询
                count += countChild(item);
            } else count++; //如果是文本元素
        })
    }
    return count;
}
function isString(target) {//是否是字符串
    return Object.prototype.toString.call(target) === "[object String]";
}

function walk(oldTree, newTree, index, patches) {
    //index的作用是标记位置，因为遍历整个树是深度遍历，那么index唯一确定，那个节点就确定了。
    const currentPatch = [];
    if (!newTree) { //该节点以被移走
        currentPatch.push({ type: REMOVE, index });
    } else if (isString(oldTree) && isString(newTree)) { //假如是文本元素，
        if (oldTree !== newTree) { //如果是文本，而且不相等，那么就得替换文本
            currentPatch.push({ type: TEXT, newValue: newTree, index})
        }
    } else if (oldTree.tagname === newTree.tagname) { //如果dom元素类型相同
        //1: 查询节点的attrs是否有差异
        const attrs = util.diffAttrs(oldTree.attrs, newTree.attrs);

        if (attrs.length > 0) { //证明需要修改属性
            currentPatch.push({ type: ATTRS, newValue: attrs, index});
        }
        //对于类型相同得节点，我们还需要对其子节点进行检测
        diffChildren(oldTree.children, newTree.children, patches);
    } else { //那就应该替换了
        currentPatch.push({ type: REPLACE, newValue: newTree, index });

        Index += countChild(oldTree.children); //因为当前节点需要替换，所有子元素都不需要进行diff
    }

    if (currentPatch.length > 0) {
        patches[index] = currentPatch;
    }
}


