'use client';
import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { getIdToken, sendEmailVerification, getAuth, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { BounceLoader } from 'react-spinners';
import Link from 'next/link';

const SignIn = () => {
    const [signUpEmail, setSignUpEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signupOccupation, setSignupOccupation] = useState('');
    const [signUpUsername, setSignUpUsername] = useState('');
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

    const handleSignUp = async (event) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(signUpEmail)) {
            alert('Please use a valid email address.');
            return;
        }
        else {
            event.preventDefault();
            try {
                const res = await createUserWithEmailAndPassword(signUpEmail, signUpPassword);
                if (!res || !res.user) {
                    alert('User Account already exists, Please login');
                    console.log('Failed to retrieve user data from sign-up response');
                }
                const user = res.user;

                await sendEmailVerification(user);
                alert('A verification email has been sent to your email address. Please verify your email.');

                await signOut(auth);
                // const authInstance = getAuth();
                // const intervalId = setInterval(async () => {
                //     await user.reload();
                //     if (user.emailVerified) {
                //         clearInterval(intervalId);
                //         await setDoc(doc(db, 'users', user.uid), {
                //             occupation: signupOccupation,
                //             username: signUpUsername,
                //             email: signUpEmail,
                //         });
                //         alert('Signup successful. Your email has been verified.');
                //         const idToken = await res.user.getIdToken();
                //         document.cookie = `token=${idToken}; path=/;`;
                //         router.push('/dashboard');
                //     }
                // }, 1000); 
                await setDoc(doc(db, 'users', user.uid), {
                    occupation: signupOccupation,
                    username: signUpUsername,
                    email: signUpEmail,
                });
                router.push('/auth/login');
                
            } catch (error) {
                console.error("Errorr Is: ", error);
            }
        }
    };


    return (

        <div className={styles.body}>
            <div className={styles.main}>
                {/* Sign Up Form */}
                <div className={`${styles.signup} ${styles.activeSignup}`}>
                    <form onSubmit={handleSignUp}>
                        <label className={`${styles.label}`} htmlFor="chk" hidden >Sign up</label>
                        <input
                            className={styles.input}
                            value={signUpUsername}
                            onChange={(e) => setSignUpUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                            required
                        />
                        <input
                            className={styles.input}
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            required
                        />
                        <input
                            className={styles.input}
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            required
                        />
                        <div className={styles.occMain}>
                            <div className={styles.occIn}>
                                <label >
                                    <input
                                        className={styles.input1}
                                        type="radio"
                                        name="occupation"
                                        value="doctor"
                                        checked={signupOccupation === "doctor"}
                                        onChange={(e) => setSignupOccupation(e.target.value)}
                                        required
                                    />
                                    Doctor
                                </label>

                                <label >
                                    <input
                                        className={styles.input1}
                                        type="radio"
                                        name="occupation"
                                        value="patient"
                                        checked={signupOccupation === "patient"}
                                        onChange={(e) => setSignupOccupation(e.target.value)}
                                        required
                                    />
                                    Patient
                                </label>
                            </div>
                        </div>


                        {/* <label className={styles.} htmlFor="role">Role</label> */}
                        <button type="submit" className={`${styles.button} ${styles.signupBtn}`}>Sign up</button>
                    </form>
                </div>

                {/* Login Form */}
                <div className={`${styles.login}`}>
                    <div>
                        <label className={`${styles.label1}`} htmlFor="chk" hidden><Link href='/auth/login'> Login </Link></label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
