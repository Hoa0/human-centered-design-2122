/**
 * source code: https://dev.opera.com/articles/accessible-drag-and-drop/ 
 * @param {*} objElement 
 * @param {*} strTagName 
 * @param {*} strClassName 
 * @returns Function to get elements by class name for DOM fragment and tag name
 */
function getElementsByClassName(objElement, strTagName, strClassName)
{
	let objCollection = objElement.getElementsByTagName(strTagName);
	let arReturn = [];
	let strClass, arClass, iClass, iCounter;

	for(iCounter=0; iCounter<objCollection.length; iCounter++)
	{
		strClass = objCollection[iCounter].className;
		if (strClass)
		{
			arClass = strClass.split(' ');
			for (iClass=0; iClass<arClass.length; iClass++)
			{
				if (arClass[iClass] == strClassName)
				{
					arReturn.push(objCollection[iCounter]);
					break;
				}
			}
		}
	}

	objCollection = null;
	return (arReturn);
}

let drag = {
	objCurrent : null,

	arTargets : ['Tak', 'Maa', 'Din', 'Woe', 'Don', 'Vri', 'Zat', 'Zon'],

	initialise : function(objNode)
	{
		// Add event handlers
		objNode.onmousedown = drag.start;
		objNode.onclick = function() {this.focus();};
		objNode.onkeydown = drag.keyboardDragDrop;
		document.body.onclick = drag.removePopup;
	},

	keyboardDragDrop : function(objEvent)
	{
		objEvent = objEvent || window.event;
		drag.objCurrent = this;
		let arChoices = ['Takenlijst', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
		let iKey = objEvent.keyCode;
		let objItem = drag.objCurrent;

			let strExisting = objItem.parentNode.getAttribute('id');
			let objMenu, objChoice, iCounter;

			if (iKey == 32)
			{// 72 H, 74 J - 75 K, 76 L
				document.onkeydown = function(){return objEvent.keyCode==72 || objEvent.keyCode==74 || objEvent.keyCode==75 || objEvent.keyCode==76 ? false : true;};
				// Set ARIA properties
				drag.objCurrent.setAttribute('aria-grabbed', 'true');
				drag.objCurrent.setAttribute('aria-owns', 'popup');
				// Build context menu
				objMenu = document.createElement('ul');
				objMenu.setAttribute('id', 'popup');
				objMenu.setAttribute('role', 'menu');
				for (iCounter=0; iCounter<arChoices.length; iCounter++)
				{
					if (drag.arTargets[iCounter] != strExisting)
					{
						objChoice = document.createElement('li');
						objChoice.appendChild(document.createTextNode(arChoices[iCounter]));
						objChoice.tabIndex = -1;
						objChoice.setAttribute('role', 'menuitem');
						// name == first 3 letter
						objChoice.onmousedown = function() {drag.dropObject(this.firstChild.data.substr(0, 3));};
						objChoice.onkeydown = drag.handleContext;
						objChoice.onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
						objChoice.onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };
						objMenu.appendChild(objChoice);
					}
				}
				objItem.appendChild(objMenu);
				objMenu.firstChild.focus();
				objMenu.firstChild.className = 'focus';
				drag.identifyTargets(true);
			}
	},

	removePopup : function()
	{
		document.onkeydown = null;

		let objContext = document.getElementById('popup');

		if (objContext)
		{
			objContext.parentNode.removeChild(objContext);
		}
	},

	handleContext : function(objEvent)
	{
		objEvent = objEvent || window.event;
		let objItem = objEvent.target || objEvent.srcElement;
		let iKey = objEvent.keyCode;
		let objFocus, objList, strTarget, iCounter;

		// Cancel default behaviour
		if (objEvent.stopPropagation)
		{
			objEvent.stopPropagation();
		}
		else if (objEvent.cancelBubble)
		{
			objEvent.cancelBubble = true;
		}
		if (objEvent.preventDefault)
		{
			objEvent.preventDefault();
		}
		else if (objEvent.returnValue)
		{
			objEvent.returnValue = false;
		}

		switch (iKey)
		{
			case 72 : // Down arrow h
				objFocus = objItem.nextSibling;
				if (!objFocus)
				{
					objFocus = objItem.previousSibling;
				}
				objItem.className = '';
				objFocus.focus();
				objFocus.className = 'focus';
				break;
			case 74 : // Down arrow j
				objFocus = objItem.nextSibling;
				if (!objFocus)
				{
					objFocus = objItem.previousSibling;
				}
				objItem.className = '';
				objFocus.focus();
				objFocus.className = 'focus';
				break;
			case 75 : // Up arrow k
				objFocus = objItem.previousSibling;
				if (!objFocus)
				{
					objFocus = objItem.nextSibling;
				}
				objItem.className = '';
				objFocus.focus();
				objFocus.className = 'focus';
				break;
			case 76 : // Up arrow l
				objFocus = objItem.previousSibling;
				if (!objFocus)
				{
					objFocus = objItem.nextSibling;
				}
				objItem.className = '';
				objFocus.focus();
				objFocus.className = 'focus';
				break;
				// drop - n 78, m 77
			case 78 : 
				strTarget = objItem.firstChild.data.substr(0, 3);
				drag.dropObject(strTarget);
				break;
			case 77 : 
				strTarget = objItem.firstChild.data.substr(0, 3);
				drag.dropObject(strTarget);
				break;
			case 27 : // Escape
			case 9  : // 9 Tab, 67 c
				drag.objCurrent.removeAttribute('aria-owns');
				drag.objCurrent.removeChild(objItem.parentNode);
				drag.objCurrent.focus();
				for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
				{
					objList = document.getElementById(drag.arTargets[iCounter]);
					drag.objCurrent.setAttribute('aria-grabbed', 'false');
					objList.removeAttribute('aria-dropeffect');
					objList.className = '';
				}
				break;
		}
	},

	start : function(objEvent)
	{
		objEvent = objEvent || window.event;
		drag.removePopup();
		// Initialise properties
		drag.objCurrent = this;

		drag.objCurrent.lastX = objEvent.clientX;
		drag.objCurrent.lastY = objEvent.clientY;
		drag.objCurrent.style.zIndex = '2';
		drag.objCurrent.setAttribute('aria-grabbed', 'true');

		document.onmousemove = drag.drag;
		document.onmouseup = drag.end;
		drag.identifyTargets(true);

		return false;
	},

	drag : function(objEvent)
	{
		objEvent = objEvent || window.event;

		// Calculate new position
		let iCurrentY = objEvent.clientY;
		let iCurrentX = objEvent.clientX;
		let iYPos = parseInt(drag.objCurrent.style.top, 10);
		let iXPos = parseInt(drag.objCurrent.style.left, 10);
		let iNewX, iNewY;

		iNewX = iXPos + iCurrentX - drag.objCurrent.lastX;
		iNewY = iYPos + iCurrentY - drag.objCurrent.lastY;

		drag.objCurrent.style.left = iNewX + 'px';
		drag.objCurrent.style.top = iNewY + 'px';
		drag.objCurrent.lastX = iCurrentX;
		drag.objCurrent.lastY = iCurrentY;

		return false;
	},

	calculatePosition : function (objElement, strOffset)
	{
		let iOffset = 0;

		// Get offset position in relation to parent nodes
		if (objElement.offsetParent)
		{
			do 
			{
				iOffset += objElement[strOffset];
				objElement = objElement.offsetParent;
			} while (objElement);
		}

		return iOffset;
	},

	identifyTargets : function (bHighlight)
	{
		let strExisting = drag.objCurrent.parentNode.getAttribute('id');
		let objList, iCounter;

		// Highlight the targets for the current drag item
		for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
		{
			objList = document.getElementById(drag.arTargets[iCounter]);
			if (bHighlight && drag.arTargets[iCounter] != strExisting)
			{
				objList.className = 'highlight';
				objList.setAttribute('aria-dropeffect', 'move');
			}
			else
			{
				objList.className = '';
				objList.removeAttribute('aria-dropeffect');
			}
		}
	},

	getTarget : function()
	{
		let strExisting = drag.objCurrent.parentNode.getAttribute('id');
		let iCurrentLeft = drag.calculatePosition(drag.objCurrent, 'offsetLeft');
		let iCurrentTop = drag.calculatePosition(drag.objCurrent, 'offsetTop');
		let iTolerance = 40;
		let objList, iLeft, iRight, iTop, iBottom, iCounter;

		for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
		{
			if (drag.arTargets[iCounter] != strExisting)
			{
				// Get position of the list
				objList = document.getElementById(drag.arTargets[iCounter]);
				iLeft = drag.calculatePosition(objList, 'offsetLeft') - iTolerance;
				iRight = iLeft + objList.offsetWidth + iTolerance;
				iTop = drag.calculatePosition(objList, 'offsetTop') - iTolerance;
				iBottom = iTop + objList.offsetHeight + iTolerance;

				// Determine if current object is over the target
				if (iCurrentLeft > iLeft && iCurrentLeft < iRight && iCurrentTop > iTop && iCurrentTop < iBottom)
				{
					return drag.arTargets[iCounter];
				}
			}
		}

		// Current object is not over a target
		return '';
	},

	dropObject : function(strTarget)
	{
		let objClone, objOriginal, objTarget, objEmpty, objBands, objItem;

		drag.removePopup();

		if (strTarget.length > 0)
		{
			// Copy node to new target
			objOriginal = drag.objCurrent.parentNode;
			objClone = drag.objCurrent.cloneNode(true);

			// Remove previous attributes
			objClone.removeAttribute('style');
			objClone.className = objClone.className.replace(/\s*focused/, '');
			objClone.className = objClone.className.replace(/\s*hover/, '');

			// Add focus indicators
			objClone.onfocus = function() {this.className += ' focused'; };
			objClone.onblur = function() {this.className = this.className.replace(/\s*focused/, '');};
			objClone.onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
			objClone.onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };

			objTarget = document.getElementById(strTarget);
			objOriginal.removeChild(drag.objCurrent);
			objTarget.appendChild(objClone);
			drag.objCurrent = objClone;
			drag.initialise(objClone);

			// Remove empty node if there are activities in list
			objEmpty = getElementsByClassName(objTarget, 'li', 'empty');
			if (objEmpty[0])
			{
				objTarget.removeChild(objEmpty[0]);
			}

			// Add an empty node if there are no activities in list
			objBands = objOriginal.getElementsByTagName('li');
			if (objBands.length === 0)
			{
				objItem = document.createElement('li');
				objItem.appendChild(document.createTextNode('None'));
				objItem.className = 'empty';
				objOriginal.appendChild(objItem);
			}
		}
				// Reset properties
		drag.objCurrent.style.left = '0px';
		drag.objCurrent.style.top = '0px';

		drag.objCurrent.style.zIndex = 'auto';
		drag.objCurrent.setAttribute('aria-grabbed', 'false');
		drag.objCurrent.removeAttribute('aria-owns');

		drag.identifyTargets(false);
	},

	end : function()
	{
		let strTarget = drag.getTarget();

		drag.dropObject(strTarget);

		document.onmousemove = null;
		document.onmouseup   = null;
		drag.objCurrent = null;
	}
};
// add activities to list
(function () {
	let addList = getElementsByClassName(document, 'li', 'draggable');
  document.querySelector('#add').addEventListener('click', function () {
    let input = document.querySelector('#text');
    let list = document.querySelector('#Tak'); 
    
     addList = document.createElement('li'); // create li node
    let itemText = document.createTextNode(input.value); // create text node
    addList.setAttribute('aria-draggable', true)
    addList.setAttribute('tabindex', '0')
    addList.appendChild(itemText); // append text node to li node
    list.appendChild(addList); // append li node to list
    input.value = ""; // clear input
	 addList.classList.add('draggable');
  });
})();
function init ()
{
	let objItems = getElementsByClassName(document, 'li', 'draggable');
	let objItem, iCounter;

	for (iCounter=0; iCounter<objItems.length; iCounter++)
	{
		// Set initial values so can be moved
		objItems[iCounter].style.top = '0px';
		objItems[iCounter].style.left = '0px';

		// Put the list items into the keyboard tab order
		objItems[iCounter].tabIndex = 0;

		// Set ARIA attributes for artists
		objItems[iCounter].setAttribute('aria-grabbed', 'false');
		objItems[iCounter].setAttribute('aria-haspopup', 'true');
		objItems[iCounter].setAttribute('role', 'listitem');

		// Provide a focus indicator
		objItems[iCounter].onfocus = function() {this.className += ' focused'; };
		objItems[iCounter].onblur = function() {this.className = this.className.replace(/\s*focused/, '');};
		objItems[iCounter].onmouseover = function() {if (this.className.indexOf('hover') < 0) {this.className += ' hover';} };
		objItems[iCounter].onmouseout = function() {this.className = this.className.replace(/\s*hover/, ''); };

		drag.initialise(objItems[iCounter]);
	}

	// Set ARIA properties on the drag and drop list, and set role of this region to application
	for (iCounter=0; iCounter<drag.arTargets.length; iCounter++)
	{
		objItem = document.getElementById(drag.arTargets[iCounter]);
		objItem.setAttribute('aria-labelledby', drag.arTargets[iCounter] + 'h');
		objItem.setAttribute('role', 'list');
	}

	objItem = document.getElementById('container');
	objItem.setAttribute('role', 'application');
	

	objItems = null;
}

window.onload = init;
