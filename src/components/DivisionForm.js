import React, { useState } from 'react';
import _ from 'lodash'
import { API_SERVE } from '../helper'

const DynamicForm = ({ isModalOpen, onClose, opClose }) => {
  const [header, setHeader] = useState('');
  const [formData, setFormData] = useState([{ title: '', divisions: [{ name: '' }] }]);

  const handleChangeTitle = (index, e) => {
    const { value } = e.target;
    const newFormData = [...formData];
    newFormData[index].title = value;
    setFormData(newFormData);
  };

  const handleChangeDivision = (titleIndex, divisionIndex, e) => {
    const { value } = e.target;
    const newFormData = [...formData];
    newFormData[titleIndex].divisions[divisionIndex].name = value;
    setFormData(newFormData);
  };

  const handleAddTitle = () => {
    setFormData([...formData, { title: '', divisions: [{ name: '' }] }]);
  };

  const handleRemoveTitle = (index) => {
    const newFormData = [...formData];
    newFormData.splice(index, 1);
    setFormData(newFormData);
  };

  const handleAddDivision = (titleIndex) => {
    const newFormData = [...formData];
    newFormData[titleIndex].divisions.push({ name: '' });
    setFormData(newFormData);
  };

  const handleRemoveDivision = (titleIndex, divisionIndex) => {
    const newFormData = [...formData];
    newFormData[titleIndex].divisions.splice(divisionIndex, 1);
    setFormData(newFormData);
  };


const transformFormData = async(e) => {
  try {
  	const formLoop = {
    name: header,
    division: formData.map((item) => ({
      name: item.title,
      division: item.divisions.map((division) => ({ name: division.name }))
    }))
  };
  	let results = await API_SERVE.post('/api/v1/division', formLoop)
  	if (_.isEqual(results.data.success, true)) {
  		alert(results.data.message)
  		opClose()
  	}else {
  		alert(results.data.message)
  	}
  }catch(e) {
  	alert(e.response.message)
  }
};

  return (
    <div className="container">
     <div className={`modal ${isModalOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Division Form</h5>
              <button type="button" className="close" aria-label="Close" onClick={onClose} style={{ border: 'none', background: 'none', padding: '6px', fontSize: '24px', position: 'absolute', top: '10px', right: '10px', color: '#000', opacity: '0.7', cursor: 'pointer' }}>
              <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
             <h2>Division Form</h2>
   <div className="border p-3 mb-3">
    <div className="form-group">
      <label>Name:</label>
      <input
        type="text"
        className="form-control"
        value={header}
        onChange={e => setHeader(e.target.value)}
      />
    </div>
    </div>

    {formData.map((data, titleIndex) => (
      <div key={titleIndex} className="border p-3 mb-3">
      <div className="form-group">
      <div className="row">
      <div className="col">
      <label>Title:</label>
      </div>
      <div className="col text-right">
      {titleIndex > 0 && (
      	<label className="text-danger" style={{cursor: 'pointer' }} onClick={() => handleRemoveTitle(titleIndex)}>Remove Title</label>
      	)}
      </div>
      </div>
      <input
      type="text"
      className="form-control"
      value={data.title}
      onChange={(e) => handleChangeTitle(titleIndex, e)}
      />
      </div>
        <div className="form-group mt-4">
          <label>Divisions:</label>
          {data.divisions.map((division, divisionIndex) => (
          	<div key={divisionIndex} className="division-group mt-2 d-flex justify-content-between align-items-center">
          	<input
          	type="text"
          	className="form-control"
          	value={division.name}
          	onChange={(e) => handleChangeDivision(titleIndex, divisionIndex, e)}
          	/>
          	{divisionIndex > 0 && (
          		<button
          		type="button"
          		className="btn btn-danger ml-2" 
          		onClick={() => handleRemoveDivision(titleIndex, divisionIndex)}
          		>
          		Remove
          		</button>
          		)}
          	</div>
          ))}
          <button type="button" className="btn btn-primary mt-2" onClick={() => handleAddDivision(titleIndex)}>
            Add Division
          </button>
        </div>
        
      </div>
    ))}
    <div className="text-right mb-3">
    <button type="button" style={{ marginRight: 10 }} className="btn btn-success mr-2" onClick={handleAddTitle}>
    Add Title
    </button>
    <button className="btn btn-primary ml-2" onClick={transformFormData}>
    Submit
    </button>
    </div>
    </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DynamicForm;
