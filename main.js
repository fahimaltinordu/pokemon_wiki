
let searchInput = document.querySelector('#search');
let searchBtn = document.querySelector('#searchBtn');
let backBtn = document.querySelector('#back');
let nextBtn = document.querySelector('#next');
let pokeContainer = document.querySelector('#pokemons');
let pokeInfo = document.querySelector('#info');
let detailsDom = document.querySelector('#details');
let mainContainer = document.querySelector('.container');
let card = document.querySelector('.card');
let loader = document.querySelector('#loader');

let url = "https://pokeapi.co/api/v2/pokemon/";
let imageLink = "https://img.pokemondb.net/artwork/large/"


searchBtn.addEventListener('click', getDetails) 

let zoom = (parametre) => {
    console.log(parametre);
}  


function getDetails() {
    console.log(searchInput.value); 

    if(searchInput.value == ""){
        alert('Enter pokemon name')
    }else {
        loader.style.display='flex'

        fetch(url+searchInput.value)
        .then(response => {
            if (response.status != 200) {
              alert(response.status + ' not found');
              loader.style.display='none'
              return
            } else {
                return response
            }
        })
        .then(response => response.json())
        .then((data)=> {
            console.log(data);

            loader.style.display='none'
            detailsDom.innerHTML = '';
    
            let abilityDom = '';
            data.abilities.forEach((item,index)=>{
                abilityDom += `<div class='ability'>${item.ability.name}</div>`
            })
            console.log(abilityDom);
            
            let typeDom = '';
            data.types.forEach((item,index)=>{
                typeDom += `<div class='type'>${item.type.name}</div>`
            })
            console.log(typeDom);
    
            let statDom = '';
            data.stats.forEach((item,index)=> {
                statDom += `<div class='stat'>${item.stat.name} = ${item.base_stat}</div>`
            })
            console.log(statDom);
    
            let mainDom = `<div id='mainDom'>
                <div id='generalInfo'>
                    <h2 class='general'>ID: #${data.id}</h2>
                    <h2 class='general'>${data.name.toUpperCase()}</h2>
                </div>
                <div id='pokepoke'>
                    <h3 class='general'>Weight: ${data.weight}</h3>
                    <h3 class='general'>Height: ${data.height}</h3>
                    <img class='detailedImg' src=${imageLink+data.name}.jpg></img>
                </div>
                <div id='abilityDom'>
                    <div style='font-weight:bold;'>Abilities</div>
                    <div style='display:flex;gap:10px;'>${abilityDom}</div>
                </div>
                <div id='typeDom'>
                    <div style='font-weight:bold;'>Skin Types</div>
                    <div style='display:flex;gap:10px;'>${typeDom}</div>
                </div>
                <div id='statDom'>
                    ${statDom}
                </div>
            </div>`
            
            detailsDom.innerHTML = mainDom ;
            detailsDom.style.display = 'flex';
            mainContainer.style.backgroundColor ="rgb(0,0,0)";
            mainContainer.style.opacity ="0.2";
            
        })
    
        searchInput.value = "";
    }

}

function getFirst20Poke(url) {
    fetch(url)
    .then((response)=>response.json())
    .then((data) =>{
        console.log(data);

        let pokemons = '';
        data.results.forEach((result,index) => {
            let pokeID = result.url.split('/')[result.url.split('/').indexOf('pokemon') + 1]
            pokemons += `<div class='card' onclick="zoom(${result.name})">
                <div id='pokeInfo'>
                    <p id='pokeID'>#${pokeID} </p>
                    <p>${(result.name).toUpperCase()} </p>
                </div>
                <img class='pokeImg' src=${imageLink+result.name}.jpg>
            </div>`
        });
        pokeContainer.innerHTML = pokemons;
        pokeInfo.innerHTML = `<h3>There are ${data.count} pokemons, you will see each 20</h3>`

        let backUrl = '';
        let nextUrl = '';

        if(data.next==null){
            nextBtn.disabled= true;
            nextBtn.style.background = "red"
        }else{
            nextUrl= data.next;
            nextBtn.addEventListener('click', ()=> {
                getFirst20Poke(nextUrl)
            })
        }

        if(data.previous==null){
            backBtn.disabled= true;
            backBtn.style.background = "red"
        }else{
            backUrl= data.previous;
            backBtn.disabled= false;
            backBtn.style.background = "green"
            backBtn.addEventListener('click', ()=> {
                getFirst20Poke(backUrl)
            })
        }


    })
    .catch(error => { 
            console.log(error);
         }
     )
}
getFirst20Poke(url)


window.addEventListener('click', function(e){   
    if (document.getElementById('details').contains(e.target)){
      // Clicked in box
    } else{
        detailsDom.style.display = 'none';
        mainContainer.style.backgroundColor ="initial";
        mainContainer.style.opacity ="1";
    }
  });