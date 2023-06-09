import React, {useState} from 'react'
import Modal from 'react-modal'


const  ModalPage =()=> {
    const [open, setOpen] = useState(false);

    function openModal(){
        setOpen(true);
    }

    function closedModal(){
        setOpen(false);
    }

    function afterOpenModal(){

    }


    return (
      <div>
        <Modal
        isOpen={openModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closedModal}
        >
         <h2>Once uploaded videos cannot be deleted.<br/>
            Are you sure you want to upload the video?</h2> 
            <button onClick={closedModal}>No</button>
            {/* <button onClick={}>Yes</button> */}
        </Modal>
      </div>
    )
}

export default ModalPage;
