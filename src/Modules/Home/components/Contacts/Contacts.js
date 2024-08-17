import React, { useRef, useState } from 'react';
import '../Contacts/Contacts.css';
import captchaBg from '../../../../Images/captcha-bg.png';
import emailjs from '@emailjs/browser';
import { useMutation } from '@apollo/client';
import { SEND_CONTACT_FORM } from '../../../../Graphql/Mutation/Mutations';
import { useUserContext } from '../../../../App';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import ToastMessage from '../../../../toast';


const Contacts = () => {

  const { generateCaptcha, handleReloadCaptcha, captchaValue } = useUserContext();

  const{isSuccess,isError}= ToastMessage();
  const schema = object().shape({
    name: string().required('Username is required'),
    email: string().email('Email is invalid').required('Email is required'),
    phoneNumber: string().required('Phone number is required').matches(/^[6-9]\d{9}$/, 'Please provide valid phone number'),
    message: string().required('Message is required')});

const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'});

  const [inputCaptcha, setInputCaptcha] = useState('');
  const [captchaStatus, setCaptchaStatus] = useState('');
  const contactForm = useRef();
  const timer = 2000;

  const removeContent = () => {
    setInputCaptcha('');
    setCaptchaStatus('');
  };

  const handleSend = () => {
    emailjs.sendForm('service_a6cd41e', 'template_2krmoz4', contactForm.current, '6HyNjEiCJHhbMQTdO')
      .then(() => {
        isSuccess('Your message has been received. I will be contact soon.');
      }, error => {
        isError(error.text);
      });
  };

  const [saveContact] = useMutation(SEND_CONTACT_FORM, {
    onCompleted: data => {
      const res = data.createContact;
      if (res) {
        isSuccess(res);
        handleSend();
        setTimeout(() => {
          reset();
          removeContent();
          generateCaptcha();
        }, timer);
      }
    },
    onError: error => {
      isError(error.message);
    }});

  const formSubmit = async data => {
    if (contactValidate()) {
      saveContact({
        variables: {
          'createContactusInput': {
            'username': data.name,
            'email': data.email,
            'phonenumber': parseInt(data.phoneNumber,10),
            'message': data.message}}});
    }
  };

  const contactValidate = () => {
    let isValid = true;
    const inputVal = inputCaptcha.toUpperCase().trim();
    handleCaptcha();

    if (inputVal !== captchaValue) {
      isError('Captcha not matched, Please try Again!');
      isValid = false;
      setTimeout(() => {
        setInputCaptcha('');
        setCaptchaStatus('');
        generateCaptcha();
      }, timer);
    }

    return isValid;
  };

  const handleCaptcha = () => {
    if (inputCaptcha.trim().length === 0 || inputCaptcha.trim() !== captchaValue) {
      setCaptchaStatus('Contactcaptcha-box error');
      return false;
    } else {
      setCaptchaStatus('Contactcaptcha-box success');
      return true;
    }
  };

  const handleClick = value =>{
    setInputCaptcha(value);
    handleCaptcha();
  };

  return (
    <div id='contacts' className='contacts-container'>
      <h2 className='contacts-head'>CONTACT US</h2>
      <div className='underline'></div>
      <div className='contacts-details'>
        <div className='phone-details'>
          <h1>PHONE NUMBER</h1><br />
          <p className='one-no'>+91-83860-11123</p>
          <p className='sec-no'>+91-73750-11123</p>
        </div>
        <div className='separator'></div>
        <div className='email-details'>
          <h1>EMAIL</h1><br />
          <p>superauctionapp@gmail.com</p>
        </div>
      </div>
      <form className='contact-form' ref={contactForm} autoComplete='off' onSubmit={handleSubmit(formSubmit)}>
        <div className='contact-form-3ip'>
          <div className='name-input'>
            <input
              type='text'
              placeholder='Your Name'
              name='userName'
              {...register('name')}
            />
            <span className={errors.name ? 'name-box-visible' : 'name-box'}>*{errors.name ? errors.name.message : ''}</span>
          </div>

          <div className='email-input'>
            <input
              type='text'
              placeholder='Your Email'
              name='userEmail'
              {...register('email')}
            />
            <span className={errors.name ? 'email-box-visible' : 'email-box'}>*{errors.email ? errors.email.message : ''}</span>
          </div>

          <div className='phone-input'>
            <input
              type='text'
              placeholder='Mobile No'
              name='userMobile'
              {...register('phoneNumber')}
            />
            <span className={errors.phoneNumber ? 'phone-box-visible' : 'phone-box'}>*{errors.phoneNumber ? errors.phoneNumber.message : ''}</span>
          </div>

        </div>
        <textarea
          placeholder='Message'
          name='userMessage'
          rows={7}
          cols={20}
          {...register('message')}
        />
        <div className={errors.message ? 'message-box-visible' : 'message-box'}>*{errors.message ? errors.message.message : ''}</div>

        <div className='contact-form-1ip'>
          <input
            type='text'
            placeholder='Fill Captcha'
            value={inputCaptcha}
            onChange={ e => {handleClick(e.target.value.toUpperCase());} }
            className={`${captchaStatus}`}
          />
          <img src={captchaBg} alt='captcha background' />
          <span className='captcha'>{captchaValue}</span>
          <p>
            Can't read the image?{' '}
            <a className='reload' onClick={handleReloadCaptcha}>
              click here
            </a>{' '}
            to refresh
          </p>
        </div>
        <div className='contact-form-button'>
          <button type='submit' className='contact-form-send' onClick={handleSubmit}>Send Message</button>
        </div>
      </form>
    </div>
  );
};

export default Contacts;
