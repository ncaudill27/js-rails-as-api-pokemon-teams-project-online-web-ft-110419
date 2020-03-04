const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const base = document.querySelector('main')

function getTrainers() {
    fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(trainers => trainersToDom(trainers))
}

function trainersToDom(trainers) {
    trainers.forEach(  trainer => {
        let trainerName = document.createElement('p')
        trainerName.innerText = trainer.name

        let addBtn = document.createElement('button')
        addBtn.setAttribute('data-trainer-id', `${trainer.id}`)
        addBtn.innerText = 'Add Pokemon'

        let pokemonList = document.createElement('ul')

        trainer.pokemon.map( pokemon => {
            let pokeLi = document.createElement('li')
            pokeLi.innerText = `${pokemon.nickname} (${pokemon.species}) `
            
            let releaseBtn = document.createElement('button')
            releaseBtn.setAttribute('class', 'release')
            releaseBtn.setAttribute('data-pokemon-id', `${pokemon.id}`)
            releaseBtn.innerText = 'Release'

            pokeLi.appendChild(releaseBtn)
            pokemonList.appendChild(pokeLi)
        })

        let trainerCard = document.createElement('div')
        trainerCard.setAttribute('class', 'card')
        trainerCard.setAttribute('data-id', `${trainer.id}`)

        trainerCard.appendChild(trainerName)
        trainerCard.appendChild(addBtn)
        trainerCard.appendChild(pokemonList)
        base.appendChild(trainerCard)
        // add trainer.id to div
    })
}

function addPokemonToCard(pokemon, trainerId) {
    let trainerCard = document.querySelector(`div[data-id="${trainerId}"]`)
    let pokemonList = trainerCard.querySelector('ul')

    let newPokemon = document.createElement('li')
    newPokemon.innerText = `${pokemon.nickname} (${pokemon.species}) `
    
    let releaseBtn = document.createElement('button')
    releaseBtn.setAttribute('class', 'release')
    releaseBtn.setAttribute('data-pokemon-id', `${pokemon.id}`)
    releaseBtn.innerText = 'Release'
    
    
    newPokemon.appendChild(releaseBtn)
    pokemonList.appendChild(newPokemon)
}

function createPokemon(e) {
    const trainerId = e.target.getAttribute('data-trainer-id')
    fetch(`${POKEMONS_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: (JSON.stringify(trainerId))
    })
    .then(response => response.json())
    .then(pokemon =>  addPokemonToCard(pokemon, trainerId))
}


function handlePokemonAdd(event) {
    trainerId = event.target.getAttribute('data-trainer-id')
    trainerCard = document.querySelector(`div[data-id="${trainerId}"]`)
    pokemonList = trainerCard.querySelector('ul')
    if (pokemonList.children.length < 6) {
        createPokemon(event)
    }
}

function removePokemon(pokemon, event) {
    trainerCard = document.querySelector(`div[data-id="${pokemon.trainer_id}"]`)
    pokemonList = trainerCard.querySelector('ul')
    let lis = trainerCard.querySelectorAll('li')
    lis.forEach( li => {
        if ((li.contains(event.target))) {
            pokemonList.removeChild(li)
        }
    })
    if (pokemonList.contains(event.target)) {
    }

    // let pokemonId = event.target.getAttribute('data-pokemon-id')
    // let allPokemon = document.querySelectorAll('li')
    // allPokemon

    
}

function handlePokemonRelease(e) {
    const pokemonId = e.target.getAttribute('data-pokemon-id')
    fetch(`${POKEMONS_URL}/${pokemonId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(pokemon => removePokemon(pokemon, e))
}

function addEventListeners() {
    base.addEventListener('click', (event)=> {
        if (event.target.matches('li > button')) {
            handlePokemonRelease(event)
        }
    })
    base.addEventListener('click', (event) => {
        if (event.target.matches('div > button')) {
            handlePokemonAdd(event)
        }
    })
}

document.addEventListener('DOMContentLoaded', ()=> {
    getTrainers()
    addEventListeners()
})