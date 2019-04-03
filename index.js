// import createElement from "./element";
 

 
const virtualDOM1 = createElement("ul", { class: "ul-list" }, [
    createElement("li", { class: "item", name: "cyl" }, ['1']),
    createElement("li", { class: "item" }, ['2']),
    createElement("li", { class: "item" }, ['3']),
    createElement("li", { class: "item" }, ['4'])
]);

const realityDOM1 = virtualDOM1.render();

 
document.getElementById("root").appendChild(realityDOM1);