function injectItemsOnList() {
  
}

function startEditFile(file = {}) {
  /**
   * file:
   * id, title, description, fileName, clientName, size, created_at, updated_at
   */
  const div = document.querySelector('.divFileEdditing');
  if (div) {
    div.style.display = 'block';
    div.innerHTML = '';
    div.id = file.id || -1;
    const newInput = (field, visual) => {
      const label = document.createElement('label');
      label.innerText = visual;
      const input = document.createElement('input');
      input.name = field;
      input.value = file[field] || '';
      label.appendChild(input);
      div.appendChild(label);
    }
    newInput('title', 'Título');
    newInput('description', 'Descrição');
    newInput('clientName', 'Nome do arquivo');

    const img = document.createElement('img');
    img.src = './icons/download.svg';
    div.appendChild(img);

    const cleanUpdate = () => {
      div.style.display = 'none';
      div.innerHTML = '';
    };

    const divButtons = document.createElement('div');
    const btnSave = document.createElement('button');
    btnSave.innerText = 'Salvar';
    btnSave.addEventListener('click', () => {
      // códigos para salvar as alterações  
      cleanUpdate();
    });
    divButtons.appendChild(btnSave);

    const btnCancel = document.createElement('button');
    btnCancel.innerText = 'Cancelar alterações';
    btnCancel.addEventListener('click', cleanUpdate);
    divButtons.appendChild(btnCancel);

    div.appendChild(divButtons);
  }
}