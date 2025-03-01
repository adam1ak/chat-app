import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import app from '../firebase-config.js';

import '../styles/auth-form.css'
import logo from '../assets/logo.svg'
import logo_light from '../assets/logo_light.svg'
import logoMax from '../assets/logoMax.svg'
import logoMax_light from '../assets/logoMax_light.svg'
import lightbulb from '../assets/lightbulb.svg'
import lightbulb_light_mode from '../assets/lightbulb_light_mode.svg'
import passShow from '../assets/passShow.svg'

function AuthForm() {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [mode, setMode] = useState('register');
    const [web, setWeb] = useState(false);
    const [bulbSrc, setBulbSrc] = useState(lightbulb);
    const [logoSrc, setLogoSrc] = useState(logo);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.body.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme);
        if(theme === 'light') {
            setBulbSrc(lightbulb_light_mode)
            if(web) {
                setLogoSrc(logoMax_light)
            }else{
                setLogoSrc(logo_light)
            }
        }
    }, [theme]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992 && !web) {
                if (theme === 'light') {
                    setLogoSrc(logoMax_light)
                } else {
                    setLogoSrc(logoMax)
                }
                setWeb(true);
            } else if (window.innerWidth <= 992 && web) {
                if (theme === 'light') {
                    setLogoSrc(logo_light)
                } else {
                    setLogoSrc(logo)
                }
                setWeb(false);
            }
        };

        window.addEventListener('resize', handleResize);

        // Check the screen size initially
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [web]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            navigate("/dashboard");
          }
        });
        
        return () => {};
      }, [auth, navigate]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
        setBulbSrc(theme === "light" ? lightbulb : lightbulb_light_mode)
        if(web) {
            setLogoSrc(theme === "light" ? logoMax : logoMax_light)
        }else{
            setLogoSrc(theme === "light" ? logo : logo_light)
        }

    }


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState(''); // State for first name
    const [lastName, setLastName] = useState(''); // State for last name

    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('Registration successful!', { email, firstName, lastName });
                const docRef = doc(db, "users", user.uid);
                const payload = { email, firstName, fullName: (firstName + lastName).toLowerCase(), lastName, uid: user.uid, pfpSrc: 'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg' };
                setDoc(docRef, payload);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log({ errorCode, errorMessage })
            });
    }

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log('Login successful!', { email });
                navigate('/dashboard');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log({ errorCode, errorMessage })
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            return;
        }

        if (mode === 'register') {
            console.log('Registering...');
            register();
        } else {
            console.log('Logging in...');
            login();
        }

        // Clear form after submission
        setEmail('');
        setPassword('');
        setFirstName(''); // Clear first name
        setLastName(''); // Clear last name
    };

    const showPassword = () => {
        const passInput = document.getElementById('passwordInput');
        if (passInput.type === 'password') {
            passInput.type = 'text';
        } else {
            passInput.type = 'password';
        }
    }

    return (
        <div className="auth-general">
            <div className="auth-form__top-container">
                <img src={logoSrc} alt="logo" className='auth-form_logo' />
                <button
                    className="auth-form_light-mode-btn"
                    onClick={toggleTheme}>
                    <img src={bulbSrc} alt="lightbulb" className="auth-form_lightbulb" />
                </button>
            </div>
            <div className='auth-form'>
                <div className="auth-form__header-container">
                    <div className="auth-form_header">
                        <button
                            className="auth-form_light-mode-btn"
                            onClick={toggleTheme}>
                            <img src={bulbSrc} alt="lightbulb" className="auth-form_lightbulb" />
                        </button>
                        <h1>Sign {mode === 'register' ? 'Up' : 'In'}</h1>
                        {mode === 'register' && (
                            <p>Already have an account? <span onClick={() => setMode('login')}>Log in</span></p>
                        )}
                        {mode === 'login' && (
                            <p>Don't have an account yet? <span onClick={() => setMode('register')}>Sign up</span></p>
                        )}
                    </div>
                </div>
                <div className="auth-form__form-container">
                    <form onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <div className="auth-form__name-container">
                                <input type="text"
                                    placeholder="First Name"
                                    id='firstNameInput'
                                    value={firstName}
                                    required
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <input type="text"
                                    placeholder="Last name"
                                    id='lastNameInput'
                                    value={lastName}
                                    required
                                    onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        )}
                        <input type="email"
                            placeholder="Email"
                            id='emailInput'
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)} />
                        <div className="auth-form__password-container">
                            <input type="password"
                                placeholder="Password"
                                id='passwordInput'
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)} />
                            <img src={passShow}
                                className='password-eye'
                                alt='password eye'
                                onClick={showPassword} />
                        </div>
                        <button type="submit">
                            {mode === 'register' ? 'Create account' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;
