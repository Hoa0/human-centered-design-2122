let containers = document.querySelectorAll('section');
let list = document.querySelectorAll('ul');
let activities = document.querySelectorAll('li');

/**
 * Add a new task
 */
document.querySelector('input[id="sendEvent"]').addEventListener('click', addNewTask)
window.addEventListener('keydown', (e) => {
  e.keyCode === 13 ? addNewTask : null
})
function addNewTask() { 
  event.preventDefault()
  const eventName = document.querySelector('input[name="newEvent"]')
  const taskList = document.querySelector('ul')
  const newTask = document.createElement('li')
  newTask.textContent = eventName.value

  taskList.insertAdjacentElement('beforeend', newTask)
}

/*
  Select en hover. klik om los te laten
*/
let selectedItem;

document.addEventListener('mousemove', (event) =>{
	// console.log('beweeg', event);
	if (selectedItem){
		selectedItem.style.left = event.clientX-selectedItem.offsetWidth / 2 + 'px';
		selectedItem.style.top = event.pageY - selectedItem.offsetHeight / 2 + 'px';
	}
})

for (const container of containers) {
  container.addEventListener('click', event => {
    if (selectedItem) {
      console.log(`for of containers`,selectedItem)
      for (node of event.path) {
        // console.log(node)
        if (node.nodeName === 'SECTION') {
          const ul = node.querySelector('ul')

          console.log(`for of event.path`,selectedItem)
          selectedItem.classList.remove('selected')
          selectedItem.style.left = ''
          selectedItem.style.top = ''
         ul.appendChild(selectedItem)
          selectedItem = null
          // tot hier
        }
      }
    } else {
      for (node of event.path) {
        if (node.nodeName === 'LI'){
			selectedItem = node
			
			document.querySelector('body').appendChild(selectedItem)
			selectedItem.classList.add('selected')
			selectedItem.style.left = event.clientX - selectedItem.offsetWidth / 2 + 'px';
			selectedItem.style.top = event.pageY - selectedItem.offsetHeight / 2 + 'px';
      }
    }
	}
  })
}

/**
 * is de ul leeg? Zo ja background image op de section
 * if statement om te zien als ul children heeft. Heeft het minder dan 1 child dan is de section.background = url('fotoVanBier')
 */
const tasksLeftToDo = document.querySelector('#toDo')

function emptyUl() {
  if (!tasksLeftToDo.childElementCount > 0) {
    tasksLeftToDo.style.backgroundImage = "url('https://sleepinggiantbrewing.ca/site-content/uploads/2019/01/beer-club-e1605742197844.png')";
    tasksLeftToDo.style.backgroundSize = "250px 300px";
    tasksLeftToDo.classList.add("box");
    
  } else {
    tasksLeftToDo.style.backgroundImage="";
    tasksLeftToDo.classList.remove("box");
    
  }
}

window.addEventListener('click', (event) => {
  emptyUl()
})
