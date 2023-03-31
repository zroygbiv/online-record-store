import { useState } from "react";
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewRecord = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/records',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  // fixes input issues with price
  const onBlur = () => {
    const value = parseFloat(price);
    
    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Sell your Record</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input 
            value={price} 
            onBlur={onBlur} 
            onChange={e => setPrice(e.target.value)} 
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div> 
  );
};

export default NewRecord;