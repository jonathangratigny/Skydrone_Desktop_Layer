import React, {useState, useEffect, useContext} from 'react'
import './Button.scss'
import { UserContext } from '../user/UserContext'
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0'
    },
};

export default function DeleteButton ({target, id, text}) {

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const { user } = useContext(UserContext)

    const deleteDrone = (id) => {
        const deleteToast = toast.loading("Suppression...")
        fetch('https://skydrone-api.herokuapp.com/api/v1/drones/' + id, {
            method: 'DELETE',
            headers: {'Authorization': 'Bearer ' + user.token}
        })
        .then(res => res.json())
        .then(data => {
            console.log('Success', data)
            toast.update(deleteToast, { render: "Supprimé avec succès", type: "success", isLoading: false, autoClose: 2000 });
            setTimeout(() => {
                window.location.href = '../products'
            }, 2000)
        })
        .catch((error) => {
            console.error('Error:', error);
            toast.update(deleteToast, { render: "Errer", type: "error", isLoading: false, autoClose: 2000, });
        });
    }

    const goodTarget = () => {
        switch (target) {
            case 'drone':
                deleteDrone(id)
                break;
            default:
                break;
        }
    }
    

    

    return (
        <>
            <button type='button' className='btn btn-outline-dark' onClick={openModal}>{text}</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                    <div className="modal-header img">
                        <span>Attention !</span>
                    </div>
                    <div className="modal-body">
                        <p>Voulez vous vraiment supprimer ce drone ?</p>
                        <div className='d-flex justify-content-between'>
                            <button className='btn btn-secondary' onClick={closeModal}>Annulé</button>
                            <button className='btn btn-primary' onClick={goodTarget}>Supprimé</button>
                        </div>
                    </div>
                    
            </Modal>
        </>
    )
}
