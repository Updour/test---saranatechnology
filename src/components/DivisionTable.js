import React from 'react';
import { ForDate } from '../helper'

const ModalDetailDivision = ({ show, division, handleClose }) => {
  if (!show || !division) return null;

  return (
    <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{division.name} Details</h5>
            <button type="button" className="close" aria-label="Close" onClick={handleClose} style={{ border: 'none', background: 'none', padding: '6px', fontSize: '24px', position: 'absolute', top: '10px', right: '10px', color: '#000', opacity: '0.7', cursor: 'pointer' }}>
              <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div className="modal-body">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Division</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {division.sub.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>{sub.name}</td>
                    <td>{ForDate(sub.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailDivision;
