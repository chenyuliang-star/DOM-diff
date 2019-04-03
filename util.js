

const util = {
    setAttribute : (dom, key, value) => {
        switch (key) {
            case "style": {
                dom.style.cssText = value; //如果是style,那么就赋值给cssText
                break;
            }
            case "value": {
                if (dom.tagname.toLowerCase() === "input" || dom.tagname.toLowerCase() === "textarea") {
                    dom.value = value; //如果是input或者textarea 那么就修改value值
                } else {
                    dom.setAttribute(key, value);
                }
                break;
            }
            default : {
                dom.setAttribute(key, value);
                break;
            }
        }
    },
    diffAttrs (oldAttrs, newAttrs) {
        const attrs = {}; //用来保证改变
        for (const key in oldAttrs) { //找出与原来不同的 
            if (oldAttrs[key] !== newAttrs[key]) {
                attrs[key]  = newAttrs;
            }
        }
        for (const key in newAttrs) {//找出新添加的属性
            if (!oldAttrs.hasOwnProperty(key)) { //如果是新属性，那么就得添加
                attrs[key] = newAttrs[key];
            }
        }
        return attrs;
    }
}

export default util;