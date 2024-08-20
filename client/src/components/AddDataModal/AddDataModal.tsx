import React from 'react';
import { Dialog } from 'primereact/dialog';
import AddDataModalContent from './AddDataModalContent';

interface AddDataModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (isVisible: boolean) => void;
    resetFields: () => void;
    selectedDataType: string[];
    setSelectedDataType: (value: string[]) => void;
    inputTypes: { label: string, value: string }[];
    addedDataTypes: string[];
    handleAddInput: () => void;
    inputs: { type: string, value: string }[];
    handleInputChange: (index: number, value: string) => void;
    handleDeleteInput: (index: number) => void;
    isAddDataClicked: boolean;
    isSubmitting: boolean;
}

const AddDataModal: React.FC<AddDataModalProps> = ({ isModalVisible, setIsModalVisible, resetFields, selectedDataType, setSelectedDataType, inputTypes, addedDataTypes, handleAddInput, inputs, handleInputChange, handleDeleteInput, isAddDataClicked, isSubmitting }) => {
    return (
        <Dialog
            visible={isModalVisible}
            onHide={() => setIsModalVisible(false)}
            onClick={e => e.stopPropagation()}
            style={{ width: '700px', borderRadius: '15px', height: '600px' }}
            modal
            draggable={false}
            position="bottom"
            closable={false}
        >
            <AddDataModalContent 
                selectedDataType={selectedDataType} 
                setSelectedDataType={setSelectedDataType} 
                inputTypes={inputTypes} 
                addedDataTypes={addedDataTypes} 
                handleAddInput={handleAddInput} 
                inputs={inputs} 
                handleInputChange={handleInputChange} 
                handleDeleteInput={handleDeleteInput} 
                isAddDataClicked={isAddDataClicked} 
                isSubmitting={isSubmitting} 
                setIsModalVisible={setIsModalVisible} 
                resetFields={resetFields} 
            />
        </Dialog>
    );
};

export default AddDataModal;
