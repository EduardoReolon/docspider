function convertDates(value, toString = false, formatFrom = '', formatTo = '') {
  try {
    // format quando = '' significa: 01, 2019
    let valueDate;
    if (typeof value === 'string') {
      switch (formatFrom) {
        case 'short':
          valueDate = new Date(parseInt(value.split('-')[0], 0), parseInt(value.split('-')[1], 0) - 1, parseInt(value.split('-')[2], 0));
          break;
        case 'short br':
          valueDate = new Date(parseInt(value.split('/')[2], 0), parseInt(value.split('/')[1], 0) - 1, parseInt(value.split('/')[0], 0));
          break;
        case 'iso':
          valueDate = new Date(value);
          break;
        default:
          valueDate = new Date(parseInt(value.split(', ')[1], 0), parseInt(value.split(', ')[0], 0) - 1, 1);
          break;
      }
    } else valueDate = value;
    if (toString) {
      let hours = '';
      switch (formatTo.split(' ')[0]) {
        case 'long':
          hours = ` ${valueDate.getHours().toString().padStart(2, '0')}:${valueDate.getMinutes().toString().padStart(2, '0')}`;
          /* eslint-disable */
        case 'short':
          /* eslint-enable */
          if (formatTo.includes('br')) {
            return `${valueDate.getDate().toString().padStart(2, '0')}/${(valueDate.getMonth() + 1).toString().padStart(2, '0')}/${valueDate.getFullYear()}${hours}`;
          }
          return `${valueDate.getFullYear()}-${(valueDate.getMonth() + 1).toString().padStart(2, '0')}-${valueDate.getDate().toString().padStart(2, '0')}${hours}`;
        default:
          return `${(valueDate.getMonth() + 1).toString().padStart(2, '0')}, ${valueDate.getFullYear()}`;
      }
    } else return valueDate;
  } catch (error) {
    return value;
  }
};

function requestPage(pageR = page) {
  httpRequest('get', `v1/files?page=${pageR}&per_page=20`, undefined, (xhttp) => {
    // exibe o erro para o usuário
    page = pageR;
    const response = JSON.parse(xhttp.response || '{}');
    last_page = (response.meta || {}).last_page || 1;
    files = response.data || [];

    // prepara a visualização da lista de arquivos e dos números das páginas
    const divList = document.querySelector('.divListDocs');
    divList.innerHTML = '';
    files.forEach((file) => {
      const divFile = document.createElement('div');
      const divAtributes = document.createElement('div');
      function newField(field, slug) {
        const label = document.createElement('label');
        label.innerText = `${slug}:`;
        const h4 = document.createElement('h4');
        if (field === 'created_at') {
          h4.innerText = convertDates(file[field] || '2000-01-01 DMT-03:00', true, 'iso', 'long br');
        } else h4.innerText = file[field] || '';
        label.appendChild(h4);
        divAtributes.appendChild(label);
      };
      newField('title', 'Título');
      newField('description', 'Descrição');
      newField('client_name', 'Arquivo');
      newField('created_at', 'Criado em');

      divAtributes.addEventListener('click', () => {
        startEditFile(file);
      })

      divFile.appendChild(divAtributes);

      // link para baixar os arquivo
      const a = document.createElement('a');
      a.target = '_blank';
      const img = document.createElement('img');
      img.src = './icons/download.svg';
      if (file.file_name) {
        a.href = `/storage/${file.file_name}`;
      } else img.style.opacity = 0.2;
      a.download = file.client_name;
      a.appendChild(img);
      divFile.appendChild(a);

      divList.appendChild(divFile);
    })

    // prepara a visuação das páginas
    const divPages = document.querySelector('.divPagesDocs');
    divPages.innerHTML = '';
    for (let currentPage = 1; currentPage <= last_page; currentPage++) {
      const h4Page = document.createElement('h4');
      h4Page.innerText = currentPage;
      if (page === currentPage) h4Page.classList.add('currentPage');
      h4Page.addEventListener('click', () => requestPage(currentPage));
      divPages.appendChild(h4Page);
    }
  });
}

function startEditFile(file = {}) {
  /**
   * file:
   * id, title, description, file_name, client_name, size, created_at, updated_at
   */
  const div = document.querySelector('.divFileEdditing');
  if (div) {
    div.style.display = 'block';
    div.innerHTML = '';
    div.id = file.id || -1;
    const inputs = {};
    const newInput = (field, slug) => {
      const label = document.createElement('label');
      label.innerText = slug;
      inputs[field] = document.createElement('input');
      inputs[field].name = field;
      if (field === 'created_at') {
        inputs[field].value = convertDates(file[field] || '2000-01-01 DMT-03:00', true, 'iso', 'long br');
        inputs[field].disabled = true;
      } else inputs[field].value = file[field] || '';
      label.appendChild(inputs[field]);
      div.appendChild(label);
    }
    newInput('title', 'Título');
    newInput('description', 'Descrição');
    newInput('client_name', 'Nome do arquivo');
    if (file.created_at) newInput('created_at', 'Criado em');

    // link para baixar os arquivo
    const a = document.createElement('a');
    a.target = '_blank';
    const img = document.createElement('img');
    img.src = './icons/download.svg';
    if (file.file_name) {
      a.href = `/storage/${file.file_name}`;
    } else img.style.opacity = 0.2;
    a.download = inputs['client_name'].value;
    inputs['client_name'].addEventListener('change', (event) => {
      a.download = event.target.value;
    })
    a.appendChild(img);
    div.appendChild(a);

    // área para inserir arquivos novos
    let fileUploaded;
    const divUpload = document.createElement('div');
    const labelUpload = document.createElement('label');
    const inputUpload = document.createElement('input');
    // funções drag and drop e change do input dos arquivos
    function onChange() {
      const extensionsBlock = ['exe', 'zip', 'bat', 'x-zip-compressed'];
      Array.from(inputUpload.files).forEach(
        async (file) => {
          let extension;
          if (file.type) extension = file.type.split('/')[1].replace(/\./g, '').toLowerCase();
          else extension = file.name.split('.').pop();
          if (extensionsBlock.includes(extension)) return false;

          fileUploaded = file;
          inputs['client_name'].value = file.name;
          a.download = file.name;
          a.href = window.URL.createObjectURL(file);
          img.style.opacity = 1;
          return true;
        }
      );
    };
    function drop(event) {
      event.preventDefault();
      if (event.dataTransfer.files.length > 0) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(event.dataTransfer.files[0]);
        inputUpload.files = dataTransfer.files;
        onChange();
      }
    };
    divUpload.addEventListener('drop', drop);
    divUpload.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    divUpload.classList.add('divFileUpload');
    labelUpload.innerText = 'Clique ou arraste um item';
    inputUpload.type = 'file';
    inputUpload.addEventListener('change', onChange);

    labelUpload.appendChild(inputUpload);
    divUpload.appendChild(labelUpload);
    div.appendChild(divUpload);

    const cleanUpdate = () => {
      div.style.display = 'none';
      div.innerHTML = '';
    };

    // botões no final do card
    const divButtons = document.createElement('div');
    const btnSave = document.createElement('button');
    btnSave.innerText = 'Salvar';
    btnSave.addEventListener('click', () => {
      const formData = new FormData();
      ['title', 'description', 'client_name'].forEach((field) => {
        formData.append(field, inputs[field].value);
      })
      if (fileUploaded) {
        formData.append('files', fileUploaded);
      }
      httpRequest('post', `v1/files/${file.id || -1}`, formData, undefined, (xhttp) => {
        // exibe o erro para o usuário
        // console.log(JSON.parse(xhttp.response || '{}'));
      });
      cleanUpdate();
      requestPage();
    });
    divButtons.appendChild(btnSave);

    const btnCancel = document.createElement('button');
    btnCancel.innerText = 'Cancelar alterações';
    btnCancel.addEventListener('click', cleanUpdate);
    divButtons.appendChild(btnCancel);

    div.appendChild(divButtons);
  }
}