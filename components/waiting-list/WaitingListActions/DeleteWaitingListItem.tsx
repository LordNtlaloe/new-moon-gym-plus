'use client'

import React, { useState } from 'react';
import Modal from '@/components/general/Modal';
import { useStore } from '@/lib/stores/waitingListStore';

const DeleteWaitingListItem = ({ id }: { id: string }) => {
    const [isVisible, setIsVisible] = useState(true);
    // const { showProductDeleteModal, setShowProductDeleteModal } = useProductStore();

    const handleDelete = () => {
        // Implement the delete logic here
        console.log(`Deleting product with ID: ${id}`);
        // setShowProductDeleteModal(false);
    };

    return (
        <div>
            {/* {showProductDeleteModal && */}
                <Modal isVisible={isVisible} onClose={() => setIsVisible(false)}>
                    <div className='p-6 bg-red-600 text-white'>
                        <h1 className='text-lg font-bold'>Delete Item</h1>
                        <p>Are you sure you want to delete this Item?</p>
                        <div className='border-t mt-3 pt-3 border-black flex items-center'>
                            <button onClick={handleDelete} className='bg-red-500 py-1 px-3 rounded text-white mr-3'>
                                Delete
                            </button>
                            <button className='bg-blue-500 py-1 px-3 rounded text-white' onClick={() => setIsVisible(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            {/* } */}
        </div>
    );
};

export default DeleteWaitingListItem;
