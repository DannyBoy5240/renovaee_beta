import { ActorClient } from "candb-client-typescript/dist/ActorClient";
import { HelloService } from "../declarations/helloservice/helloservice.did";
import { IndexCanister } from "../declarations/index/index.did";
import {Video} from "../declarations/video/video.did"

export async function greetUser(helloServiceClient: ActorClient<IndexCanister, HelloService>, userId: string) {
  let pk = `userId#${userId}`;
  let userGreetingQueryResults = await helloServiceClient.query<HelloService["greetUser"]>(
    pk,
    (actor) => actor.greetUser(userId)
  );

  for (let settledResult of userGreetingQueryResults) {
    // handle settled result if fulfilled
    if (settledResult.status === "fulfilled" && settledResult.value.length > 0) {
      // handle candid returned optional type (string[] or string)
      return Array.isArray(settledResult.value) ? settledResult.value[0] : settledResult.value
    } 
  }
  
  return "User does not exist";
};

export async function putUser(helloServiceClient: ActorClient<IndexCanister, HelloService>, userId: string, name: string, introduce: string, imgUrl: string) {
  let pk = `userId#${userId}`;
  let sk = userId;
  await helloServiceClient.update<HelloService["putUser"]>(
    pk,
    sk,
    (actor) => actor.putUser(sk, name, introduce, imgUrl)
  );
}

export async function createVideo(videoClient: ActorClient<IndexCanister, Video>, 
  videoId: string, title: string, description: string, videoImg: string, chunkNumber: string, chunkData:[string] ,  videoUploadTime: string, videoOwnerId: string){
    let pk = `video`;
    let sk = videoId;
    await videoClient.update<Video["createVideo"]>(
      pk,
      sk,
    (actor) => actor.createVideo(sk, title, description, videoImg, chunkNumber, chunkData, videoUploadTime, videoOwnerId)
    );
  }

  export async function getVideo(videoClient: ActorClient<IndexCanister, Video>, videoId: string) {
    let pk = `video`;
    let videoGetQueryResults = await videoClient.query<Video["getVideo"]>(
      pk,
      (actor) => actor.getVideo(videoId)
    );
  
    for (let settledResult of videoGetQueryResults) {
      // handle settled result if fulfilled
      if (settledResult.status === "fulfilled" && settledResult.value.length > 0) {
        // handle candid returned optional type (string[] or string)
        return Array.isArray(settledResult.value) ? settledResult.value[0] : settledResult.value
      } 
    }
    
    return "動画が存在しません。";
  };