import React, { useState } from 'react';
import NavItems from '../Header/NavItems.json';
import '../Header/DropDown.css';

const Dropdown = () => {
  const [dropdown, setDropdown] = useState(false);
  let dropdownStyle = '';

  if(dropdown){
    dropdownStyle = 'dropdown-menu clicked';
  }else{
    dropdownStyle = 'dropdown-menu';
  }

  return (
    <>
      <ul
        className={dropdownStyle}
      >
        {NavItems.map((item, index) => {
          return (
            <li key={index}>
              <a href={item.path}
                className={item.cName}
                onClick={() => setDropdown(true)}
                title='link'
                aria-label='Open Menu'
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Dropdown;
