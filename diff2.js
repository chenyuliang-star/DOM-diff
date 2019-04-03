


const REMOVE = "remove";
const INSERT = "insert";

class Element {
    constructor(tagname, key, children) {
        this.tagname = tagname;
        this.key = key;
        this.children = children;
    }
    render () {
        const tag = document.createElement(this.tagname); //生成标签
        tag.setAttribute("key", this.key); //设置key属性
        tag.innerHTML = this.children;
        return tag;
    }
}

function el(tagname, key, children) {
    return new Element(tagname, key, children);
}

const virtualDOM1 = [
    el("li", "a", "a"),
    el("li", "b", "b"),
    el("li", "c", "c"),
    el("li", "e", "e"),
    el("li", "f", "f"),
]
const virtualDOM2 = [
    // el("li", "f", "f"),
    el("li", "b", "b"),
    el("li", "a", "a"),
    el("li", "c", "c"),
    el("li", "g", "g"),
    el("li", "e", "e")
]

const ul = document.createElement("ul");

virtualDOM1.forEach( (item, index) => {
    ul.appendChild(item.render());
})


const patches = diff(virtualDOM1, virtualDOM2);


function diff(oldTree, newTree) { //根据key值
     //1：剔除oldTree中在newTree已经没有的节点
     const patch = []; //保存差异对象
     const newKeys = newTree.map((item) => (item.key));
     let oldIndex = 0;
     while (oldIndex < oldTree.length) {
         const oldKey = oldTree[oldIndex].key;
         if (!newKeys.includes(oldKey)) { //如果没有，那么就应该剔除
            patch.push(remove(oldIndex)); //移除此处的节点
            oldTree.splice(oldIndex, 1);
         } else {
             oldIndex++;
         }
     }

     oldIndex = 0;
     let newIndex = 0;
     while (newIndex < newKeys.length) { //对oldTree进行调整
         const oldKey = (oldTree[oldIndex] || {}).key;
         const newKey = (newTree[newIndex] || {}).key;

         if (!oldKey || oldKey !== newKey) { //如果已经到底部了，没有key了
            patch.push(insert(newIndex, newKey))
            newIndex++;
         } else  {
             newIndex++;
             oldIndex++;
         }
     }

     while(oldIndex++ < oldTree.length) { //为了除去其他
         patch.push(remove(newIndex));
     }

     function remove(index) {
         return { type: REMOVE, index }
     }
     function insert(index, newKey) {
         return { type: INSERT, index, node: el("li", newKey,   newKey) }
     }

     return patch;
}


console.log(patches)


function doPatch(root, patches) {
    console.log(patches)
    console.log(root.childNodes)
    patches.forEach( (item) => {
        switch (item.type) {
            case REMOVE: {
                const oldChild = root.childNodes[item.index];
                if (oldChild) {
                    root.removeChild(oldChild); //如果还在，那么就移走
                }
                break;
            }
            case INSERT: {
                const oldChild = root.childNodes[item.index];
                console.log(item.node)
                if (oldChild) { //如果还在的话，那么就插到前面去
                    root.insertBefore(  item.node.render(), oldChild );
                } else {
                    root.appendChild( item.node.render());
                }
                break;
            }
            default : break;
        }
    })
}

document.getElementById("root").appendChild(ul)


setTimeout( () => {
    doPatch(ul, patches);
}, 2000)