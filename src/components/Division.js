import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { API_SERVE, ForDate } from '../helper'
import DivisionForm from './DivisionForm'
import ModalDetailDivision from './DivisionTable'

const PageDivision = () => {
  const [division, setDivision] = useState([]);
  const [divisiond, setDivisiond] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [ename, setEname] = useState('');
  const [divid, setDivid] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [showTable, setShowTable] = useState(false);


  const _handleRetrieveDivision = async (pageNumber) => {
    try {
      const results = await API_SERVE.get(`api/v1/division?page=${pageNumber}`);
      if (_.isEqual(results.data.success, true)) {
        setDivision(results.data.data);
        setTotalPages(results.data.meta.last_page);
        setTotal(results.data.meta.total)
      } else {
        alert(results.data.message);
      }
    } catch (e) {
      alert(e.response.message);
    }
  };

  const _handleGetDetailValue = async (item) => {
    try {
      let results = await API_SERVE.get(`api/v1/division/${item}?with=sub.sub`)
       if (_.isEqual(results.data.success, true)) {
        setDivisiond(results.data.data);
        setShowTable(true)
      } else {
        alert(results.data.message);
      }
    }catch(e) {
     alert(e.response.data.message);
    }
  }
  const _handleFormEditValue = async (item) => {
    try {
      let items = {
       name: ename,
       division_id: divid
      }
      const results = await API_SERVE.put(`/api/v1/division/${divid}`, items)
      if (_.isEqual(results.data.success, true)) {
          alert(results.data.message)
          setShow(false)
          _handleRetrieveDivision(page)
        }else {
          alert(results.data.message)
        }
    }catch(e) {
      alert(e.response.data.message)
    }
  }

  const _handleFormDeleteValue = async (item) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this item?');
      if (isConfirmed) {
        const results = await API_SERVE.delete(`api/v1/division/${item}`);
        if (_.isEqual(results.data.success, true)) {
          alert(results.data.message)
          _handleRetrieveDivision(page)
        }else {
          alert(results.data.message)
        }
      }
    } catch (e) {
      alert('Gagal: '+e.response.data.message);
    }
  }
 

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    _handleRetrieveDivision(page);
  }, [page]);

  const generatePaginationArray = () => {
    let start = Math.max(1, page - 1);
    let end = Math.min(start + 4, totalPages);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  return (
    <div className="container mt-5">
      <h2>Welcome Division Page</h2>
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Create Division</button>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Division</th>
            <th>Division ID</th>
            <th>Date</th>
             <th>Actions</th>
          </tr>
        </thead>
        <tbody >
          {division.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.division_id}</td>
              <td>{ForDate(item.created_at)}</td>
              <td>
               <button className="btn btn-sm btn-info" style={{ marginRight: 10 }}
              onClick={() => _handleGetDetailValue(item.id)}>
                <i className="bi bi-eye-fill text-white"></i> 
              </button>
              <button className="btn btn-sm btn-primary " style={{ marginRight: 10 }} 
              onClick={() => {
                setShow(!show)
                setEname(item.name)
                setDivid(item.division_id)
              }}>
                <i className="bi bi-pencil-fill"></i> 
              </button>
              
              <button className="btn btn-sm btn-danger" 
              onClick={() => _handleFormDeleteValue(item.id)}>
                <i className="bi bi-trash-fill"></i> 
              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav aria-label="Page navigation" className="d-flex justify-content-between">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handlePrevPage}>Previous</button>
          </li>
          {generatePaginationArray().map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(pageNumber)}>{pageNumber}</button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handleNextPage}>Next</button>
          </li>
        </ul>
        <span>Total : {total}</span>
      </nav>

      {/*{modal}*/}
      <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit {ename}</h5>
            <button type="button" className="close" aria-label="Close" onClick={() => setShow(false)} style={{ border: 'none', background: 'none', padding: '6px', fontSize: '24px', position: 'absolute', top: '10px', right: '10px', color: '#000', opacity: '0.7', cursor: 'pointer' }}>
              <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" 
                className="form-control" 
                id="name" 
                value={ename} 
                onChange={e => setEname(e.target.value)} 
                />
              </div>
              <button className="btn btn-info mt-4 w-100" onClick={_handleFormEditValue}>Submit</button>
          </div>
        </div>
      </div>
    </div>
      <DivisionForm opClose={() => { 
        setShowModal(false)
        _handleRetrieveDivision(page)
      }} isModalOpen={showModal} onClose={() => setShowModal(false)}/> 

      <ModalDetailDivision show={showTable} division={divisiond} handleClose={() => setShowTable(false)}/>
    </div>
  );
};

export default PageDivision;
