import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FORGOT_PASSWORD, SET_PASSWORD } from '../../../../Graphql/Mutation/Mutations';
import { useMutation } from '@apollo/client';
import './ForgotPassword.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, ref } from 'yup';
import ToastMessage from '../../../../toast';
import {VscEye, VscEyeClosed} from 'react-icons/vsc';


const ForgotPassword = () => {

    const{ isSuccess, isError } = ToastMessage();
    const navigate = useNavigate();
    const [verifyStep, setVerifyStep] = useState('email');
    const [email, setEmail] = useState('');
    const passwordLength = 8;

    const [error, setError] = useState({
        email: ''});
    const [showNPassword, setShowNPassword] = useState(false);
    const toggleNPasswordVisibility = () => {
    setShowNPassword(!showNPassword);
    };
    const [showCPassword, setShowCPassword] = useState(false);
    const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
    };

    const [forgotpassword] = useMutation(FORGOT_PASSWORD, {
        onCompleted: data => {
            const res = data.forgotPassword;
            if (res) {
                isSuccess('Mail Send Sucessfully');
                setVerifyStep('otpverify');
            }
        },
        onError: error => {
            isError(error.message);
        }});

    const checkEmail = async e => {
        e.preventDefault();
        setEmail(email.trim());
        if (emailValidate()) {
            forgotpassword({
                variables: {
                    email}});
        }
    };

    const emailValidate = () => {

        let valid = true;
        const errorsCopy = { ...error };
        if (email.length === 0) {
            errorsCopy.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errorsCopy.email = 'Email is invalid';
            valid = false;
        } else {
            errorsCopy.email = '';
        }

        setError(errorsCopy);
        return valid;
    };

    const schema = object().shape({
        Npassword: string()
          .required('Password is required')
          .min(passwordLength, 'Minimum 8 characters are required')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,'Required Atleast 1 Upper and Lower Case letter, 1 Special character and  One number.'),
        Cpassword: string()
          .oneOf([ref('Npassword'), null], 'Passwords must match')
          .required('Confirm Password is required'),
        verificationCode: string().required('OTP is required')});

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'});

    const [setpassword] = useMutation(SET_PASSWORD, {
        onCompleted: data => {
            const res = data.setPassword;
            if (res) {
                isSuccess('Password Changed Sucessfully');
                navigate('/login');
            }
        },
        onError: error => {
            console.log(error.message);
            isError(error.message);
        }});

    const setPasswordForm = async data => {
        await setpassword({
            variables: {
                'updatePasswordInputs': {
                    email,
                    'newpassword': data.Cpassword,
                    'verifycode': data.verificationCode}}});
    };

    const handleReSend = () => {
        forgotpassword({
            variables: {
                email}});
    };

    return (
        <>
            {
                verifyStep === 'email' && (
                    <div className='fpassword-container'>
                        <div className='fpassword-form'>
                            <h2>Forgot Password</h2>
                            <form>
                                <div className='fpassword-form-group'>
                                    <label className='fpassword-form-label'> Email:</label>
                                    <input
                                        type='text'
                                        placeholder='E-Mail'
                                        name='email'
                                        className='form-control'
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    {error.email && <div className='invalid-feedback'>{error.email}</div>}
                                </div>
                                <button className='btn btn-success' onClick={e => { checkEmail(e); }}>SUBMIT</button>
                            </form>
                        </div>
                    </div>
                )
            }
            {
                verifyStep === 'otpverify' && (
                    <div className='login-container'>
                        <div className='login-form'>
                            <h2>Forgot Password</h2>
                            <form onSubmit={handleSubmit(setPasswordForm)}>
                                <div className='login-form-group'>
                                    <label className='login-form-label'> New Password:</label>
                                    <span className='password'>
                                        <input
                                            type={showNPassword ? 'text' : 'password'}
                                            placeholder='New Password'
                                            name='new password'
                                            className='form-control'
                                            {...register('Npassword')}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={toggleNPasswordVisibility}
                                            data-testid="toggleNPasswordVisibility"
                                        >
                                            {showNPassword ? <VscEye className='icon'/> : <VscEyeClosed className='icon'/>}
                                        </button>
                                    </span>
                                    <span className={errors.Npassword ? 'Npassword-box-visible' : 'Npassword-box'}>*{errors.Npassword ? errors.Npassword.message : ''}</span>
                                </div>
                                <div className='login-form-group'>
                                    <label className='login-form-label'> Conform Password:</label>
                                    <span className='password'>
                                        <input
                                            type={showCPassword ? 'text' : 'password'}
                                            placeholder='Conform Password'
                                            name='password'
                                            className='form-control'
                                            {...register('Cpassword')}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={toggleCPasswordVisibility}
                                            data-testid="toggleCPasswordVisibility"
                                        >
                                            {showCPassword ? <VscEye className='icon'/> : <VscEyeClosed className='icon'/>}
                                        </button>
                                    </span>
                                    <span className={errors.Cpassword ? 'Cpassword-box-visible' : 'Cpassword-box'}>*{errors.Cpassword ? errors.Cpassword.message : ''}</span>
                                </div>
                                <div className='login-form-group'>
                                    <label className='login-form-label'> OTP:</label>
                                    <input
                                        type='text'
                                        placeholder='OTP'
                                        name='otp'
                                        className='form-control'
                                        {...register('verificationCode')}

                                    />
                                    <span className={errors.verificationCode ? 'verificationCode-box-visible' : 'verificationCode-box'}>*{errors.verificationCode ? errors.verificationCode.message : ''}</span>
                                </div>
                                <div className='login-form-fpassword'>
                                    <a className='resend' onClick={() => { handleReSend(); }} data-testid='handleReSend'>Resend</a>
                                </div>
                                <button className='btn btn-success'>SUBMIT</button>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );

};

export default ForgotPassword;
