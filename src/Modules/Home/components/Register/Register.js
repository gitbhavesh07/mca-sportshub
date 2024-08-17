import { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { REGISTER_USER } from '../../../../Graphql/Mutation/Mutations';
import { RESEND_VERIFY, VERIFY_REGISTERATION } from '../../../../Graphql/Query/Querys';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import ToastMessage from '../../../../toast';
import {VscEye, VscEyeClosed} from 'react-icons/vsc';


const Register = () => {

    const { isSuccess, isError } = ToastMessage();
    const minPassChar = 8;
    const schema = object().shape({
        username: string().required('Username is required'),
        password: string().required('Password is required').min(minPassChar, 'Minimum 8 character is required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,'Required Atleast 1 Upper and Lower Case letter, 1 Special character and  One number.'),
        email: string().email('Email is invalid').required('Email is required'),
        phoneNumber: string().required('Phone number is required').matches(/^[6-9]\d{9}$/, 'Please provide valid phone number')});

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'});

    const [verificationStep, setVerificationStep] = useState('register');

    const navigate = useNavigate();
    const [otpEmail, setOtpEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [error, setError] = useState({
        otp: ''});
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };

    const [registerUser] = useMutation(REGISTER_USER, {
        onCompleted: registerData => {
            const res = registerData.register;
            if (res) {
                isSuccess('Verification Code Sent');
                setVerificationStep('verifyOTP');
            }
        },
        onError: registerError => {
            isError(registerError.message);
        }});

    const registerSubmit = async data => {
        setOtpEmail(data.email);
        await registerUser({
            variables: {
                'registerinputs': {
                    'username': data.username,
                    'email': data.email,
                    'phonenumber': parseInt(data.phoneNumber,10),
                    'password': data.password}}});
    };


    const [verificationcode] = useLazyQuery(VERIFY_REGISTERATION, {
        onCompleted: verificationCodeData => {
            const res = verificationCodeData.verifyRegistrationCode;
            if (res) {
                isSuccess('User Registered Sucessfully');
                navigate('/login');
            }
        },
        onError: verificationCodeError => {
            isError(verificationCodeError.message);
        }});

    const validateOTP = () => {
        let valid = true;
        const errorsCopy = { ...error };
        if (otp.length === 0) {
            errorsCopy.otp = 'otp is required';
            valid = false;
        } else {
            errorsCopy.otp = '';
        }
        setError(errorsCopy);
        return valid;
    };

    const handleVerifyOTP = async e => {
        e.preventDefault();
        if (validateOTP()) {
            verificationcode({
                variables: {
                    'code': otp,
                    'username': otpEmail}});
        }
    };

    const [resendverificationcode] = useLazyQuery(RESEND_VERIFY, {
        onCompleted: resendVerificationCodeData => {
            const res = resendVerificationCodeData.resendVerificationCode;
            if (res) {
                isSuccess('Resended OTP Sucessfully');
            }
        }});

    const handleResendOTP = () => {
        resendverificationcode({
            variables: {
                'username': otpEmail}});
    };

    return (
        <div className="fpassword-container">
            {verificationStep === 'register' && (
                <div className='reg-form'>
                    <h2>Registration</h2>
                    <form onSubmit={handleSubmit(registerSubmit)}>
                        <div className="reg-form-group">
                            <label className="reg-form-label"> Username:</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                {...register('username')}
                            />
                            <span className={errors.username ? 'username-box-visible' : 'username-box'}>*{errors.username ? errors.username.message : ''}</span>
                        </div>
                        <div className="reg-form-group">
                            <label className="reg-form-label"> Password:</label>
                            <span className='password-icon'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    name="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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
                        <div className="reg-form-group">
                            <label className="reg-form-label"> Email Id:</label>
                            <input
                                type="email"
                                placeholder="Enter email Id"
                                name="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                {...register('email')}
                            />
                            <span className={errors.email ? 'password-box-visible' : 'password-box'}>*{errors.email ? errors.email.message : ''}</span>
                       </div>
                        <div className="reg-form-group">
                            <label className="reg-form-label"> Phone Number:</label>
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                name="phoneNumber"
                                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                {...register('phoneNumber')}
                            />
                            <span className={errors.phoneNumber ? 'phone-box-visible' : 'phone-box'}>*{errors.phoneNumber ? errors.phoneNumber.message : ''}</span>
                        </div>
                        <button className="btn btn-success">Submit</button>
                    </form>
                </div>
            )}
            {verificationStep === 'verifyOTP' && (
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
            )}
        </div>
    );
};

export default Register;


