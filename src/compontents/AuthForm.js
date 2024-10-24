import React, { useState, useEffect } from 'react'

import '../styles/auth-form.css'
import logo from '../assets/logo.svg'
import logoMax from '../assets/logoMax.svg'
import lightbulb from '../assets/lightbulb.svg'
import passShow from '../assets/passShow.svg'

function AuthForm() {
    const [mode, setMode] = useState(true);
    const [web, setWeb] = useState(false);
    const [logoSrc, setLogoSrc] = useState(logo);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992 && !web) {
                setLogoSrc(logoMax)
                setWeb(true);
            } else if (window.innerWidth <= 992 && web) {
                setLogoSrc(logo)
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

    return (
        <div className="auth-general">
            <div className="auth-form__top-container">
                <img src={logoSrc} alt="logo" className='auth-form_logo' />
                <button
                    className="auth-form_light-mode-btn">
                    <img src={lightbulb} alt="lightbulb" className="auth-form_lightbulb" />
                </button>
            </div>
            <div className='auth-form'>
                <div className="auth-form__header-container">
                    <div className="auth-form_header">
                        <button
                            className="auth-form_light-mode-btn">
                            <img src={lightbulb} alt="lightbulb" className="auth-form_lightbulb" />
                        </button>
                        <h1>Sign {mode ? 'Up' : 'In'}</h1>
                        {mode && (
                            <p>Already have an account? <span onClick={() => setMode(!mode)}>Log in</span></p>
                        )}
                        {!mode  && (
                            <p>Don't have an account yet? <span onClick={() => setMode(!mode)}>Sign up</span></p>
                        )}
                    </div>
                </div>
                <div className="auth-form__form-container">
                    <form>
                    {mode && (
                        <div className="auth-form__name-container">
                            <input type="text"
                                placeholder="Full Name"
                                id='fullNameInput'
                                required />
                            <input type="text"
                                placeholder="Last name"
                                id='lastNameInput'
                                required />
                        </div>
                    )}
                    <input type="email"
                        placeholder="Email"
                        id='emailInput'
                        required/>
                    <div className="auth-form__password-container">
                        <input type="password"
                            placeholder="Password"
                            id='passwordInput'
                            required />
                        <img src={passShow}
                            className='password-eye'
                            alt='password eye'/>
                    </div>
                    <button type="submit">
                        {mode ? 'Create account' : 'Sign In'}
                    </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;
