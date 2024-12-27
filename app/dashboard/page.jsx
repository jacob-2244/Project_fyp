'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Sidebar from '../components/Sidebar';
import Header from '../components/header';
import Master from '@/app/components/master';
import { BounceLoader } from 'react-spinners'; // Import the loader

export default function Home() {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
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
    else {
        return (
            <div>
                <Master />
            </div>
        );
    }
}
