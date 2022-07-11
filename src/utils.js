/** DOM Utilities */
function hasClass(el, className) {
  return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
}

function addClass(el, className) {
  if (!hasClass(el, className)) el.className += " " + className;
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  }
}

const RESULTS_MENU_MAX_WIDTH = 400;
const RESULTS_MENU_MAX_HEIGHT = 300;

// thanks to https://github.com/zurb/tribute/blob/master/src/TributeRange.js
const positionMenuAtCaret = (textComponent, position) =>  {
  const coordinates = getTextAreaOrInputUnderlinePosition(textComponent, position);

  const menuStyles = {
    top: `${coordinates.top}px`,
    left: `${coordinates.left + window.pageXOffset}px`,
    right: coordinates.right ? `${coordinates.right}px` : '',
    bottom: coordinates.bottom ? `${coordinates.bottom}px` : '',
    'max-height': `${RESULTS_MENU_MAX_HEIGHT}px`,
    'max-width': `${RESULTS_MENU_MAX_WIDTH}px`,
    position: 'absolute',
    display: `block`,
  };

  if (coordinates.left === 'auto') {
    menuStyles.left = 'auto';
  }

  if (coordinates.top === 'auto') {
    menuStyles.top = 'auto';
  }

  return menuStyles;
};

const getTextAreaOrInputUnderlinePosition = (textComponent, position) => {
  const properties = [
    'direction',
    'boxSizing',
    'width',
    'height',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing',
  ];

  const div = document.createElement('div');
  div.className = 'form-control';
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  let style = div.style;
  const computed = getComputedStyle(textComponent);

  style.whiteSpace = 'pre-wrap';
  if (textComponent.nodeName !== 'INPUT') {
    style.wordWrap = 'break-word';
  }

  style.position = 'absolute';
  style.visibility = 'hidden';

  // transfer the element's properties to the div
  properties.forEach(prop => {
    style[prop] = computed[prop]
  })

  const span0 = document.createElement('span');
  span0.textContent = textComponent.value.substring(0, position);
  div.appendChild(span0);

  if (textComponent.nodeName === 'INPUT') {
    div.textContent = div.textContent.replace(/\s/g, ' ') || null;
  }

  //Create a span in the div that represents where the cursor
  //should be
  const span = document.createElement('span');
  //we give it no content as this represents the cursor
  span.textContent = '&#x200B;';
  div.appendChild(span);

  const span2 = document.createElement('span');
  span2.textContent = textComponent.value.substring(position);
  div.appendChild(span2);

  const rect = textComponent.getBoundingClientRect();

  //position the div exactly over the element
  //so we can get the bounding client rect for the span and
  //it should represent exactly where the cursor is
  div.style.position = 'fixed';
  div.style.left = rect.left + 'px';
  div.style.top = rect.top + 'px';
  div.style.width = rect.width + 'px';
  div.style.height = rect.height + 'px';
  div.scrollTop = textComponent.scrollTop;

  const spanRect = span.getBoundingClientRect();
  document.body.removeChild(div);
  return getFixedCoordinatesRelativeToRect(spanRect);
};

const getFixedCoordinatesRelativeToRect = (rect) => {
  const coordinates = {
    position: 'fixed',
    left: rect.left,
    top: rect.top + rect.height + window.pageYOffset,
  };

  const menuDimensions = getMenuDimensions();

  const availableSpaceOnTop = rect.top;
  const availableSpaceOnBottom = window.innerHeight - (rect.top + rect.height);

  //check to see where's the right place to put the menu vertically
  if (availableSpaceOnBottom < menuDimensions.height) {
    if (availableSpaceOnTop >= menuDimensions.height || availableSpaceOnTop > availableSpaceOnBottom) {
      coordinates.top = 'auto';
      coordinates.bottom = rect.height + availableSpaceOnBottom - window.pageYOffset;
      if (availableSpaceOnBottom < menuDimensions.height) {
        coordinates.maxHeight = availableSpaceOnTop;
      }
    } else {
      if (availableSpaceOnTop < menuDimensions.height) {
        coordinates.maxHeight = availableSpaceOnBottom;
      }
    }
  }

  const availableSpaceOnLeft = rect.left;
  const availableSpaceOnRight = window.innerWidth - rect.left;

  //check to see where's the right place to put the menu horizontally
  if (availableSpaceOnRight < menuDimensions.width) {
    if (availableSpaceOnLeft >= menuDimensions.width || availableSpaceOnLeft > availableSpaceOnRight) {
      coordinates.left = 'auto';
      coordinates.right = window.innerWidth - rect.left;
      if (availableSpaceOnRight < menuDimensions.width) {
        coordinates.maxWidth = availableSpaceOnLeft;
      }
    } else {
      if (availableSpaceOnLeft < menuDimensions.width) {
        coordinates.maxWidth = availableSpaceOnRight;
      }
    }
  }

  return coordinates;
};

const getMenuDimensions = () => {
  return {
    width: RESULTS_MENU_MAX_WIDTH,
    height: RESULTS_MENU_MAX_HEIGHT,
  };
};


export { addClass, removeClass, positionMenuAtCaret };
