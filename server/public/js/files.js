function requestPage(pageR = 1) {
  httpRequest('get', `v1/files?page=${pageR}&per_page=20`, undefined, (xhttp) => {
    // exibe o erro para o usuário
    page = pageR;
    const response = JSON.parse(xhttp.response || '{}');
    last_page = (response.meta || {}).last_page || 1;
    files = response.data || [];

    // prepara a visualização da lista de arquivos e dos números das páginas
    const divList = document.getElementById('divListDocs');
  });
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
    const inputs = {};
    const newInput = (field, visual) => {
      const label = document.createElement('label');
      label.innerText = visual;
      inputs[field] = document.createElement('input');
      inputs[field].name = field;
      inputs[field].value = file[field] || '';
      label.appendChild(inputs[field]);
      div.appendChild(label);
    }
    newInput('title', 'Título');
    newInput('description', 'Descrição');
    newInput('clientName', 'Nome do arquivo');

    // link para baixar os arquivo
    const a = document.createElement('a');
    a.target = '_blank';
    const img = document.createElement('img');
    img.src = './icons/download.svg';
    if (file.fileName) {
      a.href = `/storage/${file.fileName}`;
    } else img.style.opacity = 0.2;
    a.download = inputs['clientName'].value;
    inputs['clientName'].addEventListener('change', (event) => {
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
          inputs['clientName'].value = file.name;
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
      ['title', 'description', 'clientName'].forEach((field) => {
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
    });
    divButtons.appendChild(btnSave);

    const btnCancel = document.createElement('button');
    btnCancel.innerText = 'Cancelar alterações';
    btnCancel.addEventListener('click', cleanUpdate);
    divButtons.appendChild(btnCancel);

    div.appendChild(divButtons);
  }
}