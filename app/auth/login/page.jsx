'use client';
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getIdToken, sendEmailVerification, getAuth, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { BounceLoader } from 'react-spinners';

const SignIn = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

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

    const handleSignIn = async (event) => {
        event.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(loginEmail, loginPassword);
            const user = res.user;
            console.log({ res });
            sessionStorage.setItem('user', true);
            setLoginEmail('');
            setLoginPassword('');
            if (!user.emailVerified) {
                alert('Please verify your email address before signing in.');
                await signOut(auth); // Optionally, log out the user
                return;
            }
            const idToken = await res.user.getIdToken();
            document.cookie = `token=${idToken}; path=/;`;
            router.push('/dashboard');
        } catch (e) {
            alert('Invalid email or password. Please try again.');
            console.error(e);
        }
    };

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
                    <form onSubmit={handleSignIn}>
                        <label className={`${styles.label} ${styles.loginText}`} htmlFor="chk" hidden>Login</label>
                        <input
                            className={styles.input}
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <input
                            className={styles.input}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            required
                        />
                        <Link href="/auth/reset-password" className={styles.forgotPassword} >
                            Forgot Password?
                        </Link>
                        <button type="submit" className={`${styles.button}`}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
