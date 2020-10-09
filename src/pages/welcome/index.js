import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/shared.css';

import t from '../../utils/i18n.js';

// import Welcome from './Welcome.js';
// import './welcome.css';

//this is placeholder content. Fell free to create a Welcome.js file and move it there
function Welcome(){
  return <h1>{t('welcome_page_title')}</h1>
}

import cssGlobal from '../../utils/cssFocusHelper.js';

ReactDOM.render(<Welcome />, document.getElementById('root'));


