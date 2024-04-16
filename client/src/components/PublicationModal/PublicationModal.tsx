import React from 'react';
import { Dialog } from 'primereact/dialog';
import Pub from '../../interfaces/Pub';
import PublicationModalContent from './PublicationModalContent';

interface ReusableModalProps {
  isVisible: boolean;
  onHide: () => void;
  pub: Pub | null;
}

const ReusableModal: React.FC<ReusableModalProps> = ({ isVisible, onHide, pub }) => {
  const modalHeader = () => (
    <div className="flex flex-row justify-between items-center align-middle">
      <button className='p-[10px] rounded-[4px] hover:bg-gray-100'>
        <img src="/images/assets/expand-modal-icon.svg" alt="expand publication modal button" className='w-6'/>
      </button>
      <div className='flex flex-row items-center gap-2'>
        <button className='p-[10px] rounded-[4px] hover:bg-gray-100'>
          <img src="/images/assets/copy-doi-icon.svg" alt="copy doi button" className='w-6'/>
        </button>
        <button className='p-[10px] rounded-[4px] hover:bg-gray-100' onClick={onHide}>
          <img src="/images/assets/close-modal-icon.svg" alt="close publication modal icon" className='w-6'/>
        </button>
      </div>
    </div>
  );

  return (
    <Dialog
      visible={isVisible}
      header={modalHeader}
      onHide={onHide}
      style={{ width: '50vw', borderRadius: '15px' }}
      modal
      draggable={false}
      closable={false}
      position='bottom'
    >
      {pub && <PublicationModalContent pub={pub} />}
    </Dialog>
  );
};

export default ReusableModal;
