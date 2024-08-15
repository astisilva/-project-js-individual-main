//Hämtar hundar och lagra de i local storage
async function fetchDogs() {
  const url = `https://majazocom.github.io/Data/dogs.json`;

  try {
    const existingDogs = JSON.parse(localStorage.getItem('dogs'));
    if (!existingDogs || existingDogs.length === 0) {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      localStorage.setItem('dogs', JSON.stringify(data));
      console.log('fetch dogs', data);
    }
  } catch (error) {
    console.error('Fel vi hämtning av hundar', error);
  }
}

fetchDogs();

//Visa hundar på skärmen
function displayDogs() {
  const dogs = JSON.parse(localStorage.getItem('dogs')) || [];
  console.log('display dogs', dogs);
  let container = document.getElementById('dogs-container');

  container.innerHTML = ''; //Rensa tidigare innehåll

  dogs.forEach((dog, index) => {
    let dogCard = document.createElement('div');
    dogCard.classList.add('dog-card');

    if (dog.img) {
      let dogImage = document.createElement('img');
      dogImage.src = dog.img;
      dogImage.alt = dog.name || 'Dog image';
      dogCard.appendChild(dogImage);
    }
    let dogDetails = document.createElement('div');
    dogDetails.classList.add('dog-details');

    let dogName = document.createElement('p');
    dogName.textContent = dog.name || 'Unnamed dog';
    dogDetails.appendChild(dogName);

    let dogBreed = document.createElement('p');
    dogBreed.textContent = `Ras: ${dog.breed || 'Okänd'}`;
    dogDetails.appendChild(dogBreed);

    let dogAge = document.createElement('p');
    dogAge.textContent = `Ålder: ${dog.age || 'Okänd'}`;
    dogDetails.appendChild(dogAge);

    dogCard.appendChild(dogDetails);

    // Lägg till knappar för redigering och radering
    let buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('dog-buttons');

    let updateButton = document.createElement('button');
    updateButton.textContent = 'Redigera';

    updateButton.addEventListener('click', () => {
      updateDog(index);
    });

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Radera';

    // Använd addEventListener istället för onclick
    deleteButton.addEventListener('click', () => {
      deleteDog();
    });

    buttonsDiv.appendChild(updateButton);
    buttonsDiv.appendChild(deleteButton);
    dogCard.appendChild(buttonsDiv);

    container.appendChild(dogCard);
  });
}

displayDogs();

//Funktion för första bokstaven blir stor
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function addDog(event) {
  event.preventDefault();
  console.log('add dog');
  let dogName = document.getElementById('name').value.trim();
  let dogBreed = document.getElementById('breed').value.trim();
  let dogAge = document.getElementById('age').value.trim();
  let dogImage = document.getElementById('image').value.trim();

  dogName = capitalizeFirstLetter(dogName);

  if (!dogName || !dogBreed || !dogAge) {
    alert('Alla fält måste fyllas i');
    return;
  }

  if (!dogImage) {
    dogImage = 'https://via.placeholder.com/150'; // om ingen bild laddas används denna
  }
  newDog = {
    name: dogName,
    breed: dogBreed,
    age: dogAge,
    img: dogImage,
  };
  //Hämta det som finns på localstorage
  let dogs = JSON.parse(localStorage.getItem('dogs') || []);
  dogs.push(newDog);
  localStorage.setItem('dogs', JSON.stringify(dogs));

  //Återställer formuläret
  document.getElementById('dog-form').reset();

  displayDogs();
}

let addBtn = document.getElementById('submitBtn');
addBtn.addEventListener('click', addDog);

/******************************  Uppdatera hundar ************************************/
function updateDog(index) {
  //hämtar hundarna från localstorage
  let dogs = JSON.parse(localStorage.getItem('dogs')) || [];

  let dog = dogs[index];

  // hämta hundens nuvarande data och lägg i formuläret
  document.getElementById('name').value = dog.name;
  document.getElementById('breed').value = dog.breed;
  document.getElementById('age').value = dog.age;
  document.getElementById('image').value = dog.img;

  // Ändra formulärknappen till att vara en "Uppdatera"-knapp
  let addBtn = document.getElementById('submitBtn');
  addBtn.textContent = 'Uppdatera hund';

  // Ta bort tidigare event listener
  addBtn.removeEventListener('click', addDog);

  addBtn.addEventListener('click', function updateDog(event) {
    event.preventDefault();

    /*********************Lägga till en är du säker att du vill uppdatera alert***************************/
    // Uppdatera hundens data
    dog.name = document.getElementById('name').value.trim();
    dog.breed = document.getElementById('breed').value.trim();
    dog.age = document.getElementById('age').value.trim();
    dog.img = document.getElementById('image').value.trim() || 'https://via.placeholder.com/150'; // bild om ingen bild anges

    //Spara den nya informationen om hunden i dog
    dogs[index] = dog;

    localStorage.setItem('dogs', JSON.stringify(dogs));
    document.getElementById('dog-form').reset();
    displayDogs();

    addBtn.textContent = 'Lägg till hund';
    addBtn.addEventListener('click', addDog);

    console.log(`Redigera hund på index ${index}`);
  });
}

function update() {}

function deleteDog(index) {
  // Raderingslogik här
  console.log(`Radera hund på index ${index}`);
}
