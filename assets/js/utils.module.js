import {
    handleAddListForm,
    showAddListModal,
    showEditListForm,
    editList,
} from './lists/list.module.js';
import { handleAddCardForm } from './cards/card.module.js';
import {
    handleAssociateTagForm,
    showAddTagModal,
    handleAddTagForm,
} from './tags/tag.module.js';

function addListenerToActions() {
    const addListBtn = document.getElementById('addListButton');
    addListBtn.addEventListener('click', showAddListModal);

    const addTagBtn = document.getElementById('addTagButton');
    addTagBtn.addEventListener('click', showAddTagModal);

    const closeListModalBtns = document.querySelectorAll('.close');
    closeListModalBtns.forEach((btn) => {
        btn.addEventListener('click', hideModals);
    });

    addEventsToList();
    handleAddListForm();
    handleAddCardForm();
    handleAddTagForm();
    handleAssociateTagForm();
}

function addEventsToList() {
    const titles = document.querySelectorAll('.panel h2');
    for (const listTitle of titles) {
        listTitle.addEventListener('dblclick', showEditListForm);
    }
    const editListForms = document.querySelectorAll('.panel form.js-list-form');
    for (const form of editListForms) {
        form.addEventListener('submit', editList);
    }
}

function hideModals() {
    document.getElementById('addListModal').classList.remove('is-active');
    document.getElementById('addCardModal').classList.remove('is-active');
    document.getElementById('associateTagModal').classList.remove('is-active');
    document.getElementById('addTagModal').classList.remove('is-active');
}

function getMetaCsrf() {
    return document.head.querySelector('meta[name=csrf-token]').content;
}

export { addListenerToActions, hideModals, addEventsToList, getMetaCsrf };
