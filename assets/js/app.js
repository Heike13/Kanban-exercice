import { addListenerToActions } from './utils.module.js';
import { getLists, dragNDropList } from './lists/list.module.js';
import { dragNDropCard } from './cards/card.module.js';
import { addExisitingTagToDom } from './tags/tag.module.js';

import { getToken } from './api.module.js';

async function init() {
    try {
        await getToken();
        await getLists();
        await addExisitingTagToDom();
    } catch (e) {
        console.log(e);
    }
    addListenerToActions();
    dragNDropList();
    dragNDropCard();
}

document.addEventListener('DOMContentLoaded', init);
