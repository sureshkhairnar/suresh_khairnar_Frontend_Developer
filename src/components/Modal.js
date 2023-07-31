import React from 'react'
import { GrClose } from 'react-icons/gr'
import ModalDataList from './ModalDataList'
import { Link } from 'react-router-dom'

const Modal = ({ oneRocket, visible, onClose }) => {
  if (!visible) return null

  const closeSearch = (e) => {
    const id = e.target.getAttribute('id')
    if (id === 'bg-modal') {
      onClose()
    }
    // console.log(id);
  }

  return (
    <div
      className="fixed inset-0 overflow-y-hidden bg-black bg-opacity-20 z-[300] backdrop-blur-[0.5px]  flex justify-center items-center"
      onClick={closeSearch}
      id="bg-modal"
    >
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div
            id="modal-box"
            className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 "
          >
            <div
              className="mt-3 text-right flex justify-end sm:mt-0 sm:ml-4 sm:text-right cursor-pointer"
              onClick={onClose}
            >
              <GrClose size={22} />
            </div>
            <div className="sm:flex sm:items-start flex mb-3">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="mt-1">
                  <p className="text-sm text-gray-500">
                    {oneRocket?.rocket_name}
                  </p>
                </div>
              </div>
            </div>
            <ModalDataList title="flight number" data={oneRocket.id} />
            <ModalDataList
              title="flight number"
              data={oneRocket.first_flight}
            />
            <ModalDataList title="Rocket name" data={oneRocket.rocket_name} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
