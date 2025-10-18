"use client";

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/redux/slices/authSlice';

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setShowModal(false);
    router.push('/auth/sign-in');
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
    <div className='w-full bg-anti-flash-white shadow-sm'>
      <div className='w-full md:max-w-[1440px] md:mx-auto flex items-center justify-between p-5 text-rick-black'>
        <div>Product Management App</div>
        <button 
          onClick={handleLogoutClick}
          className='cursor-pointer hover:text-gray-600 transition-colors'
        >
          Logout
        </button>
      </div>
    </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-anti-flash-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl'>
            <h2 className='text-xl font-semibold mb-4'>Confirm Logout</h2>
            <p className='text-rich-black mb-6'>Are you sure you want to logout?</p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={handleCancelLogout}
                className='px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className='px-4 py-2 rounded bg-chestnut text-white cursor-pointer'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;