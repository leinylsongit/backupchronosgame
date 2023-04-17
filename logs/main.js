'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_trilha')) ?? []
const setLocalStorage = (dbTrilha) => localStorage.setItem("db_trilha", JSON.stringify(dbTrilha))

// CRUD - create read update delete
const deleteTrilha = (index) => {
    const dbTrilha = readTrilha()
    dbTrilha.splice(index, 1)
    setLocalStorage(dbTrilha)
}

const updateTrilha = (index, trilha) => {
    const dbTrilha = readTrilha()
    dbTrilha[index] = trilha
    setLocalStorage(dbTrilha)
}

const readTrilha = () => getLocalStorage()

const createTrilha = (trilha) => {
    const dbTrilha = getLocalStorage()
    dbTrilha.push (trilha)
    setLocalStorage(dbTrilha)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('tempoReal').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Nova Trilha'
}

const saveTrilha = () => {
    if (isValidFields()) {
        const trilha = {
            tempoReal: document.getElementById('tempoReal').value,
            tempoEstimado: document.getElementById('tempoEstimado').value,
            trilha: document.getElementById('trilha').value,
        }
        const index = document.getElementById('tempoReal').dataset.index
        if (index == 'new') {
            createTrilha(trilha)
            updateTable()
            closeModal()
        } else {
            updateTrilha(index, trilha)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (trilha, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${trilha.trilha}</td>
        <td>${trilha.tempoReal}</td>
        <td>${trilha.tempoEstimado}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableTrilha>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableTrilha>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbTrilha = readTrilha()
    clearTable()
    dbTrilha.forEach(createRow)
}

const fillFields = (trilha) => {
    document.getElementById('tempoReal').value = trilha.tempoReal
    document.getElementById('tempoEstimado').value = trilha.tempoEstimado
    document.getElementById('trilha').value = trilha.trilha
    document.getElementById('tempoReal').dataset.index = trilha.index
}

const editTrilha = (index) => {
    const trilha = readTrilha()[index]
    trilha.index = index
    fillFields(trilha)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${trilha.tempoReal}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editTrilha(index)
        } else {
            const trilha = readTrilha()[index]
            const response = confirm(`Deseja realmente excluir a trilha ${trilha.tempoReal}`)
            if (response) {
                deleteTrilha(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('registraTrilha')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveTrilha)

document.querySelector('#tableTrilha>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)