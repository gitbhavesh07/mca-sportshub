import React, { useState, useEffect } from 'react';
import UPLOAD from '../../../../Images/UPLOAD.png';
import './PlayerHandler.css';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { CREATE_PLAYER, UPDATE_PLAYER } from '../../../../Graphql/Mutation/Mutations';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, mixed } from 'yup';
import { GET_PRESIGNED_URL, FIND_ONE_PLAYER, FIND_AUCTION } from '../../../../Graphql/Query/Querys';
import axios from 'axios';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';
import CreatableSelect from 'react-select/creatable';
import pprofile from '../../../../Images/playerprofile.jpg';
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';


const PlayerHandler = ({ editMode }) => {

  const { isSuccess, isError } = ToastMessage();
  const { setHeader, componentRef } = useUserContext();
  const [options, setOptions] = useState([]);
  const [inputData, setInputData] = useState({});
  const [loading, setLoading] = useState(true);
    const {playerid, id } = useParams();
  const navigate = useNavigate();
  const [selectCategory, setSelectCategory] = useState('');
  const TotalMB = 5;
  const oneMB = 1024;
  const validAge = 3;

  const schema = object().shape({
    playerName: string().required('Auction name is required'),
    mobileNo: string().required('Phone number is required').matches(/^[6-9]\d{9}$/, 'Please provide valid phone number'),
    playerFatherName: string().required('Field is required'),
    age: string()
      .test('age', 'Valid Age  only Allowed', function (value) {
        return value.length < validAge;
      })
      .required('Age is required'),
    tShirt: string().test('tShirt', 'Field is Required', function (value) {
      return value !== 'SELECT';
    }),
    trouser: string().test('trouser', 'Field is Required', function (value) {
      return value !== 'SELECT';
    }),
    address: string().required('Field is required'),
    photo: mixed().test('filesize', 'Image must be below 5MB', function (value) {
      if (value instanceof File) {
        return value.size <= TotalMB * oneMB * oneMB;
      }
      return true;
    }).test('fileType', 'Invalid file type', function (value) {
      if (value instanceof File) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return allowedTypes.includes(value.type);
      }
      return true;
    }).test('imageRequired', 'Image is required', function (value) {
      return !(!(editMode) && !(value instanceof File));
    }),
    category: string().test('category', 'Please, Select the Category', function (value) {
      return value && value.length !== 0;
    })});

  const { register, handleSubmit, setValue, trigger, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'});

  const [fileName, setFileName] = useState('');
  const [file,setFile] = useState('');
  const [initialFile, setInitialFile] = useState('');

  useEffect(()=>{
    findAuction({
      variables:{
        id}});
  },[id]);

  useEffect(() => {
    if (editMode) {
      findPlayer({
        variables:{
           'id':playerid}});
    }
  },[editMode]);


  const [updatePlayer] = useMutation(UPDATE_PLAYER, {
    onCompleted: updatePlayerData => {
      const res = updatePlayerData.updatePlayer;
      if (res) {
        isSuccess('Player Updated Successfully!');
          navigate(-1);
      }
    },
    onError: updatePlayerDataError => {
      isError(updatePlayerDataError.message);
    }});

  const [findAuction] = useLazyQuery(FIND_AUCTION, {
    onCompleted: findAuctionData => {
      const res = findAuctionData.findAuction;
      if (res) {
        const newOption = res.category.map(item=>(
          { value: item, label: item}
        ));
        setOptions([...newOption]);
      }
    }});

  const [findPlayer] = useLazyQuery(FIND_ONE_PLAYER, {
    onCompleted: findPlayerData => {
      const res = findPlayerData.findOnePlayer;
      if (res) {
        setValue('playerName', res.playername);
        setValue('mobileNo', res.mobilenumber);
        setValue('playerFatherName', res.fathername);
        setValue('age', res.playerage);
        const selectedCategory = { value: res.playercategory, label: res.playercategory };
        setSelectCategory(selectedCategory)
        setValue('category', res.playercategory);
        setValue('tShirt', res.tshirtsize);
        setValue('trouser', res.trousersize);
        setValue('address', res.address);
        setInitialFile(res.playerfilename);
        setLoading(false)
              }
    }});

      useEffect(() => {
    if (editMode) {
      setHeader('Edit Player');
    }else {
      const head = componentRef.current?.id;
      setHeader(head);
    }
  }, [componentRef, setHeader, editMode]);

  const handleImageChange = event => {
    const file = event.target.files[0];
    setFile(file.name.replace(/\s+/g, ''));
    setFileName(file);
    setValue('photo', file);
    trigger('photo');
  };


  const [createplayer] = useMutation(CREATE_PLAYER, {
    onCompleted: createplayerData => {
      const res = createplayerData.createPlayer;
      if (res) {
        isSuccess('Player Added Sucessfully');
          setFileName('');
          reset();
      }
    },
    onError: createplayerError => {
      console.log("error",createplayerError.message);
      isError(createplayerError.message);
    }});

  async function uploadFileToUrl(url, fileData) {
    try {
      const response = await axios.put(url, fileData, {
        headers: {
          'Content-Type': 'application/octet-stream'}});
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async function createOrUpdatePlayer(
    id,
    inputData,
    finalUrl,
    editMode,
    updatePlayer,
    createplayer) {
    const commonPlayerData = {
      playername: inputData.playerName,
      address: inputData.address,
      playercategory: inputData.category,
      fathername: inputData.playerFatherName,
      mobilenumber: parseInt(inputData.mobileNo,10),
      playerage: parseInt(inputData.age,10),
      playerfilename: finalUrl,
      trousersize: inputData.trouser,
      tshirtsize: inputData.tShirt};

    if (editMode) {
      await updatePlayer({
        variables: {
          playerid: playerid,
          updatePlayerInput:{ 
            ...commonPlayerData,
            auction_id: id}}});
    } else {
      await createplayer({
        variables: {
          createPlayerInput: {
            ...commonPlayerData,
            auction_id: id}}});
    }
  }

  const [getSignerUrlForUpload] = useLazyQuery(GET_PRESIGNED_URL, {
    onCompleted: async data => {
      const res = data.getSignerUrlForUpload;
      if (res) {
        const url = res.split('?')[0];
        const finalUrl = url.split(process.env.REACT_APP_AWS_ENDPOINT_URL)[1];
        const uploadSuccess = await uploadFileToUrl(res, fileName);

        if (uploadSuccess) {
          createOrUpdatePlayer(id, inputData, finalUrl, editMode, updatePlayer, createplayer);
        } else {
         isError('Error uploading photo');
        }
      }
    },
    onError: error => {
      isError(error.message);
    }});


  const submitForm = async data => {
    setInputData({ ...data });
    console.log("OnSubmitForm",data.category);
    if (fileName) {
      const uuid = uuidv4();
      const uniquefilename = `uploads/${moment().unix()}-${uuid}`;
      await getSignerUrlForUpload({
        variables: {
          'filename': uniquefilename}});
    }else {
      await updatePlayer({
        variables: {
          'playerid': playerid,
          'updatePlayerInput': {
            'playername': data.playerName,
            'address': data.address,
            'playercategory': data.category,
            'fathername': data.playerFatherName,
            'mobilenumber': parseInt(data.mobileNo,10),
            'playerage': parseInt(data.age,10),
            'playerfilename': initialFile,
            'trousersize': data.trouser,
            'tshirtsize': data.tShirt,
            'auction_id':id}}});
    }
  };

  const handleChange = (newValue) => {
    console.log('Selected options:', newValue);
    setValue('category',newValue.value);
    setSelectCategory(newValue)
    trigger('category');
  };
  const handleCreateOption = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions([...options, newOption]);
  };
  if (loading && editMode) {
    return <div className='loading'>
    <ReactLoading type="bars" color="rgb(255, 196, 0)"
      height={100} width={50} />
   </div>;
  }

  return (
    <div className='AddPlayer-container' id='Add Players' ref={componentRef}>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className='AddPlayer-form'>
          <div className='AddPlayer-input1'>
            <input
              id='fileInput'
              type='file'
              name='photo'
              data-testid='photo'
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <label htmlFor='fileInput' className='upload-image'>
              <img
                src={fileName ? URL.createObjectURL(fileName) : editMode ? `https://d293laha5n7chi.cloudfront.net/${initialFile}` : UPLOAD}
                alt='Selected'
                onError={e => {
                  e.target.src = pprofile;
                }}
              />
            </label>
            <span className={errors.photo ? 'photo-box-visible' : 'photo-box'}>*{errors.photo ? errors.photo.message : ''}</span>
            {fileName && <h6>Selected File: {fileName.name}</h6>}
            <label>Name</label>
            <input
              name='playerName'
              type='text'
              data-testid='playerName'
              {...register('playerName')}
            />
            <span className={errors.playerName ? 'playerName-box-visible' : 'playerName-box'}>*{errors.playerName ? errors.playerName.message : ''}</span>
            <label>Mobile No</label>
            <input
              name='mobileNo'
              disabled={editMode}
              type='number'
              data-testid='mobileNo'
              {...register('mobileNo')}
            />
            <span className={errors.mobileNo ? 'mobileNo-box-visible' : 'mobileNo-box'}>*{errors.mobileNo ? errors.mobileNo.message : ''}</span>
            <label>Father Name</label>
            <input
              name='playerFatherName'
              type='text'
              data-testid='playerFatherName'
              {...register('playerFatherName')}
            />
            <span className={errors.playerFatherName ? 'playerFatherName-box-visible' : 'playerFatherName-box'}>*{errors.playerFatherName ? errors.playerFatherName.message : ''}</span>
            <label>Age</label>
            <input
              name='age'
              type='number'
              data-testid='age'
              {...register('age')}
            />
            <span className={errors.age ? 'age-box-visible' : 'age-box'}>*{errors.age ? errors.age.message : ''}</span>
          </div>
          <div className='AddPlayer-input2'>
            <label>Player Role</label>
                <span className='checkbox'>
                  <CreatableSelect
                    name='category'
                    options={options}
                    value={selectCategory}
                    onCreateOption={handleCreateOption}
                    onChange={handleChange}
                    className='dropdown'
                    placeholder='Add Category...'
                    />
                </span>
            <span className={errors.category ? 'category-box-visible' : 'category-box'}>*{errors.category ? errors.category.message : ''}</span>
            <label>T-shirt size</label>
            <select name='tShirt' {...register('tShirt', { defaultValue: 'Select' })}>
              <option defaultValue='SELECT'>SELECT</option>
              <option value='S'>S</option>
              <option value='M'>M</option>
              <option value='L'>L</option>
              <option value='XL'>XL</option>
              <option value='XXL'>XXL</option>
            </select>
            <span className={errors.tShirt ? 'tShirt-box-visible' : 'tShirt-box'}>*{errors.tShirt ? errors.tShirt.message : ''}</span>
            <label>Trouser</label>
            <select name='trouser' {...register('trouser', { defaultValue: 'Select' })}>
              <option defaultValue='SELECT'>SELECT</option>
              <option value='S'>S</option>
              <option value='M'>M</option>
              <option value='L'>L</option>
              <option value='XL'>XL</option>
              <option value='XXL'>XXL</option>
            </select>
            <span className={errors.trouser ? 'trouser-box-visible' : 'trouser-box'}>*{errors.trouser ? errors.trouser.message : ''}</span>
            <label>Address</label>
            <textarea
              name='address'
              type='text'
              cols='20'
              rows='5'
              data-testid='address'
              {...register('address')}
            />
            <span className={errors.address ? 'address-box-visible' : 'address-box'}>*{errors.address ? errors.address.message : ''}</span>
            <div className='AddPlayer-addbutton'>
              <button type='submit'>{editMode ? 'UPDATE PLAYER' : 'ADD PLAYER'}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlayerHandler;
