export default class Widget {
  constructor(memory) {
    this.memory = memory;
    this.container = document.querySelector('#container');
    this.addTicketBtn = document.querySelector('.add-ticket');
    this.popup = document.querySelector('#pop-up');
    this.popupDelete = document.querySelector('#pop-up-delete');
    this.titlePopup = document.querySelector('.title-popup');
    this.btnCancel = document.querySelector('.btn-cancel');
    this.btnOk = document.querySelector('.btn-ok');
    this.inputShortText = document.querySelector('.input-short-text');
    this.inputLongText = document.querySelector('.input-long-text');
    this.btnDelOk = document.querySelector('.btn-delete-ok');
    this.btnDelCancel = document.querySelector('.btn-delete-cancel');
    this.delOrEditMain = null;
    this.shortText = null;
    this.longText = null;
    this.date = null;
    this.done = false;
  }

  events() {
    this.renderTickets();
    this.addTicketClick();
    this.addTicketCancel();
    this.addTicketOk();
    this.inputShortTicket();
    this.inputLongTicket();
    this.statusDone();
    this.deleteTicket();
    this.deleteTicketCancel();
    this.deleteTicketOk();
    this.editTicket();
    this.shortTextClick();
  }

  async renderTickets() {
    const ticket = await this.memory.load();
    for (const i of ticket) {
      this.updateRender(i.name, i.created, i.status, i.id);
    }
  }

  clearDom() {
    for (const i of this.container.querySelectorAll('.block')) {
      i.remove();
    }
  }

  addTicketClick() {
    this.addTicketBtn.addEventListener('click', () => {
      if (this.popup.classList.contains('none')) {
        this.titlePopup.textContent = 'Добавить тикет';
        this.popup.classList.remove('none');
      }
    });
  }

  addTicketCancel() {
    this.btnCancel.addEventListener('click', () => {
      if (!this.popup.classList.contains('none')) {
        this.popup.classList.add('none');
        this.inputShortText.value = null;
        this.inputLongText.value = null;
        this.shortText = null;
        this.longText = null;
      }
    });
  }

  addTicketOk() {
    this.btnOk.addEventListener('click', () => {
      if (!this.popup.classList.contains('none') && this.titlePopup.textContent === 'Добавить тикет') {
        this.popup.classList.add('none');
        this.ticketDate();
        this.newAddTicket(this.shortText, this.longText, this.date, this.done);
        this.inputShortText.value = null;
        this.inputLongText.value = null;
        this.shortText = null;
        this.longText = null;
        this.date = null;
      }
      if (!this.popup.classList.contains('none') && this.titlePopup.textContent === 'Изменить тикет') {
        this.popup.classList.add('none');
        if (this.delOrEditMain.children[0].children[0].classList.contains('done')) {
          this.done = true;
        }
        const { id } = this.delOrEditMain.dataset;
        this.shortText = this.inputShortText.value;
        this.longText = this.inputLongText.value;
        this.newAddTicket(this.shortText, this.longText, this.date, this.done, id);
        this.inputShortText.value = null;
        this.inputLongText.value = null;
        this.shortText = null;
        this.longText = null;
        this.date = null;
        this.done = false;
      }
    });
  }

  ticketDate() {
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let hours = new Date().getHours();
    let minute = new Date().getMinutes();

    if (String(month).length === 1) {
      month = `0${month}`;
    }
    if (String(day).length === 1) {
      day = `0${day}`;
    }
    if (String(minute).length === 1) {
      minute = `0${minute}`;
    }
    if (String(hours).length === 1) {
      hours = `0${hours}`;
    }
    this.date = `${day}.${month}.${String(year).slice(2)} ${hours}:${minute}`;
  }

  updateRender(shortText, date, done, id) {
    const main = document.createElement('div');
    const block = document.createElement('div');
    const long = document.createElement('div');
    block.classList.add('block');
    block.dataset.id = id;
    main.classList.add('main');
    for (let i = 0; i < 5; i += 1) {
      const inMain = document.createElement('div');
      main.appendChild(inMain);
    }
    if (done === true) {
      main.children[0].classList.add('done');
    }
    main.children[0].classList.add('status');
    main.children[1].textContent = shortText;
    main.children[1].classList.add('short');
    main.children[1].dataset.id = id;
    main.children[2].textContent = date;
    main.children[2].classList.add('date');
    main.children[3].classList.add('edit');
    main.children[4].classList.add('delete');
    long.classList.add('long', 'none');
    block.appendChild(main);
    block.appendChild(long);
    this.container.appendChild(block);
  }

  async newAddTicket(shortText, longText, date, done, id) {
    this.clearDom();
    const ticket = {
      name: shortText,
      description: longText,
      created: date,
      status: done,
    };
    if (id) ticket.id = id;
    await this.memory.save(ticket);
    this.renderTickets();
  }

  statusDone() {
    this.container.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('status') && ev.target.classList.contains('done')) {
        ev.target.classList.remove('done');
        const { id } = ev.target.closest('.block').dataset;
        this.memory.editStatusId(id);
      } else if (ev.target.classList.contains('status')) {
        ev.target.classList.add('done');
        const { id } = ev.target.closest('.block').dataset;
        this.memory.editStatusId(id);
      }
    });
  }

  deleteTicket() {
    this.container.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('delete') && this.popupDelete.classList.contains('none')) {
        this.popupDelete.classList.remove('none');
        this.delOrEditMain = ev.target.closest('.block');
      }
    });
  }

  deleteTicketCancel() {
    this.btnDelCancel.addEventListener('click', () => {
      this.popupDelete.classList.add('none');
    });
  }

  deleteTicketOk() {
    this.btnDelOk.addEventListener('click', () => {
      this.popupDelete.classList.add('none');
      this.delOrEditMain.remove();
      this.memory.deleteId(this.delOrEditMain.querySelector('.short').dataset.id);
      this.delOrEditMain = null;
    });
  }

  editTicket() {
    this.container.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('edit') && this.popup.classList.contains('none')) {
        this.titlePopup.textContent = 'Изменить тикет';
        this.popup.classList.remove('none');
        this.delOrEditMain = ev.target.closest('.block');
        const { id } = this.delOrEditMain.dataset;
        this.inputShortText.value = this.delOrEditMain.children[0].children[1].textContent;
        this.showDescription(id, this.inputLongText); // upload description
      }
    });
  }

  shortTextClick() {
    this.container.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('short') && ev.target.closest('.block').children[1].textContent !== '') {
        const long = ev.target.closest('.block').children[1];
        long.textContent = '';
        long.classList.add('none');
      } else if (ev.target.classList.contains('short')) {
        const long = ev.target.closest('.block').children[1];
        const { id } = ev.target.dataset;
        this.showDescription(id, long);
        long.classList.remove('none');
      }
    });
  }

  async showDescription(id, div) {
    const description = await this.memory.loadId(id);
    const text = div;
    text.value = description;
    text.textContent = description;
  }

  inputShortTicket() {
    this.inputShortText.addEventListener('input', (ev) => {
      this.shortText = ev.target.value;
    });
  }

  inputLongTicket() {
    this.inputLongText.addEventListener('input', (ev) => {
      this.longText = ev.target.value;
    });
  }
}
