import React, { useState, useEffect } from 'react';
import './AuctionHandler.css';
import 'react-toastify/dist/ReactToastify.css';
import UPLOAD from '../../../../Images/UPLOAD.png';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_AUCTION, UPDATE_AUCTION } from '../../../../Graphql/Mutation/Mutations';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactLoading from 'react-loading';
import { object, string, mixed, array } from 'yup';
import { GET_PRESIGNED_URL, FIND_AUCTION } from '../../../../Graphql/Query/Querys';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../../App';
import ToastMessage from '../../../../toast';
import CreatableSelect from 'react-select/creatable';
import tprofile from '../../../../Images/teamProfile.jpg';
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';

const AuctionHandler = ({ editMode }) => {
  const { isSuccess, isError } = ToastMessage();
  const [inputData, setInputData] = useState({});
  const initialOptions = [
    { value: 'Batting', label: 'Batting' },
    { value: 'Bowling', label: 'Bowling' },
    { value: 'Wicketkeeper', label: 'Wicketkeeper' }];
  const [options, setOptions] = useState(initialOptions);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { userId, setHeader, componentRef } = useUserContext();
  const [loading, setLoading] = useState(true);
  const positiveValueMsg = 'Positive Value is Required';
  const TotalMB = 5;
  const oneMB = 1024;
  const timeOutSeconds = 3000;

  const schema = object().shape({
    list: string().default('cricket'),
    auctionname: string().required('Auction name is required'),
    auctiondate: string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Valid Date is required')
      .test('auctiondate', 'Auction Date Cant be in Past', function (value) {
        const valueDate = new Date(value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return valueDate >= currentDate;
      })
      .required('Auction Date is required'),
    pointsperteam: string()
      .test('pointsperteam', positiveValueMsg, function (value) {
        return value.length <= 7;
      })
      .required('Points per team is required'),
    minimumbid: string()
      .test('minimumbid', positiveValueMsg, function (value) {
        return parseInt(value, 10) >= 0;
      })
      .required('Minimum bid is required'),

    bidincreaseby: string()
      .test('bidincreaseby', positiveValueMsg, function (value) {
        return parseInt(value, 10) >= 0;
      })
      .required('Bid increase by is required'),
    playerperteam: string()
      .test('playerperteam', 'Positive Value is Required ', function (value) {
        return parseInt(value, 10) >= 0;
      })
      .required('Players per team is required'),
    photo: mixed().test('fileType', 'Invalid file type', function (value) {
      if (value instanceof File) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return allowedTypes.includes(value.type);
      }
      return true;
    }).test('filesize', 'Image must be below 5MB', function (value) {
      if (value instanceof File) {
        return value.size <= TotalMB * oneMB * oneMB;
      }
      return true;
    })
      .test('imageRequired', 'Image is required', function (value) {
        return !(!(editMode) && !(value instanceof File));
      }),
    category: array().test('category', 'Please, Select the Category', function (value) {
      return value && value.length !== 0;
    })});

  const { register, handleSubmit, setValue, trigger, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'});

  const [findAuction] = useLazyQuery(FIND_AUCTION, {
    onCompleted: findAuctionData => {
      const res = findAuctionData.findAuction;
      if (res) {
        setValue('auctionname', res.auctionname);
        setValue('auctiondate', res.auctiondate);
        setValue('bidincreaseby', res.bidincrease);
        setValue('minimumbid', res.minbid);
        setValue('playerperteam', res.playerperteam);
        setValue('pointsperteam', res.pointsperteam);
        const selectedCategory = res.category.map(item=>({ value: item, label: item }));
        setSelectedCategories(selectedCategory);
        setValue('category',res.category);
        setInitialFile(res.filename);
        setLoading(false);
      }
    }});

  useEffect(() => {
    if (editMode) {
      findAuction({
        variables: {
           id}});
    }
  }, [editMode]);

  useEffect(() => {
    if (editMode) {
      setHeader('Edit Auction');
    }else {
      const head = componentRef.current?.id;
      setHeader(head);
    }
  }, [componentRef, setHeader]);

  const [fileName, setFileName] = useState('');
  const [initialFile, setInitialFile] = useState('');

  const handleImageChange = event => {
    const file = event.target.files[0];
    setFileName(file);
    setValue('photo', file);
    trigger('photo');
  };

  const [createauction] = useMutation(CREATE_AUCTION, {
    onCompleted: createAuctiondata => {
      const res = createAuctiondata.createAuction;
      if (res) {
        isSuccess('Auction Created Successfully');
        setTimeout(() => {
          reset();
          setFileName('');
          setSelectedCategories([]);
        }, timeOutSeconds);
      }
    },
    onError: createAuctionError => {
      isError(createAuctionError.message);
    }});

  const [updateAuction] = useMutation(UPDATE_AUCTION, {
    onCompleted: updateAuctionData => {
      const res = updateAuctionData.updateAuction;
      if (res) {
        isSuccess('Auction Updated Successfully!');
          navigate(-1);
      }
    },
    onError: updateAuctionError => {
      isError(updateAuctionError.message);
    }});
  const [getSignerUrlForUpload] = useLazyQuery(GET_PRESIGNED_URL, {
    onCompleted: async data => {
      const res = data.getSignerUrlForUpload;
      if (res) {
        try {
          const url = res.split('?')[0];
          const finalUrl = url.split(process.env.REACT_APP_AWS_ENDPOINT_URL)[1];
          const response = await axios.put(res, fileName, {
            headers: {
              'Content-Type': 'application/octet-stream'}});
          if (response.status === 200) {
            if (editMode) {
              await updateAuction({
                variables: {
                  'auctionid': id,
                  'updateAuctionInput': {
                    'auctiondate': inputData.auctiondate,
                    'auctionname': inputData.auctionname,
                    'auctiontype': 'cricket',
                    'bidincrease': parseInt(inputData.bidincreaseby, 10),
                    'filename': finalUrl,
                    'minbid': parseInt(inputData.minimumbid, 10),
                    'playerperteam': parseInt(inputData.playerperteam, 10),
                    'pointsperteam': parseInt(inputData.pointsperteam, 10),
                    'category': inputData.category}}});
            } else {
              // console.log(inputData.category);
              await createauction({
                variables: {
                  'createAuctionInput': {
                    'auctiondate': inputData.auctiondate,
                    'auctionname': inputData.auctionname,
                    'auctiontype': inputData.list,
                    'bidincrease': parseInt(inputData.bidincreaseby, 10),
                    'filename': finalUrl,
                    'minbid': parseInt(inputData.minimumbid, 10),
                    'playerperteam': parseInt(inputData.playerperteam, 10),
                    'pointsperteam': parseInt(inputData.pointsperteam, 10),
                    'category': inputData.category,
                    'user_id': userId}}});
            }
          } else {
           isError('Error uploading file.');
          }
        } catch (error) {
          isError(error.message);
        }
      }
    },
    onError: error => {
      isError(error.message);
    }});

  const submitForm = async data => {
    setInputData({ ...data });
    console.log(data);
    if (fileName) {
      const uuid = uuidv4();
      const uniquefilename = `images/${moment().unix()}-${uuid}`;
      await getSignerUrlForUpload({
        variables: {
          'filename': uniquefilename}});
    }else {
      updateAuction({
        variables: {
          'auctionid': id,
          'updateAuctionInput': {
            'auctiondate': data.auctiondate,
            'auctionname': data.auctionname,
            'auctiontype': 'cricket',
            'bidincrease': parseInt(data.bidincreaseby, 10),
            'filename': initialFile,
            'minbid': parseInt(data.minimumbid, 10),
            'playerperteam': parseInt(data.playerperteam, 10),
            'pointsperteam': parseInt(data.pointsperteam, 10),
            'category': data.category}}});
    }
  };

  const handleChange = newValue => {
    console.log('Selected options:', newValue);
    setValue('category',newValue.map(item=>item.value));
    setSelectedCategories(newValue.value)
    trigger('category');
  };

  const handleCreateOption = inputValue => {
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
    <>
      <div id='Create Auction' ref={componentRef}></div>
      <div className='createAuction-container'>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className='createAuction-form'>
            <div className='createAuction-input1'>
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
                    e.target.src = tprofile;
                  }}
                />
              </label>
              <span className={errors.photo ? 'photo-box-visible' : 'photo-box'}>*{errors.photo ? errors.photo.message : ''}</span>
              {fileName && <p>Selected File: {fileName.name}</p>}
              <label>Type</label>
              <select name='list' className='org-select' {...register('list')}>
                <option value='cricket'>Cricket</option>
              </select>
              <label>Auction Name</label>
              <input
                name='auctionname'
                type='text'
                data-testid='auctionname'
                {...register('auctionname')}
              />
              <span className={errors.auctionname ? 'auctionname-box-visible' : 'auctionname-box'}>*{errors.auctionname ? errors.auctionname.message : ''}</span>
              <label>Auction Date</label>
              <input
                name='auctiondate'
                type='date'
                data-testid='auctiondate'
                {...register('auctiondate')}
              />
              <span className={errors.auctiondate ? 'auctiondate-box-visible' : 'auctiondate-box'}>*{errors.auctiondate ? errors.auctiondate.message : ''}</span>
              <label>Points Per Team</label>
              <input
                name='pointsperteam'
                type='number'
                data-testid='pointsperteam'
                {...register('pointsperteam')}
              />
              <span className={errors.pointsperteam ? 'pointsperteam-box-visible' : 'pointsperteam-box'}>*{errors.pointsperteam ? errors.pointsperteam.message : ''}</span>
            </div>
            <div className='createAuction-input2'>
              <label>Minimum Bid</label>
              <input
                name='minimumbid'
                type='number'
                data-testid='minimumbid'
                {...register('minimumbid')}
              />
              <span className={errors.minimumbid ? 'minimumbid-box-visible' : 'minimumbid-box'}>*{errors.minimumbid ? errors.minimumbid.message : ''}</span>
              <label>Bid Increase By</label>
              <input
                name='bidincreaseby'
                type='number'
                data-testid='bidincreaseby'
                {...register('bidincreaseby')}
              />
              <span className={errors.bidincreaseby ? 'bidincreaseby-box-visible' : 'bidincreaseby-box'}>*{errors.bidincreaseby ? errors.bidincreaseby.message : ''}</span>
              <label>Player Per Team</label>
              <input
                name='playerperteam'
                type='number'
                data-testid='playerperteam'
                {...register('playerperteam')}
              />
              <span className={errors.playerperteam ? 'playerperteam-box-visible' : 'playerperteam-box'}>*{errors.playerperteam ? errors.playerperteam.message : ''}</span>
              <div className='createAuction-addbutton'>
              <label>Category</label>
                <CreatableSelect name='category'  value={selectedCategories} onChange={handleChange} onCreateOption={handleCreateOption} data-testid='category' options={options} isMulti placeholder='Add Category...'/>
                <span className={errors.category ? 'category-box-visible' : 'category-box'}>*{errors.category ? errors.category.message : ''}</span>
                <button type='submit'>{editMode ? 'UPDATE AUCTION' : 'ADD AUCTION'}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AuctionHandler;
