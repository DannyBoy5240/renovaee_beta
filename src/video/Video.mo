import CA "mo:candb/CanisterActions";
import CanDB "mo:candb/CanDB";
import Entity "mo:candb/Entity";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Char "mo:base/Char";
import Bool "mo:base/Bool";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Blob "mo:base/Blob";
import Array "mo:base/Array";

shared ({ caller = owner }) actor class Video({
  
  partitionKey: Text;
  
  scalingOptions: CanDB.ScalingOptions;
  
  owners: ?[Principal];

}) {
  /// @required (may wrap, but must be present in some form in the canister)
  stable let db = CanDB.init({
    pk = partitionKey;
    scalingOptions = scalingOptions;
    btreeOrder = null;
  });

  /// @recommended (not required) public API
  public query func getPK(): async Text { db.pk };

  /// @required public API (Do not delete or change)
  public query func skExists(sk: Text): async Bool { 
    CanDB.skExists(db, sk);
  };

  
  public shared({ caller = caller }) func transferCycles(): async () {
    if (caller == owner) {
      return await CA.transferCycles(caller);
    };
  };

  // チャンクを受け取って、それをテキストに変換する
  // public func putVideo(
  //   videoId: Text,
  //   chunkNumber: Text,
  //   chunkData: [Nat8]
  // ): async (){
  //   if(chunkNumber != ""  ){
  //     let chunkCoupleData = Array.chain<Nat8, Text>(chunkData, func x = ["x"]);
  //   }else{
  //     return
  //   };
  // };


  // returns a greeting to the user if exists 
  public query func getVideo(videoId : Text): async ?Text{
    // let {entities; nextKey} = CanDB.scan(db,{
    //   skLowerBound = "videoId#";
    //   skUpperBound = "videoId#~";  // note the `~` at the end, as `~` is the highest ascii character.
    //   limit = 10; // get 10 projects at a time
    //   ascending = ?true; // scans in order of increasing lexicographically sorted project id.
    // });
    
    let video = switch(CanDB.get(db, {sk = videoId })) {
      case null { null };
      case (?videoentities) { unwrapVideo(videoentities) };
    };

    switch(video) {
      case null { null };
      case (?u) {
        ?(u.videoId #"#" 
        #u.title#"#" 
        #u.description #"#"
        #u.videoImg #"#"
        #u.chunkNumber #"#"
        // #u.videoUrl #"#"
        #u.uploadTime #"#"
        );
      }
    }
  };

  
  public func createVideo(
    videoId: Text, 
    title: Text, 
    description: Text, 
    videoImg: Text,
    chunkNumber: Text,
    chunkData: [Text],
    videoUploadTime: Text,
    videoOwnerId: Text
    
    ): async () {
    if (videoId == "" or title == "" or  chunkNumber=="" or videoUploadTime == "" or videoOwnerId == "") { return };
    
    let chunkCoupleData = Array.chain<Text, Text>(chunkData, func x = [x]);
    // inserts the entity into CanDB
    await* CanDB.put(db, {
      sk = videoId;
      attributes = [
        ("videoId", #text(videoId)),
        ("title", #text(title)),
        ("description", #text(description)),
        ("videoImg", #text(videoImg)),
        ("chunkNumber", #text(chunkNumber)),
        ("chunkData", #arrayText(chunkCoupleData)),
        ("videoUploadTime", #text(videoUploadTime)),
        ("videoOwnerId", #text(videoOwnerId))
      ]
    })
  };

  type Video = {
    videoId: Text;
    title: Text;
    description: Text;
    videoImg: Text;
    chunkNumber: Text;
    chunkData: [Text];
    uploadTime: Text;
    videoOwnerId: Text;
    // watchVideoList: Text;
  };

  

  // attempts to cast an Entity (retrieved from CanDB) into a User type
  func unwrapVideo(entity: Entity.Entity): ?Video {
    let { sk; attributes } = entity;
    let videoIdValue = Entity.getAttributeMapValueForKey(attributes, "videoId");
    let titleValue = Entity.getAttributeMapValueForKey(attributes, "title");
    let descriptionValue = Entity.getAttributeMapValueForKey(attributes, "description");
    let videoImgValue = Entity.getAttributeMapValueForKey(attributes, "videoImg");
    let chunkNumberValue = Entity.getAttributeMapValueForKey(attributes, "chunkNumber");
    let chunkDataValue = Entity.getAttributeMapValueForKey(attributes, "chunkData");
    let uploadTime = Entity.getAttributeMapValueForKey(attributes, "uploadTime");
    let videoOwnerId = Entity.getAttributeMapValueForKey(attributes, "videoOwnerId");
    // let watchVideoList = Entity.getAttributeMapValueForKey(attributes, "watchVideoList");
    

    switch(
        videoIdValue, 
        titleValue, 
        descriptionValue, 
        videoImgValue, 
        chunkNumberValue,
        chunkDataValue,
        uploadTime,
        videoOwnerId
        // watchVideoList,
        ) {
      case (
        ?(#text(videoId)),
        ?(#text(title)),
        ?(#text(description)),
        ?(#text(videoImg)),
        ?(#text(chunkNumber)),
        ?(#arrayText(chunkData)),
        ?(#text(uploadTime)),
        ?(#text(videoOwnerId))
        // ?(#text(watchVideoList)),
      ) { ?{ videoId; title; description; videoImg; chunkNumber; chunkData; uploadTime; videoOwnerId} };
      case _ { 
        null 
      }
    };
  };
}