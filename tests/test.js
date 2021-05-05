const firebase = require("@firebase/testing");

const MY_PROJECT_ID = "amu-roboclub";
const myId = "user_abc";
const myEmail = "abc@gmail.com";
const theirId = "user_xyz";
const theirEmail = "xyz@gmail.com";
const myAuth = { uid: myId, email: myEmail };
const theirAuth = { uid: theirId, email: theirEmail };
const thirdAuth = { uid: "user_axb", email: "axb@gmail.com" };

function getFirestore(auth) {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth })
    .firestore();
}
function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}
async function setupAdmin() {
  const admin = getAdminFirestore();
  const setupUser = admin.collection("/users").doc(myId);
  await setupUser.set({ isAdmin: true, name: "abc", email: myEmail });
}

beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

// Nemonics
// NT = Negative Test, PT = Positive Test
// {-} = Excluded , {+} = Included

describe("AMURoboclub app DB Unit Testing", () => {
  // User Collection Tests
  it("PT -> Read Users:  {-} Auth", async () => {
    const userId = myId;
    const db = getFirestore(null);
    const testRead = db.collection("/users").doc(userId);
    await firebase.assertSucceeds(testRead.get());
  });
  it("PT -> Create User: {+} All Required Fields, {+} Auth, {+} Create Own User, {+} Valid Field Type", async () => {
    const userId = myId;
    const db = getFirestore(myAuth);

    const testRead = db.collection("/users").doc(userId);
    await firebase.assertSucceeds(
      testRead.set({
        uid: myId,
        about: "about",
        batch: "batch",
        branch: "branch",
        contact: "contact",
        cvLink: "cvLink",
        email: myEmail,
        fbId: "fbId",
        instaId: "instaId",
        interests: "interests",
        isAdmin: false,
        isMember: true,
        linkedinId: "linkedinId",
        name: "name",
        position: "position",
        profileImageUrl: "profileImageUrl",
        quote: "quote",
      })
    );
  });
  it("NT -> Create User: {-} All Required Fields, {+} Auth, {+} Create Own User, {+} Valid Field Type", async () => {
    const userId = myId;
    const db = getFirestore(myAuth);

    const testRead = db.collection("/users").doc(userId);
    await firebase.assertFails(
      testRead.set({
        uid: myId,
        about: "about",
        batch: "batch",
        branch: "branch",
        contact: "contact",
        cvLink: "cvLink",
        email: myEmail,
        instaId: "instaId",
        interests: "interests",
        isAdmin: false,
        isMember: true,
        linkedinId: "linkedinId",
        name: "name",
        position: "position",
        profileImageUrl: "profileImageUrl",
        quote: "quote",
      })
    );
  });
  it("NT -> Create User: {+} All Required Fields, {-} Auth, {+} Create Own User, {+} Valid Field Type", async () => {
    const userId = myId;
    const db = getFirestore(null);

    const testRead = db.collection("/users").doc(userId);
    await firebase.assertFails(
      testRead.set({
        uid: myId,
        about: "about",
        batch: "batch",
        branch: "branch",
        contact: "contact",
        cvLink: "cvLink",
        email: myEmail,
        fbId: "fbId",
        instaId: "instaId",
        interests: "interests",
        isAdmin: false,
        isMember: true,
        linkedinId: "linkedinId",
        name: "name",
        position: "position",
        profileImageUrl: "profileImageUrl",
        quote: "quote",
      })
    );
  });
  it("NT -> Create User: {+} All Required Fields, {+} Auth, {-} Create Own User, {+} Valid Field Type", async () => {
    const db = getFirestore(myAuth);

    const testRead = db.collection("/users").doc(theirId);
    await firebase.assertFails(
      testRead.set({
        uid: myId,
        about: "about",
        batch: "batch",
        branch: "branch",
        contact: "contact",
        cvLink: "cvLink",
        email: myEmail,
        fbId: "fbId",
        instaId: "instaId",
        interests: "interests",
        isAdmin: false,
        isMember: true,
        linkedinId: "linkedinId",
        name: "name",
        position: "position",
        profileImageUrl: "profileImageUrl",
        quote: "quote",
      })
    );
  });
  it("NT -> Create User: {+} All Required Fields, {+} Auth, {+} Create Own User, {-} Valid Field Type", async () => {
    const userId = myId;
    const db = getFirestore(myAuth);

    const testRead = db.collection("/users").doc(userId);
    await firebase.assertFails(
      testRead.set({
        uid: myId,
        about: "about",
        batch: "batch",
        branch: "branch",
        contact: "contact",
        cvLink: "cvLink",
        email: myEmail,
        fbId: "fbId",
        instaId: "instaId",
        interests: "interests",
        isAdmin: "false",
        isMember: true,
        linkedinId: "linkedinId",
        name: "name",
        position: "position",
        profileImageUrl: "profileImageUrl",
        quote: "quote",
      })
    );
  });
  it("PT -> Update User: {+} Only Allowed Fields, {+} Admin access, {-} Same User, {+} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/users").doc(theirId);
    await admin.collection("/users").doc(theirId).set({
      uid: theirId,
      about: "about",
      batch: "batch",
      branch: "branch",
      contact: "contact",
      cvLink: "cvLink",
      email: theirEmail,
      fbId: "fbId",
      instaId: "instaId",
      interests: "interests",
      isAdmin: false,
      isMember: true,
      linkedinId: "linkedinId",
      name: "name",
      position: "position",
      profileImageUrl: "profileImageUrl",
      quote: "quote",
    });
    await firebase.assertSucceeds(testRead.update({ name: "new_name" }));
  });
  it("PT -> Update User: {+} Only Allowed Fields, {-} Admin access, {+} Same User, {+} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/users").doc(theirId);
    await admin.collection("/users").doc(theirId).set({
      uid: theirId,
      about: "about",
      batch: "batch",
      branch: "branch",
      contact: "contact",
      cvLink: "cvLink",
      email: theirEmail,
      fbId: "fbId",
      instaId: "instaId",
      interests: "interests",
      isAdmin: false,
      isMember: true,
      linkedinId: "linkedinId",
      name: "name",
      position: "position",
      profileImageUrl: "profileImageUrl",
      quote: "quote",
    });
    await firebase.assertSucceeds(testRead.update({ name: "new_name" }));
  });
  it("NT -> Update User: {-} Only Allowed Fields, {-} Admin access, {+} Same User, {+} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/users").doc(theirId);
    await admin.collection("/users").doc(theirId).set({
      uid: theirId,
      about: "about",
      batch: "batch",
      branch: "branch",
      contact: "contact",
      cvLink: "cvLink",
      email: theirEmail,
      fbId: "fbId",
      instaId: "instaId",
      interests: "interests",
      isAdmin: false,
      isMember: true,
      linkedinId: "linkedinId",
      name: "name",
      position: "position",
      profileImageUrl: "profileImageUrl",
      quote: "quote",
    });
    await firebase.assertFails(
      testRead.update({ name: "new_name", gender: "Male" })
    );
  });
  it("NT -> Update User: {+} Only Allowed Fields, {-} Admin access, {-} Same User, {+} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(thirdAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/users").doc(theirId);
    await admin.collection("/users").doc(theirId).set({
      uid: theirId,
      about: "about",
      batch: "batch",
      branch: "branch",
      contact: "contact",
      cvLink: "cvLink",
      email: theirEmail,
      fbId: "fbId",
      instaId: "instaId",
      interests: "interests",
      isAdmin: false,
      isMember: true,
      linkedinId: "linkedinId",
      name: "name",
      position: "position",
      profileImageUrl: "profileImageUrl",
      quote: "quote",
    });
    await firebase.assertFails(testRead.update({ name: "new_name" }));
  });
  it("NT -> Update User: {+} Only Allowed Fields, {+} Admin access, {+} Same User, {-} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/users").doc(myId);
    await admin.collection("/users").doc(myId).set({
      uid: myId,
      about: "about",
      batch: "batch",
      branch: "branch",
      contact: "contact",
      cvLink: "cvLink",
      email: myEmail,
      fbId: "fbId",
      instaId: "instaId",
      interests: "interests",
      isAdmin: true,
      isMember: true,
      linkedinId: "linkedinId",
      name: "name",
      position: "position",
      profileImageUrl: "profileImageUrl",
      quote: "quote",
    });
    await firebase.assertFails(testRead.update({ name: true }));
  });
  it("NT -> Delete User: {+} Admin, {+} Delete Own User", async () => {
    const userId = myId;
    const db = getFirestore(myAuth);

    const testRead = db.collection("/users").doc(userId);
    await firebase.assertFails(testRead.delete());
  });

  // Project Collection Tests
  it("PT -> Read Projects:  {-} Auth", async () => {
    const projectId = "project_abc";
    const db = getFirestore(null);
    const testRead = db.collection("/projects").doc(projectId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("PT -> Create Projects: {+} All Required Fields, {+} Admin Access, {+} Valid Field Types", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/projects").doc(projectId);
    await firebase.assertSucceeds(
      testRead.set({
        date: "date",
        description: "description",
        fileUrl: "fileUrl",
        link: "link",
        name: "name",
        progress: "progress",
        projectImg: ["projectImg", "img"],
        teamMembers: [{ linkedinId: "myid", member: "member" }],
      })
    );
  });
  it("NT -> Create Projects: {+} All Required Fields, {+} Admin Access, {-} Valid Field Types", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/projects").doc(projectId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        description: "description",
        fileUrl: "fileUrl",
        link: "link",
        name: "name",
        progress: "progress",
        projectImg: ["projectImg", "img"],
        teamMembers: 4,
      })
    );
  });
  it("NT -> Create Projects: {-} All Required Fields, {+} Admin Access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/projects").doc(projectId);
    await firebase.assertFails(testRead.set({ name: "abc" }));
  });
  it("NT -> Create Projects: {+} All Required Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/projects").doc(projectId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        description: "description",
        fileUrl: "fileUrl",
        link: "link",
        name: "name",
        progress: "progress",
        projectImg: ["projectImg", "img"],
        teamMembers: [{ linkedinId: "myid", member: "member" }],
      })
    );
  });
  it("NT -> Create Projects: {-} All Required Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/projects").doc(projectId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        description: "description",
        link: "link",
        name: "name",
        progress: "progress",
        teamMembers: [{ linkedinId: "myid", member: "member" }],
      })
    );
  });
  it("PT -> Update Projects: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/projects").doc(projectId);
    await admin
      .collection("/projects")
      .doc(projectId)
      .set({
        date: "date",
        description: "description",
        fileUrl: "fileUrl",
        link: "link",
        name: "name",
        progress: "progress",
        projectImg: ["projectImg", "img"],
        teamMembers: [{ linkedinId: "myid", member: "member" }],
      });
    await firebase.assertSucceeds(testRead.update({ progress: "0" }));
  });
  it("NT -> Update Projects: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/projects").doc(projectId);
    await admin
      .collection("/projects")
      .doc(projectId)
      .set({
        date: "date",
        description: "description",
        fileUrl: "fileUrl",
        link: "link",
        name: "name",
        progress: "progress",
        teamMembers: [{ linkedinId: "myid", member: "member" }],
      });
    await firebase.assertFails(testRead.update({ date: true }));
  });
  it("NT -> Update Projects: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/projects").doc(projectId);
    await admin
      .collection("/projects")
      .doc(projectId)
      .set({
        date: "date",
        description: "description",
        fileUrl: "fileUrl",
        link: "link",
        name: "name",
        progress: "progress",
        projectImg: ["projectImg", "img"],
        teamMembers: [{ linkedinId: "myid", member: "member" }],
      });
    await firebase.assertFails(testRead.update({ date: "date_new" }));
  });
  it("NT -> Update Projects: {-} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/projects").doc(projectId);
    await admin
      .collection("/projects")
      .doc(projectId)
      .set({
        date: "date",
        description: "description",
        fileUrl: "fileUrl",
        link: "link",
        name: "name",
        progress: "progress",
        projectImg: ["projectImg", "img"],
        teamMembers: [{ linkedinId: "myid", member: "member" }],
      });
    await firebase.assertFails(
      testRead.update({ date: "date_new", uid: "uid" })
    );
  });
  it("NT -> Delete Projects: {+} Admin Access", async () => {
    await setupAdmin();
    const projectId = "project_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/projects").doc(projectId);
    await firebase.assertFails(testRead.delete());
  });

  // Contributors Collection Tests
  it("PT -> Read Contributors:  {-} Auth", async () => {
    const contributorId = "contributor_abc";
    const db = getFirestore(null);
    const testRead = db.collection("/contributors").doc(contributorId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("PT -> Create Contributor: {+} All Required Fields, {+} Admin Access, {+} Valid Field Types", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/contributors").doc(contributorId);
    await firebase.assertSucceeds(
      testRead.set({
        amount: "5000",
        date: "date",
        description: "description",
        name: "name",
        representativeImg: "representativeImg",
      })
    );
  });
  it("NT -> Create Contributor: {-} All Required Fields, {+} Admin Access, {+} Valid Field Types", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/contributors").doc(contributorId);
    await firebase.assertFails(
      testRead.set({
        amount: "5000",
        description: "description",
        name: "name",
        representativeImg: "representativeImg",
      })
    );
  });
  it("NT -> Create Contributor: {+} All Required Fields, {-} Admin Access, {+} Auth, {+} Valid Field Types", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/contributors").doc(contributorId);
    await firebase.assertFails(
      testRead.set({
        amount: "5000",
        date: "date",
        description: "description",
        name: "name",
        representativeImg: "representativeImg",
      })
    );
  });
  it("NT -> Create Contributor: {+} All Required Fields, {+} Admin Access, {-} Valid Field Types", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/contributors").doc(contributorId);
    await firebase.assertFails(
      testRead.set({
        amount: 5000,
        date: "16",
        description: "description",
        name: "name",
        representativeImg: "representativeImg",
      })
    );
  });
  it("PT -> Update Contributor: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/contributors").doc(contributorId);
    await admin.collection("/contributors").doc(contributorId).set({
      amount: "5000",
      date: "date",
      description: "description",
      name: "name",
      representativeImg: "representativeImg",
    });
    await firebase.assertSucceeds(testRead.update({ date: "date_new" }));
  });
  it("NT -> Update Contributor: {-} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/contributors").doc(contributorId);
    await admin.collection("/contributors").doc(contributorId).set({
      amount: "5000",
      date: "date",
      description: "description",
      name: "name",
      representativeImg: "representativeImg",
    });
    await firebase.assertFails(
      testRead.update({ date: "date_new", uid: "abc" })
    );
  });
  it("NT -> Update Contributor: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/contributors").doc(contributorId);
    await admin.collection("/contributors").doc(contributorId).set({
      amount: "5000",
      date: "date",
      description: "description",
      name: "name",
      representativeImg: "representativeImg",
    });
    await firebase.assertFails(testRead.update({ date: "date_new" }));
  });
  it("NT -> Update Contributor: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/contributors").doc(contributorId);
    await admin.collection("/contributors").doc(contributorId).set({
      amount: "5000",
      date: "date",
      description: "description",
      name: "name",
      representativeImg: "representativeImg",
    });
    await firebase.assertFails(testRead.update({ date: 15 }));
  });
  it("NT -> Delete Contributor: {+} Admin Access", async () => {
    await setupAdmin();
    const contributorId = "contributor_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/contributors").doc(contributorId);
    await firebase.assertFails(testRead.delete());
  });

  // Notifications Collection Tests
  it("PT -> Read Notification:  {-} Auth", async () => {
    const notificationId = "notificationId";
    const db = getFirestore(null);
    const testRead = db.collection("/notifications").doc(notificationId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("PT -> Create Notification: {+} All Required Fields, {+} Admin Access, {+} Valid Field Types", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/notifications").doc(notificationId);
    await firebase.assertSucceeds(
      testRead.set({
        date: "date",
        link: "link",
        msg: "msg",
        title: "title",
      })
    );
  });
  it("NT -> Create Notification: {-} All Required Fields, {+} Admin Access, {+} Valid Field Types", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/notifications").doc(notificationId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        link: "link",
        title: "title",
      })
    );
  });
  it("NT -> Create Notification: {+} All Required Fields, {-} Admin Access, {+} Auth, {+} Valid Field Types", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/notifications").doc(notificationId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        link: "link",
        msg: "msg",
        title: "title",
      })
    );
  });
  it("NT -> Create Notification: {+} All Required Fields, {+} Admin Access, {-} Valid Field Types", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/notifications").doc(notificationId);
    await firebase.assertFails(
      testRead.set({
        date: 15,
        link: "link",
        msg: "msg",
        title: "title",
      })
    );
  });
  it("PT -> Update Notification: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/notifications").doc(notificationId);
    await admin.collection("/notifications").doc(notificationId).set({
      date: "date",
      link: "link",
      msg: "msg",
      title: "title",
    });
    await firebase.assertSucceeds(testRead.update({ date: "date_new" }));
  });
  it("NT -> Update Notification: {-} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/notifications").doc(notificationId);
    await admin.collection("/notifications").doc(notificationId).set({
      date: "date",
      link: "link",
      msg: "msg",
      title: "title",
    });
    await firebase.assertFails(
      testRead.update({ date: "date_new", uid: "abc" })
    );
  });
  it("NT -> Update Notification: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/notifications").doc(notificationId);
    await admin.collection("/notifications").doc(notificationId).set({
      date: "date",
      link: "link",
      msg: "msg",
      title: "title",
    });
    await firebase.assertFails(testRead.update({ date: "date_new" }));
  });
  it("NT -> Update Notification: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/notificationId").doc(notificationId);
    await admin.collection("/notificationId").doc(notificationId).set({
      date: "date",
      link: "link",
      msg: "msg",
      title: "title",
    });
    await firebase.assertFails(testRead.update({ date: 15 }));
  });
  it("PT -> Delete Notification: {+} Admin Access", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/notifications").doc(notificationId);
    await firebase.assertSucceeds(testRead.delete());
  });
  it("NT -> Delete Notification: {-} Admin Access, {+} Auth", async () => {
    await setupAdmin();
    const notificationId = "notificationId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/notifications").doc(notificationId);
    await firebase.assertFails(testRead.delete());
  });

  // Events Collection Tests
  it("PT -> Read Event:  {-} Auth", async () => {
    const eventId = "eventId";
    const db = getFirestore(null);
    const testRead = db.collection("/events").doc(eventId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("PT -> Create Event: {+} All Required Fields, {+} Admin Access, {+} Valid Field Types", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/events").doc(eventId);
    await firebase.assertSucceeds(
      testRead.set({
        date: "date",
        details: "details",
        endTime: "endTime",
        eventName: "eventName",
        place: "place",
        posterURL: "posterURL",
        regFormLink: "regFormLink",
        startTime: "startTime",
        isFeatured: true,
      })
    );
  });
  it("NT -> Create Event: {-} All Required Fields, {+} Admin Access, {+} Valid Field Types", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/events").doc(eventId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        details: "details",
        endTime: "endTime",
        eventName: "eventName",
        posterURL: "posterURL",
        regFormLink: "regFormLink",
        startTime: "startTime",
        isFeatured: true,
      })
    );
  });
  it("NT -> Create Event: {+} All Required Fields, {-} Admin Access, {+} Auth, {+} Valid Field Types", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/events").doc(eventId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        details: "details",
        endTime: "endTime",
        eventName: "eventName",
        place: "place",
        posterURL: "posterURL",
        regFormLink: "regFormLink",
        startTime: "startTime",
        isFeatured: true,
      })
    );
  });
  it("NT -> Create Event: {+} All Required Fields, {+} Admin Access, {-} Valid Field Types", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/events").doc(eventId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        details: "details",
        endTime: "endTime",
        eventName: "eventName",
        place: "place",
        posterURL: "posterURL",
        regFormLink: true,
        startTime: "startTime",
        isFeatured: true,
      })
    );
  });
  it("PT -> Update Event: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/events").doc(eventId);
    await admin.collection("/events").doc(eventId).set({
      date: "date",
      details: "details",
      endTime: "endTime",
      eventName: "eventName",
      place: "place",
      posterURL: "posterURL",
      regFormLink: "regFormLink",
      startTime: "startTime",
      isFeatured: true,
    });
    await firebase.assertSucceeds(testRead.update({ place: "new_place" }));
  });
  it("NT -> Update Event: {-} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/events").doc(eventId);
    await admin.collection("/events").doc(eventId).set({
      date: "date",
      details: "details",
      endTime: "endTime",
      eventName: "eventName",
      place: "place",
      posterURL: "posterURL",
      regFormLink: "regFormLink",
      startTime: "startTime",
      isFeatured: true,
    });
    await firebase.assertFails(
      testRead.update({ place: "new_place", uid: "abc" })
    );
  });
  it("NT -> Update Event: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/events").doc(eventId);
    await admin.collection("/events").doc(eventId).set({
      date: "date",
      details: "details",
      endTime: "endTime",
      eventName: "eventName",
      place: "place",
      posterURL: "posterURL",
      regFormLink: "regFormLink",
      startTime: "startTime",
      isFeatured: true,
    });
    await firebase.assertFails(testRead.update({ place: "new_place" }));
  });
  it("NT -> Update Event: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/eventId").doc(eventId);
    await admin.collection("/eventId").doc(eventId).set({
      date: "date",
      details: "details",
      endTime: "endTime",
      eventName: "eventName",
      place: "place",
      posterURL: "posterURL",
      regFormLink: "regFormLink",
      startTime: "startTime",
      isFeatured: true,
    });
    await firebase.assertFails(testRead.update({ date: 15 }));
  });
  it("PT -> Delete Event: {+} Admin Access", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/events").doc(eventId);
    await firebase.assertSucceeds(testRead.delete());
  });
  it("NT -> Delete Event: {-} Admin Access, {+} Auth", async () => {
    await setupAdmin();
    const eventId = "eventId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/events").doc(eventId);
    await firebase.assertFails(testRead.delete());
  });

  // Tutorials Collection Tests
  it("PT -> Read Tutorials: {-} Auth", async () => {
    const tutorialId = "tutorialId";
    const db = getFirestore(null);

    const testRead = db.collection("/tutorials").doc(tutorialId);
    await firebase.assertSucceeds(testRead.get());
  });
  it("NT -> Create Tutorial: {+} Admin access", async () => {
    await setupAdmin();
    const tutorialId = "tutorialId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/tutorials").doc(tutorialId);
    await firebase.assertFails(
      testRead.set({
        title: "anytitle",
        link: "any_link",
      })
    );
  });
  it("NT -> Update Tutorial: {+} Admin access", async () => {
    await setupAdmin();
    const tutorialId = "tutorialId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/tutorials").doc(tutorialId);
    await admin.collection("/tutorials").doc(tutorialId).set({
      title: "anytitle",
      link: "any_link",
    });
    await firebase.assertFails(testRead.update({ title: "new_title" }));
  });
  it("NT -> Delete Tutorial: {+} Admin Access", async () => {
    await setupAdmin();
    const tutorialId = "tutorialId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/tutorials").doc(tutorialId);
    await firebase.assertFails(testRead.delete());
  });

  // Feedback Collection Tests
  it("NT -> Read Feedbacks: {-} Auth", async () => {
    await setupAdmin();
    const feedbackId = "feedbackId";
    const db = getFirestore(null);

    const testRead = db.collection("/feedbacks").doc(feedbackId);
    await firebase.assertFails(testRead.get());
  });
  it("NT -> Read Feedbacks: {-} Admin Access, {+} Auth", async () => {
    await setupAdmin();
    const feedbackId = "feedbackId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/feedbacks").doc(feedbackId);
    await firebase.assertFails(testRead.get());
  });
  it("PT -> Read Feedbacks: {+} Admin Access", async () => {
    await setupAdmin();
    const feedbackId = "feedbackId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/feedbacks").doc(feedbackId);
    await firebase.assertSucceeds(testRead.get());
  });
  it("PT -> Create Feedbacks: {+} All Required Fields, {-} Auth, {+} Only Allowed Fields, {+} Valid Field Types", async () => {
    await setupAdmin();
    const feedbackId = "feedback_abc";
    const db = getFirestore(null);

    const testRead = db.collection("/feedbacks").doc(feedbackId);
    await firebase.assertSucceeds(
      testRead.set({
        dateTime: "dateTime",
        feedback: "feedback",
        isMember: true,
      })
    );
  });
  it("NT -> Create Feedbacks: {-} All Required Fields, {+} Only Allowed Fields {+} Valid Field Types", async () => {
    await setupAdmin();
    const feedbackId = "feedback_abc";
    const db = getFirestore(null);

    const testRead = db.collection("/feedbacks").doc(feedbackId);
    await firebase.assertFails(
      testRead.set({
        dateTime: "dateTime",
        feedback: "feedback",
      })
    );
  });
  it("NT -> Create Feedbacks: {+} All Required Fields, {+} Only Allowed Fields {-} Valid Field Types", async () => {
    const feedbackId = "feedback_abc";
    const db = getFirestore(null);

    const testRead = db.collection("/feedbacks").doc(feedbackId);
    await firebase.assertFails(
      testRead.set({
        dateTime: "dateTime",
        feedback: "feedback",
        isMember: "true",
      })
    );
  });
  it("NT -> Create Feedbacks: {+} All Required Fields, {-} Only Allowed Fields {+} Valid Field Types", async () => {
    const feedbackId = "feedback_abc";
    const db = getFirestore(null);

    const testRead = db.collection("/feedbacks").doc(feedbackId);
    await firebase.assertFails(
      testRead.set({
        dateTime: "dateTime",
        feedback: "feedback",
        isMember: "true",
        name: "name",
      })
    );
  });
  it("NT -> Delete Feedbacks: {+} Admin Access", async () => {
    await setupAdmin();
    const feedbackId = "feedback_abc";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/contributors").doc(feedbackId);
    await firebase.assertFails(testRead.delete());
  });

  // Keys Collection Tests
  it("PT -> Read Keys: {+} Admin", async () => {
    await setupAdmin();
    const keyId = "keyId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/keys").doc(keyId);
    await firebase.assertSucceeds(testRead.get());
  });
  it("NT -> Read Keys: {-} Admin, {+} Auth", async () => {
    await setupAdmin();
    const keyId = "keyId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/keys").doc(keyId);
    await firebase.assertFails(testRead.get());
  });
  it("NT -> Create Keys: {+} Admin Access", async () => {
    await setupAdmin();
    const keyId = "keyId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/keys").doc(keyId);
    await firebase.assertFails(
      testRead.set({
        key: "new_key",
      })
    );
  });
  it("NT -> Update Keys: {+} Admin access", async () => {
    await setupAdmin();
    const keyId = "keyId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/keys").doc(keyId);
    await admin.collection("/keys").doc(keyId).set({
      key: "old_key",
    });
    await firebase.assertFails(testRead.update({ key: "new_key" }));
  });
  it("NT -> Delete Keys: {+} Admin Access", async () => {
    await setupAdmin();
    const keyId = "keyId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/keys").doc(keyId);
    await firebase.assertFails(testRead.delete());
  });

  // Downloads page tests
  it("PT -> Read Downloads: {-} Auth", async () => {
    const downloadsId = "downloadsId";
    const db = getFirestore(null);

    const testRead = db.collection("/downloads").doc(downloadsId);
    await firebase.assertSucceeds(testRead.get());
  });
  it("PT -> Create Downloads: {+} Admin Access, {+} Only Allowed Fields, {+} Valid Field Type", async () => {
    await setupAdmin();
    const downloadsId = "downloadsId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/downloads").doc(downloadsId);
    await firebase.assertSucceeds(
      testRead.set({
        name: "any_name",
        items: [
          {
            file: "file",
            name: "name",
            size: "size",
            url: "url",
          },
        ],
      })
    );
  });
  it("NT -> Create Downloads: {+} Admin Access, {+} Only Allowed Fields, {-} Valid Field Type", async () => {
    await setupAdmin();
    const downloadsId = "downloadsId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/downloads").doc(downloadsId);
    await firebase.assertFails(
      testRead.set({
        name: "any_name",
        items: [
          {
            file: "file",
            name: "name",
            size: 53,
            url: "url",
          },
        ],
      })
    );
  });
  it("NT -> Create Downloads: {+} Admin access, {-} Only Allowed Fields", async () => {
    await setupAdmin();
    const downloadsId = "downloadsId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/downloads").doc(downloadsId);
    await firebase.assertFails(
      testRead.set({
        name: "any_name",
        new_field: "onemore",
        items: [
          {
            file: "file",
            name: "name",
            size: "size",
            url: "url",
          },
        ],
      })
    );
  });
  it("NT -> Create Downloads: {-} Admin access, {+} Only Allowed Fields, {+} Auth, {+} Valid Field Type ", async () => {
    await setupAdmin();
    const downloadsId = "downloadsId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/downloads").doc(downloadsId);
    await firebase.assertFails(
      testRead.set({
        name: "any_name",
        items: [
          {
            file: "file",
            name: "name",
            size: "size",
            url: "url",
          },
        ],
      })
    );
  });
  it("PT -> Update Downlods: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const downloadsId = "downloadsId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/downloads").doc(downloadsId);
    await admin
      .collection("/downloads")
      .doc(downloadsId)
      .set({
        name: "any_name",
        items: [
          {
            file: "file",
            name: "name",
            size: "size",
            url: "url",
          },
        ],
      });
    await firebase.assertSucceeds(testRead.update({ name: "new_name" }));
  });
  it("NT -> Update Downloads: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const downloadsId = "downloadsId";
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/downloads").doc(downloadsId);
    await admin.collection("/downloads").doc(downloadsId).set({
      file: "file",
      name: "name",
      size: "size",
      url: "url",
    });
    await firebase.assertFails(testRead.update({ file: "file_new" }));
  });
  it("NT -> Update Downloads: {-} Only Allowed Fields, {+} Admin access", async () => {
    await setupAdmin();
    const downloadsId = "downloadsId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/downloads").doc(downloadsId);
    await admin
      .collection("/downloads")
      .doc(downloadsId)
      .set({
        name: "any_name",
        items: [
          {
            file: "file",
            name: "name",
            size: "size",
            url: "url",
          },
        ],
      });
    await firebase.assertFails(testRead.update({ date: "date" }));
  });
  it("NT -> Update Downloads: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const downloadsId = "downloadsId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/downloads").doc(downloadsId);
    await admin
      .collection("/downloads")
      .doc(downloadsId)
      .set({
        name: "any_name",
        items: [
          {
            file: "file",
            name: "name",
            size: "size",
            url: "url",
          },
        ],
      });
    await firebase.assertFails(testRead.update({ name: 2 }));
  });

  // Current team tests
  it("PT -> Read Current team: {-} Auth", async () => {
    const singleId = "single_Id";
    const db = getFirestore(null);

    const testRead = db.collection("/currentTeam").doc(singleId);
    await firebase.assertSucceeds(testRead.get());
  });
  it("NT -> Create current team: {+} Admin access, {+} Only Allowed Fields", async () => {
    await setupAdmin();
    const singleId = "single_Id";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/currentTeam").doc(singleId);
    await firebase.assertFails(testRead.set({ data: "email" }));
  });

  // Push tokens tests
  it("PT -> Read pushTokens: {+} Admin access", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(myAuth);
    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("NT -> Read pushTokens: {-} Admin access, {+} Auth", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(theirAuth);
    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    await firebase.assertFails(testRead.get());
  });
  it("PT -> Create pushTokens: {-} Admin access, {-} Auth, {+} Only Allowed Fields {+} Valid Field Type", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(null);

    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    const currentTimeStamp = new Date();
    await firebase.assertSucceeds(
      testRead.set({
        androidId: "id",
        createdAt: currentTimeStamp,
        deviceToken: "token",
        platform: "android",
      })
    );
  });
  it("NT -> Create pushTokens: {-} Admin access, {-} Auth, {-} Only Allowed Fields {+} Valid Field Type", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(null);

    const currentTimeStamp = new Date();
    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    await firebase.assertFails(
      testRead.set({
        androidId: "id",
        createdAt: currentTimeStamp,
        deviceToken: "token",
        platform: "android",
        location: "location",
      })
    );
  });
  it("NT -> Create pushTokens: {-} Admin access, {-} Auth, {+} Only Allowed Fields {-} Valid Field Type", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(null);

    const currentTimeStamp = new Date();
    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    await firebase.assertFails(
      testRead.set({
        androidId: "id",
        createdAt: currentTimeStamp,
        deviceToken: 0,
        platform: "android",
      })
    );
  });
  it("PT -> Update pushTokens: {-} Admin access, {-} Auth, {+} Request Id == Resource Id {+} Valid Field Type {+} Only Allowed Fields", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(null);
    const admin = getAdminFirestore();

    const currentTimeStamp = new Date();
    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    await admin.collection("/pushTokens").doc(pushTokensId).set({
      androidId: "id",
      createdAt: currentTimeStamp,
      deviceToken: "token",
      platform: "android",
    });
    await firebase.assertSucceeds(
      testRead.update({ deviceToken: "token_new" })
    );
  });
  it("NT -> Update pushTokens: {-} Admin access, {-} Auth, {-} Resource ID == Request ID {+} Only Allowed Fields {+} Valid Field Type", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(null);
    const admin = getAdminFirestore();

    const currentTimeStamp = new Date();
    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    await admin.collection("/pushTokens").doc(pushTokensId).set({
      androidId: "id",
      createdAt: currentTimeStamp,
      deviceToken: "token",
      platform: "android",
    });
    await firebase.assertFails(
      testRead.update({ androidId: "id_new", createdAt: currentTimeStamp })
    );
  });
  it("NT -> Update pushTokens: {-} Admin access, {-} Auth, {+} Resource ID == Request ID {-} Valid Field Type {+} Only Allowed Fields", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(null);
    const admin = getAdminFirestore();

    const currentTimeStamp = new Date();
    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    await admin.collection("/pushTokens").doc(pushTokensId).set({
      androidId: "id",
      createdAt: currentTimeStamp,
      deviceToken: "token",
      platform: "android",
    });
    await firebase.assertFails(testRead.update({ deviceToken: 0 }));
  });
  it("NT -> Update pushTokens: {-} Admin access, {-} Auth, {+} Resource ID == Request ID {+} Valid Field Type {-} Only Allowed Fields", async () => {
    await setupAdmin();
    const pushTokensId = "pushTokens_Id";
    const db = getFirestore(null);
    const admin = getAdminFirestore();

    const currentTimeStamp = new Date();
    const testRead = db.collection("/pushTokens").doc(pushTokensId);
    await admin.collection("/pushTokens").doc(pushTokensId).set({
      androidId: "id",
      createdAt: currentTimeStamp,
      deviceToken: "token",
      platform: "android",
    });
    await firebase.assertFails(testRead.update({ location: "location" }));
  });

  // News Tests
  it("PT -> Read News: {-} Auth", async () => {
    const newsId = "newsId";
    const db = getFirestore(null);

    const testRead = db.collection("/news").doc(newsId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("PT -> Create News: {+} All Required Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/news").doc(newsId);
    await firebase.assertSucceeds(
      testRead.set({
        date: "date",
        link: "link",
        notice: "notice",
        notification: "yes",
        timestamp: -100,
        title: "title",
      })
    );
  });
  it("PT -> Create News: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/news").doc(newsId);
    await firebase.assertSucceeds(
      testRead.set({
        date: "date",
        link: "link",
        notice: "notice",
        notification: "yes",
        sent: "sent",
        timestamp: -100,
        title: "title",
      })
    );
  });
  it("NT -> Create News: {-} All Required Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/news").doc(newsId);
    await firebase.assertFails(
      testRead.set({
        link: "link",
        notice: "notice",
        sent: "sent",
        timestamp: -100,
        title: "title",
      })
    );
  });
  it("NT -> Create News: {+} All Required Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/news").doc(newsId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        link: "link",
        notice: "notice",
        notification: "yes",
        sent: "sent",
        timestamp: -100,
        title: "title",
      })
    );
  });
  it("NT -> Create News: {+} All Required Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/news").doc(newsId);
    await firebase.assertFails(
      testRead.set({
        date: "date",
        link: "link",
        notice: "notice",
        notification: "yes",
        sent: "sent",
        timestamp: "timestamp",
        title: "title",
      })
    );
  });

  it("PT -> Update News: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/news").doc(newsId);
    await admin.collection("/news").doc(newsId).set({
      date: "date",
      link: "link",
      notice: "notice",
      notification: "yes",
      sent: "sent",
      timestamp: -100,
      title: "title",
    });
    await firebase.assertSucceeds(testRead.update({ date: "date_new" }));
  });
  it("NT -> Update News: {-} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/news").doc(newsId);
    await admin.collection("/news").doc(newsId).set({
      date: "date",
      link: "link",
      notice: "notice",
      notification: "yes",
      sent: "sent",
      timestamp: -100,
      title: "title",
    });
    await firebase.assertFails(
      testRead.update({ date: "dateNew", uid: "uidNew" })
    );
  });
  it("NT -> Update News: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/news").doc(newsId);
    await admin.collection("/news").doc(newsId).set({
      date: "date",
      link: "link",
      notice: "notice",
      notification: "yes",
      sent: "sent",
      timestamp: -100,
      title: "title",
    });
    await firebase.assertFails(testRead.update({ notice: "noticeUpdate" }));
  });
  it("NT -> Update News: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/news").doc(newsId);
    await admin.collection("/news").doc(newsId).set({
      date: "date",
      link: "link",
      notice: "notice",
      notification: "yes",
      sent: "sent",
      timestamp: -100,
      title: "title",
    });
    await firebase.assertFails(testRead.update({ notification: true }));
  });
  it("PT -> Delete News: {+} Admin Access", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/news").doc(newsId);
    await firebase.assertSucceeds(testRead.delete());
  });
  it("NT -> Delete News: {-} Admin Access, {+} Auth", async () => {
    await setupAdmin();
    const newsId = "newsId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/news").doc(newsId);
    await firebase.assertFails(testRead.delete());
  });

  // Robocon Tests
  it("PT -> Read Robocon: {-} Auth", async () => {
    const roboconId = "roboconId";
    const db = getFirestore(null);

    const testRead = db.collection("/robocon").doc(roboconId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("PT -> Create Robocon: {+} All Required Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const roboconId = "roboconId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/robocon").doc(roboconId);
    await firebase.assertSucceeds(
      testRead.set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      })
    );
  });
  it("NT -> Create Robocon: {-} All Required Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const roboconId = "roboconId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/robocon").doc(roboconId);
    await firebase.assertFails(
      testRead.set({
        about: "about",
        image: "imageUrl",
        introduction: "introduction",
        video: "videoUrl",
      })
    );
  });
  it("NT -> Create Robocon: {+} All Required Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const roboconId = "roboconId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/robocon").doc(roboconId);
    await firebase.assertFails(
      testRead.set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      })
    );
  });
  it("NT -> Create Robocon: {+} All Required Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const roboconId = "roboconId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/robocon").doc(roboconId);
    await firebase.assertFails(
      testRead.set({
        about: "about",
        gallery: "gallery",
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      })
    );
  });

  it("PT -> Update Robocon: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const roboconId = "roboconId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/robocon").doc(roboconId);
    await admin
      .collection("/robocon")
      .doc(roboconId)
      .set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      });
    await firebase.assertSucceeds(testRead.update({ title: "titleNew" }));
  });
  it("NT -> Update Robocon: {-} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const roboconId = "roboconId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/robocon").doc(roboconId);
    await admin
      .collection("/robocon")
      .doc(roboconId)
      .set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      });
    await firebase.assertFails(
      testRead.update({ title: "titleNew", uid: "uidNew" })
    );
  });
  it("NT -> Update Robocon: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const roboconId = "roboconId";
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/robocon").doc(roboconId);
    await admin
      .collection("/robocon")
      .doc(roboconId)
      .set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      });
    await firebase.assertFails(testRead.update({ image: "imageUrlNew" }));
  });
  it("NT -> Update Robocon: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const roboconId = "roboconId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/robocon").doc(roboconId);
    await admin
      .collection("/robocon")
      .doc(roboconId)
      .set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      });
    await firebase.assertFails(testRead.update({ image: false }));
  });

  // Robovoyage Tests
  it("PT -> Read Robovoyage: {-} Auth", async () => {
    const robovoyageId = "robovoyageId";
    const db = getFirestore(null);

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("PT -> Create Robovoyage: {+} All Required Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const robovoyageId = "robovoyageId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await firebase.assertSucceeds(
      testRead.set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      })
    );
  });
  it("NT -> Create Robovoyage: {-} All Required Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const robovoyageId = "robovoyageId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await firebase.assertFails(
      testRead.set({
        about: "about",
        image: "imageUrl",
        introduction: "introduction",
        video: "videoUrl",
      })
    );
  });
  it("NT -> Create Robovoyage: {+} All Required Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const robovoyageId = "robovoyageId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await firebase.assertFails(
      testRead.set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      })
    );
  });
  it("NT -> Create Robovoyage: {+} All Required Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const robovoyageId = "robovoyageId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await firebase.assertFails(
      testRead.set({
        about: "about",
        gallery: [true],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      })
    );
  });

  it("PT -> Update Robovoyage: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const robovoyageId = "robovoyageId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await admin
      .collection("/robovoyage")
      .doc(robovoyageId)
      .set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      });
    await firebase.assertSucceeds(testRead.update({ title: "titleNew" }));
  });
  it("NT -> Update Robovoyage: {-} Only Allowed Fields, {+} Admin access, {+} Valid Field Type", async () => {
    await setupAdmin();
    const robovoyageId = "robovoyageId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await admin
      .collection("/robovoyage")
      .doc(robovoyageId)
      .set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      });
    await firebase.assertFails(
      testRead.update({ title: "titleNew", uid: "uidNew" })
    );
  });
  it("NT -> Update Robovoyage: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const robovoyageId = "robovoyageId";
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await admin
      .collection("/robovoyage")
      .doc(robovoyageId)
      .set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      });
    await firebase.assertFails(testRead.update({ image: "imageUrlNew" }));
  });
  it("NT -> Update Robovoyage: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type", async () => {
    await setupAdmin();
    const robovoyageId = "robovoyageId";
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();

    const testRead = db.collection("/robovoyage").doc(robovoyageId);
    await admin
      .collection("/robovoyage")
      .doc(robovoyageId)
      .set({
        about: "about",
        gallery: ["urlOne", "urlTwo"],
        image: "imageUrl",
        introduction: "introduction",
        title: "title",
        video: "videoUrl",
      });
    await firebase.assertFails(testRead.update({ image: true }));
  });

  // New Members Registration Tests
  it("PT -> Read Members: {+} Auth, {+} Admin access", async () => {
    await setupAdmin();
    const memberId = "memberId";
    const db = getFirestore(myAuth);

    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("NT -> Read Members: {-} Auth", async () => {
    const memberId = "memberId";
    const db = getFirestore(null);

    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(testRead.get());
  });

  it("NT -> Read Members: {+} Auth, {-} Admin access", async () => {
    const memberId = "memberId";
    const db = getFirestore(theirAuth);

    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(testRead.get());
  });

  it("PT -> Create Member: {+} All Required Fields, {-} Admin access, {-} Auth, {+} Valid Field Type", async () => {
    const db = getFirestore(null);
    const memberId = "memberId";

    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertSucceeds(
      testRead.set({
        timestamp: 32123421,
        course: "course",
        email: "email",
        paymentStatus: true,
        facultyNumber: "facultyNumber",
        enrollmentNumber: "enrollmentNumber",
        mobile: "mobile",
        name: "name",
        registrationNumber: "registrationNumber",
      })
    );
  });
  it("NT -> Create Member: {-} All Required Fields, {-} Admin access, {-} Auth, {+} Valid Field Type", async () => {
    const db = getFirestore(null);
    const memberId = "memberId";

    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(
      testRead.set({
        some_other_field: "some_other_field",
        timestamp: 32123421,
        course: "course",
        email: "email",
        paymentStatus: true,
        facultyNumber: "facultyNumber",
        enrollmentNumber: "enrollmentNumber",
        mobile: "mobile",
        name: "name",
        registrationNumber: "registrationNumber",
      })
    );
  });
  it("NT -> Create Member: {+} All Required Fields, {-} Admin access, {-} Auth, {-} Valid Field Type", async () => {
    const db = getFirestore(null);
    const memberId = "memberId";

    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(
      testRead.set({
        timestamp: 32123421,
        course: "course",
        email: 1234,
        paymentStatus: true,
        facultyNumber: "facultyNumber",
        enrollmentNumber: "enrollmentNumber",
        mobile: "mobile",
        name: "name",
        registrationNumber: "registrationNumber",
      })
    );
  });

  it("PT -> Update Member: {+} Only Allowed Fields, {+} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();
    const memberId = "memberId";

    await admin.collection("members").doc(memberId).set({
      timestamp: 32123421,
      course: "course",
      email: "email",
      paymentStatus: true,
      facultyNumber: "facultyNumber",
      enrollmentNumber: "enrollmentNumber",
      mobile: "mobile",
      name: "name",
      registrationNumber: "registrationNumber",
    });
    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertSucceeds(
      testRead.update({
        facultyNumber: "newFacultyNumber",
        enrollmentNumber: "newenrollmentNumber",
      })
    );
  });
  it("NT -> Update Member: {+} Only Allowed Fields, {-} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();
    const memberId = "memberId";

    await admin.collection("members").doc(memberId).set({
      timestamp: 32123421,
      course: "course",
      email: "email",
      paymentStatus: true,
      facultyNumber: "facultyNumber",
      enrollmentNumber: "enrollmentNumber",
      mobile: "mobile",
      name: "name",
      registrationNumber: "registrationNumber",
    });
    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(
      testRead.update({
        facultyNumber: "newFacultyNumber",
        enrollmentNumber: "newenrollmentNumber",
      })
    );
  });
  it("NT -> Update Member: {+} Only Allowed Fields, {+} Admin access, {+} Auth, {-} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();
    const memberId = "memberId";

    await admin.collection("members").doc(memberId).set({
      timestamp: 32123421,
      course: "course",
      email: "email",
      paymentStatus: true,
      facultyNumber: "facultyNumber",
      enrollmentNumber: "enrollmentNumber",
      mobile: "mobile",
      name: "name",
      registrationNumber: "registrationNumber",
    });
    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(
      testRead.update({
        facultyNumber: 1234,
        enrollmentNumber: 5467,
      })
    );
  });
  it("NT -> Update Member: {-} Only Allowed Fields, {+} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();
    const memberId = "memberId";

    await admin.collection("members").doc(memberId).set({
      timestamp: 32123421,
      course: "course",
      email: "email",
      paymentStatus: true,
      facultyNumber: "facultyNumber",
      enrollmentNumber: "enrollmentNumber",
      mobile: "mobile",
      name: "name",
      registrationNumber: "registrationNumber",
    });
    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(
      testRead.update({
        facultyNumber: "newFacultyNumber",
        enrollmentNumber: "newenrollmentNumber",
        someOtherField: 2139847,
      })
    );
  });
  it("NT -> Update Member: {-} Only Allowed Fields, {+} Admin access, {+} Auth, {+} Valid Field Type", async () => {
    await setupAdmin();
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();
    const memberId = "memberId";

    await admin.collection("members").doc(memberId).set({
      timestamp: 32123421,
      course: "course",
      email: "email",
      paymentStatus: true,
      facultyNumber: "facultyNumber",
      enrollmentNumber: "enrollmentNumber",
      mobile: "mobile",
      name: "name",
      registrationNumber: "registrationNumber",
    });
    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(
      testRead.update({
        facultyNumber: "newFacultyNumber",
        enrollmentNumber: "newenrollmentNumber",
        someOtherField: 2139847,
      })
    );
  });
  it("PT -> Delete Member: {+} Admin access, {+} Auth", async () => {
    await setupAdmin();
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();
    const memberId = "memberId";

    await admin.collection("members").doc(memberId).set({
      timestamp: 32123421,
      course: "course",
      email: "email",
      paymentStatus: true,
      facultyNumber: "facultyNumber",
      enrollmentNumber: "enrollmentNumber",
      mobile: "mobile",
      name: "name",
      registrationNumber: "registrationNumber",
    });
    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertSucceeds(testRead.delete());
  });
  it("NT -> Delete Member: {-} Admin access, {+} Auth", async () => {
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();
    const memberId = "memberId";

    await admin.collection("members").doc(memberId).set({
      timestamp: 32123421,
      course: "course",
      email: "email",
      paymentStatus: true,
      facultyNumber: "facultyNumber",
      enrollmentNumber: "enrollmentNumber",
      mobile: "mobile",
      name: "name",
      registrationNumber: "registrationNumber",
    });
    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(testRead.delete());
  });
  it("NT -> Delete Member: {-} Auth", async () => {
    const db = getFirestore(null);
    const admin = getAdminFirestore();
    const memberId = "memberId";

    await admin.collection("members").doc(memberId).set({
      timestamp: 32123421,
      course: "course",
      email: "email",
      paymentStatus: true,
      facultyNumber: "facultyNumber",
      enrollmentNumber: "enrollmentNumber",
      mobile: "mobile",
      name: "name",
      registrationNumber: "registrationNumber",
    });
    const testRead = db.collection("/members").doc(memberId);
    await firebase.assertFails(testRead.delete());
  });

  // Faculty Number Tests
  it("PT -> Create New Faculty Number: {-} Auth", async () => {
    const db = getFirestore(null);
    const facultyNumbersId = "facultyNumbersId";

    const testRead = db.collection("/facultyNumbers").doc(facultyNumbersId);
    await firebase.assertSucceeds(
      testRead.set({
        value: true,
      })
    );
  });

  it("PT -> Read New Faculty Number: {-} Auth", async () => {
    const db = getFirestore(null);
    const facultyNumbersId = "facultyNumbersId";

    const testRead = db.collection("/facultyNumbers").doc(facultyNumbersId);
    await firebase.assertSucceeds(testRead.get());
  });

  it("PT -> Delete New Faculty Number: {+} Admin access, {+} Auth", async () => {
    await setupAdmin();
    const db = getFirestore(myAuth);
    const admin = getAdminFirestore();
    const facultyNumbersId = "facultyNumbersId";

    await admin.collection("/facultyNumbers").doc(facultyNumbersId).set({
      value: true,
    });

    const testRead = db.collection("/facultyNumbers").doc(facultyNumbersId);
    await firebase.assertSucceeds(testRead.delete());
  });

  it("NT -> Delete New Faculty Number: {-} Admin access, {+} Auth", async () => {
    const db = getFirestore(theirAuth);
    const admin = getAdminFirestore();
    const facultyNumbersId = "facultyNumbersId";

    await admin.collection("/facultyNumbers").doc(facultyNumbersId).set({
      value: true,
    });

    const testRead = db.collection("/facultyNumbers").doc(facultyNumbersId);
    await firebase.assertFails(testRead.delete());
  });

  it("NT -> Delete New Faculty Number: {-} Auth", async () => {
    const db = getFirestore(null);
    const admin = getAdminFirestore();
    const facultyNumbersId = "facultyNumbersId";

    await admin.collection("/facultyNumbers").doc(facultyNumbersId).set({
      value: true,
    });

    const testRead = db.collection("/facultyNumbers").doc(facultyNumbersId);
    await firebase.assertFails(testRead.delete());
  });
});

after(async () => {
  await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});
