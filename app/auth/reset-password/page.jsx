'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/app/firebase/config'; 
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { BounceLoader } from 'react-spinners';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (token) {
            router.push('/dashboard');
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
                <BounceLoader color="#4C51BF" size={60} />
                <p className="mt-4 text-gray-700">Loading, please wait...</p>
            </div>
        );
    }

    const resetPassword = async () => { 
        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }

        const userRef = collection(db, 'users');
        const q = query(userRef, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert('No user found with this email address.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent successfully.');
            router.push("/auth/login");
        } catch (e) {
            alert('Failed to send password reset email. Please try again.');
            console.error(e);
        }
    }

    return (
        <div className={styles.body}>
            <div className={styles.main}>
                {/* Sign Up Form */}
                <div className={`${styles.signup}`}>
                    <div>
                        <label className={`${styles.label} ${styles.signupText}`} htmlFor="chk" hidden>
                            <Link href='/auth/signup'> Sign up</Link>
                        </label>
                    </div>
                </div>

                {/* Login Form */}
                <div className={`${styles.login} ${styles.activeLogin}`}>
                    <div>
                        <label className={`${styles.label} ${styles.loginText}`} htmlFor="chk" hidden>Reset</label>
                        <input
                            className={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <Link href="/auth/login" className={styles.forgotPassword}>
                            Back to Login
                        </Link> 
                        <button type="button" className={`${styles.button}`} onClick={resetPassword}>Reset Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
