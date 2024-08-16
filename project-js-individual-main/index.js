/* ****************************Hämtar hundar och lagra de i local storage******************************* */
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
    console.error('Fel vid hämtning av hundar', error);
  }
}

/************************** Visa hundar på skärmen ******************************/
function displayDogs() {
  const dogs = JSON.parse(localStorage.getItem('dogs')) || [];
  console.log('display dogs', dogs);
  let container = document.getElementById('dogs-container');

  container.innerHTML = ''; //Rensa tidigare innehåll

  dogs.forEach((dog, index) => {
    let dogCard = document.createElement('div');
    dogCard.classList.add('dog-card');

    let dogImage = document.createElement('img');
    dogImage.src = dog.img || 'https://via.placeholder.com/150';
    dogImage.alt = dog.name || 'Dog image';
    dogCard.appendChild(dogImage);

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
    updateButton.textContent = 'Uppdatera hund';

    updateButton.addEventListener('click', () => {
      updateDog(index);
    });

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Ta bort hund';

    deleteButton.addEventListener('click', () => {
      deleteDog(index);
    });

    buttonsDiv.appendChild(updateButton);
    buttonsDiv.appendChild(deleteButton);
    dogCard.appendChild(buttonsDiv);

    container.appendChild(dogCard);
  });
}

//Funktion så att första bokstaven blir storbokstav
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/*********************** Lägga till hund ********************************* */
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

  let newDog = {
    name: dogName,
    breed: dogBreed,
    age: dogAge,
    img: dogImage,
  };

  // Hämta det som finns på localStorage, använd korrekt syntax för en tom array
  let dogs = JSON.parse(localStorage.getItem('dogs')) || [];

  dogs.unshift(newDog);
  localStorage.setItem('dogs', JSON.stringify(dogs));

  // Återställer formuläret
  document.getElementById('dog-form').reset();

  // Kontrollera om den nya hunden faktiskt lagrades
  console.log('Current dogs in storage:', JSON.parse(localStorage.getItem('dogs')));

  displayDogs();
  resetSubmitButton();
}

/******************************  Uppdatera hundar ************************************/
function updateDog(index) {
  let dogs = JSON.parse(localStorage.getItem('dogs')) || [];
  let dog = dogs[index];

  // Förifyll formuläret med existerande värden
  document.getElementById('name').value = dog.name;
  document.getElementById('breed').value = dog.breed;
  document.getElementById('age').value = dog.age;
  document.getElementById('image').value = dog.img;

  let addBtn = document.getElementById('submitBtn');
  addBtn.textContent = 'Uppdatera hund';

  // Ta bort tidigare event listener för att undvika dubbla lyssnare
  let newAddBtn = addBtn.cloneNode(true);
  addBtn.replaceWith(newAddBtn);

  // Lägg till ny event listener för uppdatering
  newAddBtn.addEventListener('click', function (event) {
    event.preventDefault();

    let confirmUpdate = confirm('Är du säker att du vill uppdatera hundens information');

    if (confirmUpdate) {
      dog.name = document.getElementById('name').value.trim() || dog.name;
      dog.breed = document.getElementById('breed').value.trim() || dog.breed;
      dog.age = document.getElementById('age').value.trim() || dog.age;
      dog.img = document.getElementById('image').value.trim() || dog.img;

      dogs[index] = dog;

      localStorage.setItem('dogs', JSON.stringify(dogs));
      document.getElementById('dog-form').reset();
      displayDogs();

      // Återställ knappen och event listener för att lägga till ny hund
      resetSubmitButton();
    }
  });
}
//resetar knappen
function resetSubmitButton() {
  let addBtn = document.getElementById('submitBtn');
  addBtn.textContent = 'Lägg till hund';

  // Ta bort tidigare event listener för att undvika dubbla lyssnare
  let newAddBtn = addBtn.cloneNode(true);
  addBtn.replaceWith(newAddBtn);

  // Lägg till event listener för att lägga till ny hund
  newAddBtn.addEventListener('click', addDog);
}

/* ***************** Ta bort hund ************************ */
function deleteDog(index) {
  let confirmDelete = confirm('Är du säker på att du vill ta bort hunden');
  if (confirmDelete) {
    let dogs = JSON.parse(localStorage.getItem('dogs') || []);
    dogs.splice(index, 1);
    localStorage.setItem('dogs', JSON.stringify(dogs));
    displayDogs();
  }
}

/* await för att säkerställa att hunddata hämtas innan den visas */
async function start() {
  await fetchDogs(); // Väntar tills hunddata har hämtats
  resetSubmitButton();
  displayDogs();
}

/* Ser till att alla viktiga funktioner och eventlisteners laddas och kan börja användas */
document.addEventListener('DOMContentLoaded', () => {
  start();
});
