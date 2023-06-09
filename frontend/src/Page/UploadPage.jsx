import React, {useState} from 'react'; 
import Dropzone from "react-dropzone";
import { useNavigate } from 'react-router-dom';
import BackHeader from '../component/BackHeader';
import Modal from 'react-modal'
import {createVideo} from '../api';
import {initializeIndexClient, initializeVideoClient } from '../client';
import {v4 as uuid} from 'uuid';



// video upload
const UploadPage = ()=>{

  let d = new Date();
  const videoUploadTime = d.toLocaleDateString();
  // (d.getFullYear + "年" + d.getMonth + "月" + d.getDate 
  // + "日" + d.getHours + "時" + d.getMinutes + "分").toString;

  const videoId = "1";
  const [title, setTitle]= React.useState("");
  const [description,setDescription] = useState("");
  const [videoImg, setVideoImg]= useState(null);
  const [videoUrl,setVideoUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLocal = true;
  const indexClient = initializeIndexClient(isLocal);
  const videoClient = initializeVideoClient(isLocal, indexClient);
  const videoOwnerId = "1";
  const [chunkNumber, setChunkNumber] = useState(null);
  const [chunkData, setChunkData] = useState([]);

  const encodeArrayBuffer = (file) => Array.from(new Uint8Array(file));
  const MAX_CHUNK_SIZE = 2 * 1024 * 1024; 
  // 2MB


  Modal.setAppElement("#app");

  function openModal(){
    if(title == "" || description == "" || videoId == "" || videoUrl == "" || videoOwnerId == "") {
      alert('すべての項目を入れてください。')
    }else{
      setOpen(true);
    }
  }

  function closedModal(){
    setOpen(false);
  }
  function afterOpenModal(){
    
  }


  const uploadStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    margin: '30px',
    width: '100%',
  };

  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };  


  // Process to split chunks and send to canister
  async function chunkFile(fl = File) {
    const file = await fl.arrayBuffer();
    const fileSize = fl.size;

    console.log(file,fileSize)
    let chunk = 1;
    const chunks  = [];
    for(
      let byteStart = 0;
      byteStart < fileSize;
      byteStart += MAX_CHUNK_SIZE, chunk++
    ){
      const videoSlice = file.slice(
        byteStart,
        Math.min(fileSize, byteStart + MAX_CHUNK_SIZE)
      );
      const sliceToNat = encodeArrayBuffer(videoSlice);
      chunks.push(sliceToNat);
    }
    await Promise.all(chunks);
    return  setChunkNumber(chunk), setChunkData(chunks);
  }
  



  async function uploadVideo(){
    console.log(chunkData, chunkNumber);
    await indexClient.indexCanisterActor.createVideoCanisterByGroup();
    await createVideo(videoClient, videoId, title, description, videoImg, chunkNumber, chunkData, videoUploadTime, videoOwnerId);
    navigate('/login_home');
  }

  
  
  
  return(
    
    <div className="Upload">
      <header>
        <BackHeader/>
      </header>
      <div className='upload_form'>
      <div className='form'>
      <div className="title">
      <p>title</p>
      <input type="text" style={{width:'150px', height:'200'}}  value={title}  onChange={(event)=> setTitle(event.target.value)} placeholder="タイトル" size="30"/>
      </div>

      <div className="description">
        <p>description</p>
        <textarea style={{width: '250px', height: '250px'}} value={description} placeholder="概要を書いてください(50文字まで)" rows={50} onChange={(event)=> setDescription(event.target.value)}></textarea>
      </div>

      <div className="videoImg">
      <Dropzone onDrop={(acceptedFiles) => {
        acceptedFiles.forEach((file) => {
          if((file.size / 1024/ 1024) <= 2 && (file.type == 'image/png' || file.type == 'image/jpeg')){
            const reader = new FileReader();
            reader.onload = () => {
              var ar = reader.result;
              setVideoImg(ar);
            };
            reader.readAsDataURL(acceptedFiles[0]);
            console.log(acceptedFiles.length)
          } else {
            setVideoImg('');
            window.alert('適切なファイルではありません。')
          }
        })
      }}>
        {({getRootProps, getInputProps}) => (
          <section>
            <div {...getRootProps()} style={uploadStyle}>
              <input {...getInputProps()} />
              <p>サムネイル画像を選択してください。2MB以下。（.png/jpeg/jpg）</p>
            </div>
          </section>
        )}
      </Dropzone>
      {videoImg?<p>選択されたファイル：{videoImg.name}</p>:null}
      <img src={videoImg} style={{size: '50'}} />
      </div>

      <div className="video">
      <Dropzone onDrop={acceptedFiles => {
        acceptedFiles.forEach((file) => {
          // video/mp4, video/mov
          if(file.size <= 300000000 && (file.type == 'video/mp4' || file.type == 'video/mov')){
            chunkFile(acceptedFiles[0]);
            // const reader = new FileReader();
            // reader.onload = () => {
            //   // if(e.loaded && e.total) {
            //   //   const percent = (e.loaded/e.total) * 100;
            //   //   console.log('Progress:' , Math.round(percent));
            //   // }
            //   var ar = reader.result;
            //   setVideoUrl(ar);
            // };
            // reader.readAsArrayBuffer(acceptedFiles[0]);
          } else {
            console.log(file.type)
            setVideoUrl('');
            window.alert('適切なファイルではありません。')
          }
        })
      }}>
        {({getRootProps, getInputProps}) => (
          <section style={uploadStyle}>
            <div {...getRootProps()} style={{uploadStyle}}>
              <input {...getInputProps()} />
              <p>アップロードしたい300MB以下の動画を選択して下さい。（./mp4/mov）</p>
            </div>
          </section>
        )}
      </Dropzone>
      {videoUrl?<p>選択されたファイル：{videoUrl.name}</p>:null}
      </div>

      <button  className="upload_button" type='submit' onClick={openModal}>upload</button>
      <Modal
        isOpen={open}
        onAfterOpen={afterOpenModal}
        onRequestClose={closedModal}
        style={customStyles}
        
        >
         <h2>一度アップロードした動画を削除することはできません。<br/>
            本当に動画をアップロードしますか？</h2> 
            <button onClick={closedModal}>No</button>
            <button onClick={uploadVideo}>Yes</button>
        </Modal>
      </div>

      </div>
      
    </div>
  );
}

export default UploadPage;