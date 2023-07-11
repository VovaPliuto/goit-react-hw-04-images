import PropTypes from 'prop-types';

import { useEffect } from 'react';
import css from './Modal.module.css';

const Modal = ({ onCloseModal, modalData }) => {
  const handleOverlayClick = e => {
    if (e.currentTarget === e.target) {
      onCloseModal();
    }
  };

  useEffect(() => {
    const handleKeydownEsc = e => {
      if (e.code === 'Escape') {
        onCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeydownEsc);

    return () => {
      window.removeEventListener('keydown', handleKeydownEsc);
    };
  }, [onCloseModal]);

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div>
        <img
          className={css.modal}
          src={modalData.largeImageURL}
          alt={modalData.tags}
        />
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  modalData: PropTypes.object.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};
