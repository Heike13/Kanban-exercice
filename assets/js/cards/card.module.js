import Sortable from 'sortablejs';
import { hideModals } from '../utils.module.js';
import { createCard, update, destroy } from './api.cards.module.js';
import { makeTagInDOM, showAssociateTagModal } from '../tags/tag.module.js';

function showAddCardModal(event) {
    document.getElementById('addCardModal').classList.add('is-active');

    const listContainer = event.target.closest('.panel');
    const listId = listContainer.dataset.listId;

    const addCardForm = document.querySelector('#addCardModal form');

    addCardForm.querySelector('input[type=hidden]').value = listId;
}

function handleAddCardForm() {
    const addListForm = document.querySelector('#addCardModal form');

    addListForm.addEventListener('submit', async event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target));
        try {
            const card = await createCard(data);

            makeCardInDOM(card);
            event.target.reset();
        } catch (e) {
            console.log(e);
        }
    });
}

function makeCardInDOM(data) {
    const cardTemplate = document.getElementById('card-template');
    // ! On précise true pour obtenir tout ce qui est contenu dans le template
    const clone = document.importNode(cardTemplate.content, true);

    clone.querySelector('[slot=card-title]').textContent = data.content;
    clone.querySelector('[slot=card-title]').style.backgroundColor = data.color;
    const card = clone.querySelector('.box');
    card.setAttribute('data-card-id', data.id);

    const cardForm = card.querySelector('form.js-card-form');
    cardForm.addEventListener('submit', updateCard);

    const links = card.querySelectorAll('a');
    const editBtn = links[0];
    editBtn.addEventListener('click', editCard);
    const deleteBtn = links[1];
    deleteBtn.addEventListener('click', deleteCard);
    const tagBtn = links[2];

    tagBtn.addEventListener('click', showAssociateTagModal);

    const theGoodList = document.querySelector(
        `[data-list-id="${data.list_id}"]`
    );

    theGoodList.querySelector('.panel-block').appendChild(clone);

    if (data.tags?.length) {
        for (const tag of data.tags) {
            makeTagInDOM(tag);
        }
    }

    hideModals();
}

function editCard(event) {
    const btn = event.target;
    const card = btn.closest('.box');
    const cardText = card.querySelector('.column');
    const cardform = card.querySelector('form');
    cardform.querySelector('input[type=hidden]').value =
        card.getAttribute('data-card-id');
    cardText.classList.add('is-hidden');
    cardform.classList.remove('is-hidden');
}

async function updateCard(event) {
    event.preventDefault();

    const form = event.target;

    const data = Object.fromEntries(new FormData(form));

    const updatedCard = await update(data['card-id'], data);

    form.classList.add('is-hidden');
    const contentElem = form.previousElementSibling;
    contentElem.textContent = updatedCard.content;
    contentElem.classList.remove('is-hidden');
    form.reset();
}

async function deleteCard(event) {
    if (confirm('Etes vous sûr de vouloir effacer cette carte ?')) {
        const btn = event.target;
        const card = btn.closest('.box');
        const cardId = card.getAttribute('data-card-id');
        await destroy(cardId);

        card.remove();
    }

    return false;
}

function dragNDropCard() {

    const cardsContainerPourCraner =
        document.getElementsByClassName('panel-block');

    Array.prototype.forEach.call(cardsContainerPourCraner, container => {
        Sortable.create(container, {
            group: 'cards',
            onEnd: async event => {
                const cardId = event.item.getAttribute('data-card-id');
                const cardContainer = event.to.parentElement;
                const listId = cardContainer.getAttribute('data-list-id');

                await update(cardId, { list_id: listId });

                const cards = cardContainer.querySelectorAll('.box');
                cards.forEach(async (card, index) => {
                    const cardId = card.getAttribute('data-card-id');
                    const newPosition = index + 1;

                    await update(cardId, { position: newPosition });
                });
            },
        });
    });
}

function removeCardFromDom(cardId) {
    document.querySelector(cardId).remove();
}

export {
    showAddCardModal,
    makeCardInDOM,
    handleAddCardForm,
    dragNDropCard,
    removeCardFromDom,
};
