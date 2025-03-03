import React, { useState } from 'react';
import Modal from './Modal';

const Page2 = ({role}) => {
  if (role === 'admin') {
    window.history.back()
}
  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <h2>working process ui design..!</h2>
    
    </div>
  );
};

export default Page2;