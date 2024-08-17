import React, { useState } from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import captchaBg from '../../../../Images/captcha-bg.png';
import './Login.css';
import { useLazyQuery } from '@apollo/client';
import { CONFIRM_REGISTERATION, RESEND_CONFIRM_REGISTERATION, LOGIN_USER } from '../../../../Graphql/Query/Querys';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';
import {VscEye, VscEyeClosed} from 'react-icons/vsc';



const Login = () => {

    const { setProfile, setId, captchaValue, generateCaptcha, handleReloadCaptcha } = useUserContext();
    const { isSuccess, isError } = ToastMessage();
    const minPassChar = 8;

    const schema = object().shape({
        email: string().email('Email is invalid').required('Email is required'),
        password: string().required('Password is required').min(minPassChar, 'Minimum 8 character is required')});

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'});

    const [email, setEmail] = useState('');
    const [inputCaptcha, setInputCaptcha] = useState('');
    const [confiramationStep, setConfirmationStep] = useState('no');
    const [otp, setOTP] = useState('');

    const [error, setError] = useState({
        captcha: '',
        otp: ''});
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };

    const navigate = useNavigate();

    const [login] = useLazyQuery(LOGIN_USER, {
        onCompleted: loginData => {
            const res = loginData.login;
            if (res) {
                const token = res.AccessToken;
                const lastLogin = new Date();
                localStorage.setItem('token', token);
                localStorage.setItem('name', res.userName);
                localStorage.setItem('id', res.userId);
                localStorage.setItem('refreshtoken', res.RefreshToken);
                localStorage.setItem('last-login', lastLogin.toString());
                setProfile(localStorage.getItem('name'));
                setId(localStorage.getItem('id'));
                navigate('/dashboard/');

            }
        },
        onError: loginError => {
            isError(loginError.message);
            if (loginError.message === 'User is not confirmed.') {
                setConfirmationStep('yes');
            }
        }});

    const [confirmregisteration] = useLazyQuery(CONFIRM_REGISTERATION, {
        onCompleted: confirmRegisterData => {
            const res = confirmRegisterData.confirmEmail;
            if (res) {
                setConfirmationStep('no');
            }
        },
        onError: confirmRegisterError => {
            isError(confirmRegisterError.message);
        }});

    const [resendconfirmregisteration] = useLazyQuery(RESEND_CONFIRM_REGISTERATION, {
        onCompleted: resendConfirmRegisterData => {
            console.log("Inside Resend completed",resendConfirmRegisterData);
            const res = resendConfirmRegisterData.resendConfirmationCode;
            if (res) {
                isSuccess('OTP resended Sucessfully');
            }
        }});

    const loginForm = async data => {
        setEmail(data.email);
        if (validateForm()) {
            login({
                variables: {
                    'logininputs': {
                        'username': data.email,
                        'password': data.password}}});
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...error };

        if (inputCaptcha.length !== captchaValue.length || inputCaptcha !== captchaValue) {
            errorsCopy.captcha = 'Invalid captcha';
            valid = false;
            setTimeout(() => {
                setInputCaptcha('');
                generateCaptcha();
            }, 2000);
        } else {
            errorsCopy.captcha = '';
        }
        setError(errorsCopy);
        return valid;
    };

    const validateOTP = () => {
        let valid = true;
        const errorsCopy = { ...errors };
        if (otp.length === 0) {
            errorsCopy.otp = 'otp is required';
            valid = false;
        } else {
            errorsCopy.otp = '';
        }
        setError(errorsCopy);
        return valid;
    };

    const handleVerifyOTP = e => {
        e.preventDefault();
        if (validateOTP()) {
            confirmregisteration({
                variables: {
                    'confirmationCode': otp,
                    'username': email}});
        }
    };

    const handleResendOTP = () => {
        resendconfirmregisteration({
            variables: {
                'username': email}});
    };

    return (
        <div className="fpassword-container">
            {confiramationStep === 'no' && (
                <div className='login-form'>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit(loginForm)}>
                        <div className="login-form-group">
                            <label className="login-form-label"> E-Mail:</label>
                            <input
                                type="text"
                                placeholder="Enter email"
                                name="email"
                                className='form-control'
                                {...register('email')}
                            />
                            <span className={errors.email ? 'email-box-visible' : 'email-box'}>*{errors.email ? errors.email.message : ''}</span>
                        </div>
                        <div className="login-form-group">
                            <label className="login-form-label"> Password:</label>
                            <span className='password'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    name="password"
                                    className='form-control'
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    data-testid = 'toggleNPasswordVisibility'
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <VscEye className='icon'/> : <VscEyeClosed className='icon'/>}
                                </button>
                            </span>
                            <span className={errors.password ? 'password-box-visible' : 'password-box'}>*{errors.password ? errors.password.message : ''}</span>
                        </div>
                        <div className="login-form-group">
                            <div className='login-form-captcha'>
                                <input
                                    type='text'
                                    placeholder='Fill Captcha'
                                    value={inputCaptcha}
                                    onChange={e => setInputCaptcha(e.target.value.toUpperCase())}
                                    className='login-captcha'
                                />
                                <img src={captchaBg} alt='login-captcha-background' />
                                <span className='captcha'>{captchaValue}</span>
                                <p>
                                    <button className='reload' onClick={handleReloadCaptcha}>
                                        <AiOutlineReload />
                                    </button>
                                </p>
                            </div>
                            <span className={error.captcha ? 'captcha-box-visible' : 'captcha-box'}>*{error.captcha ? error.captcha : ''}</span>
                        </div>
                        <button className="btn btn-success">Login</button>
                    </form>
                    <div className='login-form-fpassword'>
                        <Link to='/Forgot-Password'>Forgot Password?</Link>
                        <p>New User? <Link to='/register'>Click Here</Link></p>
                    </div>

                </div>)}
            {confiramationStep === 'yes' && (
                // <div className="fpassword-container">
                <div className="fpassword-form">
                    <form>
                        <label className="fpassword-form-label"> OTP:</label>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            name="OTP"
                            className={`form-control ${error.otp ? 'is-invalid' : ''}`}
                            value={otp}
                            onChange={e => setOTP(e.target.value)}
                        />
                        {error.otp && <div className="invalid-feedback">{error.otp}</div>}
                        <div className='login-form-fpassword'>
                            <a className="resend" onClick={() => handleResendOTP()}>Resend</a>
                        </div>
                        <button className="btn btn-success" onClick={e => handleVerifyOTP(e)}>Submit </button>
                    </form>
                </div>
                // </div>
            )}
        </div>
    );
};

export default Login;
