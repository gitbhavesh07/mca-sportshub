import React, { useState, useEffect } from 'react';
import './TeamHandler.css';
import UPLOAD from '../../../../Images/UPLOAD.png';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/client';
import ReactLoading from 'react-loading';
import { CREATE_TEAM, UPDATE_TEAM } from '../../../../Graphql/Mutation/Mutations';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, mixed } from 'yup';
import { GET_PRESIGNED_URL, FIND_TEAM } from '../../../../Graphql/Query/Querys';
import axios from 'axios';
import { useUserContext } from '../../../../App';
import moment from 'moment/moment';
import ToastMessage from '../../../../toast';
import { v4 as uuidv4 } from 'uuid';

const TeamHandler = ({ editMode }) => {

  const { isSuccess, isError } = ToastMessage();
  const { setHeader, componentRef } = useUserContext();
  const [fileName, setFileName] = useState('');
  const [initialFile, setInitialFile] = useState('');
  const [inputData, setInputData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id, team_id } = useParams();
  const navigate = useNavigate();
  const TotalMB = 5;
  const oneMB = 1024;
  const timeOutSeconds = 3000;

  const schema = object().shape({
    teamname: string().required('TeamName is required'),
    teamshortname: string().required('TeamShortName is required'),
    shortcutkey: string().test('shortcutkey', 'Field is Required', function (value) {
      return value !== 'Select';
    }),
    photo: mixed().test('imageRequired', 'Image is required', function (value) {
      return !(!(editMode) && !(value instanceof File));
    }).test('filesize', 'Image must be below 5MB', function (value) {
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
    })});

  const { register, handleSubmit, setValue, trigger, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'});

  useEffect(() => {
    if (editMode) {
      setHeader('Edit Team');
    } else {
      const head = componentRef.current?.id;
      setHeader(head);
    }
  }, [componentRef, setHeader, editMode]);

  const [updateTeam] = useMutation(UPDATE_TEAM, {
    onCompleted: updateTeamData => {
      const res = updateTeamData.updateTeam;
      if (res) {
        isSuccess('Team Updated successfully!');
        navigate(-1);
      }
    },
    onError: updateTeamError => {
      isError(updateTeamError.message);
    }});


  const [findTeam] = useLazyQuery(FIND_TEAM, {
    onCompleted: findTeamData => {
      const res = findTeamData.findTeam;
      if (res) {
        setValue('teamname', res.teamname);
        setValue('teamshortname', res.teamshortname);
        setValue('shortcutkey', res.teamshortcutkey);
        setInitialFile(res.teamfilename);
        setLoading(false)
      }
    },
    onError: () => {
      isError('No Team Found ');
    }});

  useEffect(() => {
    if (editMode) {
      findTeam({
        variables: {
          'id': team_id}});
    }
  }, [team_id, editMode]);


  const handleImageChange = event => {
    const file = event.target.files[0];
    setFileName(file);
    setValue('photo', file);
    trigger('photo');
  };

  const [createteam] = useMutation(CREATE_TEAM, {
    onCompleted: createTeamData => {
      const res = createTeamData.createTeam;
      if (res) {
        isSuccess('Team Created Sucessfully');
        setTimeout(() => {
          setFileName('');
          reset();
        }, timeOutSeconds);
      }
    },
    onError: createTeamError => {
      isError(createTeamError.message);
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
              await updateTeam({
                variables: {
                  'teamid': team_id,
                  'updateTeamInput': {
                    'teamname': inputData.teamname,
                    'teamshortname': inputData.teamshortname,
                    'teamfilename': finalUrl,
                    'teamshortcutkey': inputData.shortcutkey}}});
            } else {
              await createteam({
                variables: {
                  'createTeamInput': {
                    'teamname': inputData.teamname,
                    'teamfilename': finalUrl,
                    'teamshortcutkey': inputData.shortcutkey,
                    'teamshortname': inputData.teamshortname,
                    'auction_id': id}}});
            }
          } else {
            isError('Error uploading photo.');
          }
        } catch(error) {
          isError('Error uploading photo');
        }
      }
    },
    onError: error => {
     isError(error.message);
    }});

  const submitForm = async data => {
    setInputData({ ...data });
    if (fileName) {
      const uuid = uuidv4();
      const uniquefilename = `images/${moment().unix()}-${uuid}`;
      await getSignerUrlForUpload({
        variables: {
          'filename': uniquefilename}});
      console.log("Momemt",moment());
      console.log("MomemtUnix",moment().unix());
    }else {
      await updateTeam({
        variables: {
          'teamid': team_id,
          'updateTeamInput': {
            'teamname': data.teamname,
            'teamshortname': data.teamshortname,
            'teamfilename': initialFile,
            'teamshortcutkey': data.shortcutkey}}});
    }
  };

  if (loading && editMode) {
    return <div className='loading'>
    <ReactLoading type="bars" color="rgb(255, 196, 0)"
      height={100} width={50} />
   </div>;
  }

  return (
    <div className='AddTeam-container' id='Add Team' ref={componentRef}>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className='AddTeam-form'>
          <div className='AddTeam-input1'>
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
              />
            </label>
            <span className={errors.photo ? 'photo-box-visible' : 'photo-box'}>*{errors.photo ? errors.photo.message : ''}</span>
            {fileName && <p>Selected File: {fileName.name}</p>}
          </div>
          <div className='AddTeam-input2'>
            <label>Team Name</label>
            <input
              name='teamname'
              type='text'
              data-testid='teamname'
              {...register('teamname')}
            />
            <span className={errors.teamname ? 'teamname-box-visible' : 'teamname-box'}>*{errors.teamname ? errors.teamname.message : ''}</span>
            <label>Team Short Name</label>
            <input
              name='teamshortname'
              type='text'
              data-testid='teamshortname'
              {...register('teamshortname')}
            />
            <span className={errors.teamshortname ? 'teamshortname-box-visible' : 'teamshortname-box'}>*{errors.teamshortname ? errors.teamshortname.message : ''}</span>
            <label>Select a Shortcut Key</label>
            <select name='shortcutkey' data-testid='shortcutkey' data {...register('shortcutkey', { defaultValue: 'Select' })}>
              <option defaultValue='Select'>Select</option>
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='D'>D</option>
              <option value='E'>E</option>
              <option value='F'>F</option>
              <option value='G'>G</option>
              <option value='H'>H</option>
              <option value='I'>I</option>
              <option value='J'>J</option>
              <option value='K'>K</option>
              <option value='L'>L</option>
              <option value='M'>M</option>
              <option value='N'>N</option>
              <option value='O'>O</option>
              <option value='P'>P</option>
              <option value='Q'>Q</option>
              <option value='R'>R</option>
              <option value='S'>S</option>
              <option value='T'>T</option>
              <option value='U'>U</option>
              <option value='V'>V</option>
              <option value='W'>W</option>
              <option value='X'>X</option>
              <option value='Y'>Y</option>
              <option value='Z'>Z</option>
            </select>
            <span className={errors.shortcutkey ? 'shortcutkey-box-visible' : 'shortcutkey-box'}>*{errors.shortcutkey ? errors.shortcutkey.message : ''}</span>
            <div className='AddTeam-addbutton'>
              <button type='submit'>{editMode ? 'UPDATE TEAM' : 'ADD TEAM'}</button>
            </div>
          </div>
        </div>
      </form>

    </div>
  );
};

export default TeamHandler;
