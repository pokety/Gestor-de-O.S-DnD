import $ from 'https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.2/cash.min.js';
import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.4/axios.js';
loader();

const [o_s, local, data, data_fim, hora, salvar] =
  document.querySelectorAll('input');

var montar = document.querySelector('#montar');
var acontecendo = document.querySelector('#acontecendo');
var desmontar = document.querySelector('#desmontar');
const dropaveis = document.querySelectorAll('.dropaveis');
const update = document.querySelector('#update');
const delet = document.querySelector('.delete');

setInterval(() => {
  document.querySelectorAll('.box').forEach((e) => {
    switch (e.parentNode.id) {
      case 'montar':
        e.style.border = '2px solid green';
        e.style.boxShadow = '0px 2px 5px green';
        break;
      case 'acontecendo':
        e.style.border = '2px solid orange';
        e.style.boxShadow = '0px 2px 5px orange';
        break;
      case 'desmontar':
        e.style.border = '2px solid red';
        e.style.boxShadow = '0px 2px 5px red';
        break;
    }
  });
}, 1000);

setInterval(() => {
  document.querySelectorAll('.box').forEach((ele) => {
    ele.addEventListener('dragstart', (e) => {
      e.stopImmediatePropagation();
      e.dataTransfer.setData('form', e.target.id);
    });
  });
}, 1000);

dropaveis.forEach((ele) => {
  ele.addEventListener('dragover', (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();
  });
});

dropaveis.forEach((ele) => {
  ele.addEventListener('drop', (e) => {
    e.stopPropagation();
    let dados = e.dataTransfer.getData('form');
    if (e.target.classList != 'dropaveis' && e.target.firstChild) {
      $(document.getElementById(dados)).insertBefore(e.target);
    } else {
      e.target.append(document.getElementById(dados));
    }
  });
});
delet.addEventListener('dragover', (e) => {
  e.stopImmediatePropagation();
  e.preventDefault();
});

delet.addEventListener('drop', (e) => {
  e.stopPropagation();
  let dados = e.dataTransfer.getData('form');
  if (!e.target.firstChild) {
    e.target.append(document.getElementById(dados));
    e.target.firstChild.remove();
  }
});

//////onload
function loader() {
  fetch('https://api.npoint.io/deca6b85557a920e01bf')
    .then((response) => response.json())
    .then((result) => {
      let values = Object.values(result);
      values.forEach((item) => {
        if (item[0].montarM != '\n \n ') {
          montar.innerHTML = item[0].montarM;
        }

        if (item[1].montarA != '\n \n ') {
          acontecendo.innerHTML = item[1].montarA;
        }

        if (item[2].montarD != '\n \n ') {
          desmontar.innerHTML = item[2].montarD;
        }
      });
    });
}

function criar(id, local, data, hora, data_fim) {
  console.log(data); ///yyyy-mm-dd

  const [anoI, mesI, diaI] = data.split('-');
  const [anoF, mesF, diaF] = data_fim.split('-');

  let inicio = `${diaI}/${mesI}/${anoI}`;
  let fim = `${diaF}/${mesF}/${anoF}`;

  let div = document.createElement('div');
  div.setAttribute('draggable', 'true');
  div.setAttribute('id', id);
  div.setAttribute('class', 'box');
  div.innerHTML = `
  OS:<strong>${id} </strong>
  Local:<strong>${local}</strong>
  Data:<strong>${inicio}</strong>
  Hora:<strong>${hora}</strong>
  Data_Fim:<strong>${fim}</strong>
      `;
  return div;
}

salvar.addEventListener('click', () => {
  montar.append(
    criar(o_s.value, local.value, data.value, hora.value, data_fim.value)
  );
});

update.addEventListener('click', async () => {
  let str_montar = montar.innerHTML;
  let str_acontecendo = acontecendo.innerHTML;
  let str_desmontar = desmontar.innerHTML;

  const url = 'https://api.npoint.io/deca6b85557a920e01bf';
  const dados = {
    eventos: [
      {
        montarM: str_montar,
        status: 'montar',
      },
      {
        montarA: str_acontecendo,
        status: 'acontecendo',
      },
      {
        montarD: str_desmontar,
        status: 'desmontar',
      },
    ],
  };
  axios
    .post(url, dados, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })
    .then((dados) => {
      console.log(dados);
    });
});
