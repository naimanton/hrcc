// ==UserScript==
// @name         hr
// @namespace    http://tampermonkey.net/
// @version      2024-11-23
// @description  try to take over the world!
// @author       You
// @match        https://lk.contact-centre.ru/hr_manager/db
// @icon         https://www.google.com/s2/favicons?sz=64&domain=contact-centre.ru
// @grant        none
// ==/UserScript==
let l = console.log;
setTimeout(a, 3000);
function a (){
    //alert('lgo');
    var inputsSlot = document.querySelector('div.v-card__text.py-0.datatable_edit_form_items').querySelectorAll('.v-input__slot');
    let i = 0
    var inter = setInterval(() => {
        if (i > inputsSlot.length-2) {
            clearInterval(inter)
            b()
        }
        inputsSlot[i++].click()
    }, 10)


}
function pause(intervalMs) {
    return new Promise(resolve => {
      setTimeout(resolve, intervalMs);
    });
  }
async function b() {
  var listboxes = document.querySelectorAll('[role=listbox]');
    l(listboxes);
    var used = [];
    for (var li of listboxes) {
      if (li.innerText.includes('араганда')) {
        for (var lis of li.children) {
           if (lis.innerText.includes('араганда')) {
               lis.click();
               used.push(li)
               break;
           }
        }
      }
    }
    await pause(1000);
    for (var li of document.querySelectorAll('[role=listbox]')) {
      if (li.innerText.includes('араганда') && !used.includes(li)) {
        for (var lis of li.children) {
           if (lis.innerText.includes('араганда')) {
               lis.click();
               used.push(li)
               break;
           }
        }
      }
    }
    await pause(1000);
    for (var li of document.querySelectorAll('[role=listbox]')) {
      if (li.innerText.includes('hh.кz отклики') && !used.includes(li)) {
        for (var lis of li.children) {
           if (lis.innerText.includes('hh.кz отклики')) {
               lis.click();
               used.push(li)
               break;
           }
        }
      }
    }
    await pause(1000);
    for (var li of document.querySelectorAll('[role=listbox]')) {
      if (li.innerText.includes('оператор') && !used.includes(li)) {
        for (var lis of li.children) {
           if (lis.innerText.includes('оператор')) {
               lis.click();
               used.push(li)
               alert('фсе')
               break;
           }
        }
      }
    }
}
