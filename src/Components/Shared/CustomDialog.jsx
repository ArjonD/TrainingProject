import React from 'react';
import './CustomDialog.css';

function CustomDialog({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="dialog-container" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="dialog-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default CustomDialog;