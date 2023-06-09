import React,{useState, useContext, useEffect, createContext} from 'react'
import BackHeader from '../component/BackHeader';
import {useNavigate} from 'react-router-dom';
import Dropzone from "react-dropzone";
// import {idFactory as User} from '../../declarations/user/index'
import { greetUser, putUser } from '../api';
import {initializeIndexClient, initializeHelloServiceClient } from '../client';
import {UserId} from '../component/Header'

export const ProfileImg = createContext(null);

const MyProfilePage =() => {
  const [name, setName] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [imgFile ,setImgFile] = useState(null);
  const isLocal = true;
  const indexClient = initializeIndexClient(isLocal);
  const helloServiceClient = initializeHelloServiceClient(isLocal, indexClient);

  const [greetName,setGreetName] = useState("");
  const [greetIntroduce,setGreetIntroduce] = useState("");
  const [greetFileImg,setGreetFileImg] = useState("");


  const userId = "1";

  const navigate = useNavigate();

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
    };

    const nameHandleChange = (e) => {
      setName(e.target.value);
    }
    // const displayNameHandleChange = (e) => {
    //   setDisplayName(e.target.value);
    // }
    const descriptionHandleChange = (e) => {
      setIntroduce(e.target.value);
    }


    useEffect(() => {
      async function getUserGreeting() {
        if (userId === "") {
          let errorText = "must enter a name to try to greet";
          console.error(errorText);
          alert(errorText);
        } else {
          let greeting = await greetUser(helloServiceClient, userId)
          const result = greeting.split('#');
          setGreetName(result[1]);
          setGreetIntroduce(result[2]);
          setGreetFileImg(result[3]);
        }
      }
      getUserGreeting();
    }, [userId]);



    async function uploadProfile(event){
      event.preventDefault();


      if(userId === "" || name === "" || introduce === ""){
        let error = "すべての項目を入れてください。";
        console.log(error);
        alert(error);
        // setCreateErrorText(error);
        return;
      }else{
        await indexClient.indexCanisterActor.createHelloServiceCanisterByGroup(userId);
        await putUser(helloServiceClient, userId, name, introduce, imgFile);
        console.log('成功');
        navigate('/login_home');
      } 
    }

    


    return (
      
      <div>
        <ProfileImg.Provider value={greetFileImg}>
        <header>
          <BackHeader/>
        </header>
        <div className="profileBody">
            <form>
            <div className="name" >
              <p>ユーザネーム:{name}</p>
              <input type="text" style={{width:'150px', height:'200'}} value={name} onChange={nameHandleChange}/>
            
            </div>

            <div className="description">
            <p>自己紹介:<br/>
              {introduce}</p>
              <textarea style={{width: '300px', height: '250px'}} value={introduce} onChange={descriptionHandleChange}></textarea>
            </div>
    
            <div className="imgFile">
            <Dropzone onDrop={(acceptedFiles) => {
              acceptedFiles.forEach((file) => {
                if((file.size / 1024/ 1024) <= 2 && (file.type == 'image/png' || file.type == 'image/jpeg')){
                  const reader = new FileReader();
                  reader.onload = () => {
                    var ar = reader.result;
                    setImgFile(ar);
                  };
                  reader.readAsDataURL(acceptedFiles[0]);
                  console.log(acceptedFiles.length)
                } else {
                  setImgFile('');
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
            <button className="uploadButton"  type="submit" onClick={uploadProfile}>update</button>
            </div>
            </form>
            <div className='my-menu'>
              <img src={greetFileImg} style={{ width: "100px", height: "100px", borderRadius: "80%" }}></img>
              <p>{greetName}</p>
              <p>{greetIntroduce}</p>
            </div>
        </div>
        </ProfileImg.Provider>
        
      </div>
    )
}

export default MyProfilePage;
