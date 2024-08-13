import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Messages } from 'primereact/messages';

interface ModalContentProps {
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
    setIsModalVisible: (isVisible: boolean) => void;
    resetFields: () => void;
}

const AddDataModalContent: React.FC<ModalContentProps> = ({ selectedDataType, setSelectedDataType, inputTypes, addedDataTypes, handleAddInput, inputs, handleInputChange, handleDeleteInput, isAddDataClicked, isSubmitting, setIsModalVisible, resetFields }) => {
    const messages = useRef<Messages>(null);
    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-headingLg text-black-900 text-left">Please select the supplementary data you wish to contribute</h2>
                    <button
                        className="p-[10px] rounded-[4px] hover:bg-gray-100 text-right"
                        onClick={() => {
                            setIsModalVisible(false);
                            resetFields();
                        }}
                    >
                        <img
                            src="/images/assets/close-modal-icon.svg"
                            alt="close publication modal icon"
                            className="w-6"
                        />
                    </button>
                </div>
                <p className="text-bodySm text-red-800 w-full text-left">
                    Note: A request will be sent to the Science Portal team. You will be notified regarding the outcome of your request.
                </p>
            </div>
            <MultiSelect
                value={selectedDataType} 
                options={inputTypes.filter(option => !addedDataTypes.includes(option.value))} 
                onChange={e => setSelectedDataType(e.value)} 
                placeholder="Select Data Type" 
                className="text-gray-700 w-full text-left border-2 border-visible"
                itemTemplate={(option) => <span  className="text-gray-700">{option.label}</span>}
            />
            
            {selectedDataType && selectedDataType.length > 0 ? (
                <Button 
                    onClick={handleAddInput} 
                    label='Add Data' 
                    className='w-32 p-2 border-2 w-full text-left'
                />
            ) : null}
            
            {inputs.map((input, index) => (
            <div key={index}>
                <InputText 
                    placeholder={`${input.type}`} 
                    value={input.value} 
                    onChange={e => handleInputChange(index, e.target.value)} 
                    className="mr-4"
                />
                <i className="pi pi-trash p-[10px] rounded-[4px] hover:bg-gray-100" style={{ fontSize: '1.3rem' }} onClick={() => handleDeleteInput(index)}></i>
            </div>
            ))}
            
            <div className="flex flex-row justify-start w-full">
                {isAddDataClicked && selectedDataType && inputs.every(input => input.value.trim() !== '') && (
                    <Button
                        label={isSubmitting ? '' : 'Submit'}
                        icon={isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-arrow-left'}
                        className="w-32 p-2 border-2 transition ease-out delay-150 hover:-translate-y-0.5 hover:scale-110 hover:text-bold duration-200"
                        disabled={!selectedDataType}
                    />
                )}
            </div>
        </div>
    );
};

export default AddDataModalContent;
