'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/firebase/config';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/header';
import Cookies from 'js-cookie';
import { BounceLoader } from 'react-spinners';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

export default function Contact({ children, page }) {
    const router = useRouter();
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    const [number, setNumber] = useState('');
    const user1 = auth.currentUser;
    const userId = user1 ? user.uid : null;
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarState, setSidebarState] = useState(false); // State to control Sidebar

    const toggleSidebar = () => {
        setSidebarState((prev) => !prev); // Toggle Sidebar state
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarState) {
                setSidebarState(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [sidebarState]);

    useEffect(() => {
        const token = Cookies.get('token');

        if (!token) {
            router.push('/auth/login');
        }

        if (!loading) {
            setIsLoading(false);
        }
    }, [router]);

    setTimeout(() => {
        setIsLoading(false);
    }, 1000);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
                <BounceLoader color="#4C51BF" size={60} />
                <p className="mt-4 text-gray-700">Loading, please wait...</p>
            </div>
        );
    }

    const SaveContact = async (event) => {
        event.preventDefault();

        if (!userId) {
            alert('You must be logged in to save contact information.');
            return;
        }
        const db = getFirestore();
        const userRef = doc(db, 'users', userId);
        try {
            // Merge new number field with existing data without overwriting other fields
            await setDoc(userRef, { contact: { number: number } }, { merge: true });
            console.log('Contact information added successfully!');
            alert('Contact Information Saved');
        } catch (error) {
            console.error('Error adding contact info: ', error);
        }
    };

    return (
        <>

            <div className="flex h-screen bg-gray-200 font-roboto">

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <h2>Add your Contact Information Here</h2>
                        <div className="mt-4">
                            <h4 className="text-gray-600"> </h4>
                            <div className="mt-4">
                                <div className="w-full bg-white shadow-md rounded-md overflow-hidden border">
                                    <form>
                                        <div className="flex justify-between items-center px-5 py-3 text-gray-700 border-b">
                                            <h3 className="text-sm">Add Contact Information </h3>
                                            <button type="button">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="px-5 py-6 bg-gray-200 text-gray-700 border-b">
                                            <label className="text-xs">Data you want to add - number format is :  </label>
                                            <div className="mt-2 relative rounded-md shadow-sm">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                                                    </svg>
                                                </span>
                                                <input type="number"
                                                    value={number}
                                                    onChange={(e) => setNumber(e.target.value)}
                                                    className="form-input w-full px-12 py-2 appearance-none rounded-md focus:border-indigo-600" />
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center px-5 py-3">
                                            <button type="button" className="px-3 py-1 text-gray-700 text-sm rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none">Cancel</button>
                                            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-500 focus:outline-none" onClick={SaveContact}>Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}; 