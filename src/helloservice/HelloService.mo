import CA "mo:candb/CanisterActions";
import CanDB "mo:candb/CanDB";
import Entity "mo:candb/Entity";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Int "mo:base/Int";

shared ({ caller = owner }) actor class HelloService({
  // the primary key of this canister
  partitionKey: Text;
  // the scaling options that determine when to auto-scale out this canister storage partition
  scalingOptions: CanDB.ScalingOptions;
  // (optional) allows the developer to specify additional owners (i.e. for allowing admin or backfill access to specific endpoints)
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

  /// @required public API (Do not delete or change)
  public shared({ caller = caller }) func transferCycles(): async () {
    if (caller == owner) {
      return await CA.transferCycles(caller);
    };
  };

  // returns a greeting to the user if exists 
  public query func greetUser(userId: Text): async ?Text {
    let user = switch(CanDB.get(db, { sk = userId })) {
      case null { null };
      case (?userEntity) { unwrapUser(userEntity) };
    };

    switch(user) {
      case null { null };
      case (?u) {
        ?(u.userId #"#" #u.name #"#" #u.introduce #"#"#u.imgUrl);
      }
    }
  };

  // Create a new user. In this basic case, we're using the user's name as the sort key
  // This works for our hello world app, but as names are easily duplicated, one might want
  // to attach an unique identifier to the sk to separate users with the same name
  public func putUser(userId: Text, name: Text, introduce: Text, imgUrl: Text): async () {
    if (userId == "" or name == "" or introduce == "" or imgUrl == "") { return };

    // inserts the entity into CanDB
    await* CanDB.put(db, {
      sk = userId;
      attributes = [
        ("userId", #text(userId)),
        ("name", #text(name)),
        ("introduce", #text(introduce)),
        ("imgUrl", #text(imgUrl))
      ]
    })
  };

  type User = {
    userId: Text;
    name: Text;
    introduce: Text;
    imgUrl: Text;
  };

  // attempts to cast an Entity (retrieved from CanDB) into a User type
  func unwrapUser(entity: Entity.Entity): ?User {
    let { sk; attributes } = entity;
    let userIdValue = Entity.getAttributeMapValueForKey(attributes, "userId");
    let nameValue = Entity.getAttributeMapValueForKey(attributes, "name");
    let introduceValue = Entity.getAttributeMapValueForKey(attributes, "introduce");
    let imgUrlValue = Entity.getAttributeMapValueForKey(attributes, "imgUrl");

    switch(userIdValue, nameValue, introduceValue, imgUrlValue) {
      case (
        ?(#text(userId)),
        ?(#text(name)),
        ?(#text(introduce)),
        ?(#text(imgUrl))
      ) { ?{ userId; name; introduce; imgUrl } };
      case _ { 
        null 
      }
    };
  };
}