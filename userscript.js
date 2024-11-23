// ==UserScript==
// @name         hr: contact-centre
// @namespace    http://tampermonkey.net/
// @version      2024-11-23
// @description  try to take over the world!
// @author       Ton
// @match        https://lk.contact-centre.ru/hr_manager/db
// @icon         https://www.google.com/s2/favicons?sz=64&domain=contact-centre.ru
// @grant        none
// ==/UserScript==
const l = console.log;
const qw = l;
const affirm = function (boolean, message) {
  if (boolean) return;
  throw new Error(message);
};
const claim = function (assertionMethod, item) {
  affirm(assertionMethod(item), 'Type error in claim()');
  return item;
};
const attempt = async function (tryCallback, catchCallback) {
  try { await tryCallback(); }
  catch (error) { await catchCallback(error); }
};
const addSafeListener = function (element, eventType, callback) {
  return element.addEventListener(
    eventType, event => {
      attempt(() => callback(event), tools.defaultCatchCallback);
    }
  );
};
const addSafeObserver = function (element, options, callback) {
  const mo = new MutationObserver( (records, mo) => {
    attempt(() => callback(records, mo), tools.defaultCatchCallback);
  });
  mo.observe(element, options);
  return mo;
};
const setSafeInterval = function (callback, intervalMs) {
  return setInterval(attempt.bind(null, callback, tools.defaultCatchCallback), intervalMs);
};
const until = function (method, intervalMs=1000) {
  return new Promise(function (resolve, reject) {
    if (method()) {
        resolve();
        return;
    }
    let counter = 0;
    const intervalId = setInterval(function () {
      if (++counter > 60) {
        clearInterval(intervalId);
        reject(new Error('Превышено время ожидания until.'));
      }
      console.log('until');
      if (!method()) return;
      clearInterval(intervalId);
      resolve();
    }, intervalMs);
  });
};
const pollingSelector = function (element, selector, intervalMs=1000) {
  return new Promise(function (resolve, reject) {
    const resultElement = element.querySelector(selector);
    if (resultElement !== null) {
        resolve(resultElement);
        return;
    }
    let counter = 0;
    const intervalId = setInterval(function () {
      if (++counter > 60) {
        clearInterval(intervalId);
        reject(new Error('Превышено время ожидания pollingSelector.'));
      }
      console.log('optimism polling selector: ', selector)
      const resultElement = element.querySelector(selector);
      if (resultElement === null) return;
      clearInterval(intervalId);
      resolve(resultElement);
    }, intervalMs);
  });
};
const pollingSelectorAll = function (element, selector, len=1, intervalMs=1000) {
  return new Promise(function (resolve, reject) {
    const resultCollection = element.querySelectorAll(selector);
    if (resultCollection.length >= len) {
        resolve(resultCollection);
        return;
    }
    let counter = 0;
    const intervalId = setInterval(function () {
        if (++counter > 60) {
        clearInterval(intervalId);
        reject(new Error('Превышено время ожидания pollingSelectorAll.'));
      }
      console.log('optimism polling selector all: ', selector)
      const resultCollection = element.querySelectorAll(selector);
      if (resultCollection.length < len) return;
      clearInterval(intervalId);
      resolve(resultCollection);
    }, intervalMs);
  });
};
const type = {
  of: item => Object.prototype.toString.call(item).toLowerCase(),
  element: item => item instanceof Element,
  nodeList: item => type.of(item) === '[object nodelist]',
  htmlCollection: item => type.of(item) === '[object htmlcollection]',
  object: item => type.of(item) === '[object object]',
  notEmptyString: item => type.of(item) === '[object string]' && item.length > 0,
};
const tools = {
  defaultCatchCallback(error) {
    alert("Ошибка в юзерскрипте:\n\n" + error.stack);
    console.warn("Ошибка в юзерскрипте:\n\n" + error.stack);
  },
  pause(intervalMs) {
    return new Promise(resolve => {
      setTimeout(resolve, intervalMs);
    });
  },
};
const main = {
  async run() {
    await main.manageScripts();
  },
  async manageScripts() {
    await main.establishAddCondidateButtonListenerForAutoselection();
  },
  async establishAddCondidateButtonListenerForAutoselection() {
    const addCandidateButtons = claim(type.nodeList, await pollingSelectorAll(document,
        '.mb-2.formwrapper_add_button.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--dark.v-size--small.primary', 1
    ));
    affirm(addCandidateButtons.length === 1, 'Селектор кнопки "Добавить кандидата" нашел не 1 элемент');
    addSafeListener(addCandidateButtons[0], 'click', async () => {
      await tools.pause(1300);
      const formDivs = claim(type.nodeList, await pollingSelectorAll(document,
        'div.v-card__text.py-0.datatable_edit_form_items', 1
      ));
      affirm(formDivs.length === 1, 'Селектор кнопки блока формы для создания кандидата нашел не 1 элемент');
      formDivs[0].style.backgroundColor = '#FFDAB9';
      const inputSlotNodes = claim(type.nodeList, await pollingSelectorAll(formDivs[0],
        '.v-input__slot', 17
      ));
      qw(inputSlotNodes)
      let counter = 0;
      const intervalId = setSafeInterval(async () => {
        if (counter > inputSlotNodes.length-1) {
          clearInterval(intervalId)
          await main.chooseDefaultValues();
          formDivs[0].style.backgroundColor = 'white';
          return;
        }
        let input = inputSlotNodes[counter++];
        if (input.innerText.includes('Источник') || input.innerText.includes('Должность') || input.innerText.includes('илиал')) {
          input.click();
        }
      }, 10);
    });
  },
  async chooseDefaultValues() {
    function clickAndReturnListItem(substring) {
      for (let listbox of listboxes) {
        if (listbox.innerText.includes(substring) && !usedListboxes.includes(listbox)) {
          for (let listItem of listbox.children) {
            if (listItem.innerText.includes(substring)) {
              listItem.click();
              usedListboxes.push(listbox);
              return listItem;
            }
          }
        }
      }
    }
    const listboxes = claim(type.nodeList, await pollingSelectorAll(document, '[role=listbox]', 4));
    qw(listboxes)
    let usedListboxes = [], listItem = null;
    listItem = clickAndReturnListItem('араганда');
    await tools.pause(500);
    //await until(() => listItem.getAttribute('aria-selected') === 'true', 100);
    listItem = clickAndReturnListItem('араганда');
    await tools.pause(500);
    //await until(() => listItem.getAttribute('aria-selected') === 'true', 100);
    listItem = clickAndReturnListItem('hh.кz отклики');
    await tools.pause(1000);
    //await until(() => listItem.getAttribute('aria-selected') === 'true', 100);
    clickAndReturnListItem('оператор');
  }
};

attempt(main.run.bind(main), tools.defaultCatchCallback.bind(tools));
