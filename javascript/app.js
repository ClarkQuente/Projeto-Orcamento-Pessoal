class Despesa {

    constructor(year, month, day, type, description, price) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.type = type;
        this.description = description;
        this.price = price;
    }

    validateData() {
        for(let variable in this) {
            if(this[variable] == undefined || this[variable] == '' || this[variable] == null) return false;
        }
        return true;
    }
}

class Storage {

    constructor() {
        let ids = localStorage.getItem('ids');

        if(ids === null) localStorage.setItem('ids', 0);
    }

    getNextId() {
        return this.getTotalIds() + 1;
    }

    getTotalIds() {
        return parseInt(localStorage.getItem('ids'));
    }

    save(despesa) {
        let id = this.getNextId();
        
        despesa.id = id;

        localStorage.setItem('ids', id);
        localStorage.setItem(id, JSON.stringify(despesa));
    }

    getDepesas() {
        let despesas = Array();
        let ids = this.getTotalIds();

        for(let index = 1; index <= ids; index++) {

            let storageDespesa = localStorage.getItem(`${index}`);
            if(storageDespesa === null) continue;

            let despesa = JSON.parse(storageDespesa);
            despesas.push(despesa);
        }

        return despesas;
    }

    delete(id) {
        localStorage.removeItem(id);
    }

    filterDespesas(despesa) {

        let despesas = this.getDepesas();
        let filteredDespesas = Array();

        if(despesa.year != '') {
            filteredDespesas = despesas.filter(desp => desp.year == despesa.year);
        }

        if(despesa.month != '') {
            filteredDespesas = despesas.filter(desp => desp.month == despesa.month);
        }
        
        if(despesa.day != '') {
            filteredDespesas = despesas.filter(desp => desp.day == despesa.day);
        }

        if(despesa.type != '') {
            filteredDespesas = despesas.filter(desp => desp.type == despesa.type);
        }

        if(despesa.description != '') {
            filteredDespesas = despesas.filter(desp => desp.description == despesa.description);
        }

        if(despesa.price != '') {
            filteredDespesas = despesas.filter(desp => desp.price == despesa.price);
        }

        return filteredDespesas;
    }
}

let storage = new Storage();

function createDespesa() {

    let year = document.getElementById('ano');
    let month = document.getElementById('mes');
    let day = document.getElementById('dia');
    let type = document.getElementById('tipo');
    let description = document.getElementById('descricao');
    let price = document.getElementById('valor');

    let despesa = new Despesa(
        year.value,
        month.value,
        day.value,
        type.value,
        description.value,
        price.value
    );

    if(!despesa.validateData()) {
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro';
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!';
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';
		document.getElementById('modal_btn').className = 'btn btn-danger';

		//dialog de erro
		$('#modalRegistraDespesa').modal('show');
        return;
    }

    storage.save(despesa);

    document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso';
	document.getElementById('modal_titulo_div').className = 'modal-header text-success';
	document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!';
	document.getElementById('modal_btn').innerHTML = 'Voltar';
	document.getElementById('modal_btn').className = 'btn btn-success';

    year.value = '';
    month.value = '';
    day.value = '';
    type.value = '';
    description.value = '';
    price.value = '';

	//dialog de sucesso
	$('#modalRegistraDespesa').modal('show');
}

function loadDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && !filtro) {
        despesas = storage.getDepesas();
    }

    let table = document.getElementById('listaDespesas');
    table.innerHTML = '';

    despesas.forEach(despesa => {
        
        switch(despesa.type) {
            case '1':
                despesa.type = 'Alimentação';
                break;
            case '2':
                despesa.type = 'Educação';
                break;
            case '3':
                despesa.type = 'Lazer';
                break;
            case '4':
                despesa.type = 'Saúde';
                break;
            case '5':
                despesa.type = 'Transporte';
                break;
        }

        let line = table.insertRow();
        
        line.insertCell(0).innerHTML = `${despesa.day}/${despesa.month}/${despesa.year}`;
        line.insertCell(1).innerHTML = despesa.type;
        line.insertCell(2).innerHTML = despesa.description;
        line.insertCell(3).innerHTML = despesa.price;

        let button = document.createElement('button');
        button.innerHTML = '<i class="fa fa-times"  ></i>'
        button.className = 'btn btn-danger';
        button.id = `id-despesa-${despesa.id}`
        button.onclick = () => {
            let id = button.id.replace('id-despesa-', '');

            storage.delete(id);
            window.location.reload();
        }

        line.insertCell(4).append(button);
    });
}

function searchDespesas() {

    let year = document.getElementById('ano').value;
    let month = document.getElementById('mes').value;
    let day = document.getElementById('dia').value;
    let type = document.getElementById('tipo').value;
    let description = document.getElementById('descricao').value;
    let price = document.getElementById('valor').value;

    let despesa = new Despesa(
        year,
        month,
        day,
        type,
        description,
        price
    );

    loadDespesas(storage.filterDespesas(despesa), true);
}