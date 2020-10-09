import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/shared.css';

import t from '../../utils/i18n.js';

// import Index from './Index.js';
// import './index.css';

//this is placeholder content. Fell free to create a Index.js file and move it there
function Index(){
  return <h1>{t('index_page_title')}</h1>
}

import cssGlobal from '../../utils/cssFocusHelper.js';

ReactDOM.render(<Index />, document.getElementById('root'));

