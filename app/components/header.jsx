import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '@/app/firebase/config';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Header({ toggleSidebar }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
          if (currentUser) {
            try {
              const userDocRef = doc(db, 'users', currentUser.uid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                setUserData(userDoc.data());
                console.log('User data: ', userDoc.data());
              } else {
                console.error('User document not found');
              }
            } catch (err) {
              console.error('Error fetching user data: ', err);
            } finally {
              setLoading(false);
            }
          } else {
            console.error('No authenticated user found');
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing Firebase Auth Listener:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
          alert('Invalid image type');
          return;
        }

        if (file.size > maxSize) {
          alert('File too large');
          return;
        }

        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64Image = reader.result;

          const currentUser = auth.currentUser;
          if (currentUser) {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
              profileImage: base64Image
            });

            // Update local state
            setUserData(prev => ({
              ...prev,
              profileImage: base64Image
            }));

            alert('Profile image uploaded');
          }
        };
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed');
      }
    }
  };

  if (loading) {
    return null;
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className={`${'text-gray-500 focus:outline-none lg:hidden'}`} >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="relative mx-4 lg:mx-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <input className="w-32 pl-10 pr-4 rounded-md form-input sm:w-64 focus:border-indigo-600" type="text" placeholder="Search" />
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button onClick={() => setNotificationOpen(!notificationOpen)} className="flex mx-4 text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {notificationOpen && (
            <div className="absolute right-0 z-10 mt-2 overflow-hidden bg-white rounded-lg shadow-xl w-80">
              {/* Notification items */}
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="file"
            id="profileImageUpload"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleProfileImageChange}
            className="hidden"
          />
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none"
          >
            <img
              className="object-cover w-full h-full"
              src={userData?.profileImage || "default-avatar-url"}
              alt="Your avatar"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-10 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-xl">
              <label
                htmlFor="profileImageUpload"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white cursor-pointer"
              >
                Change Profile Picture
              </label>
              <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Profile</p>
              <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Name: {userData?.username}</p>
              <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Occupation: {userData?.occupation}</p>
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                onClick={() => {
                  signOut(auth)
                  Cookies.remove('token')
                  sessionStorage.removeItem('user')
                }}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};