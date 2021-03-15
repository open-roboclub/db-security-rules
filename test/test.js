const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = "amu-roboclub";
const myId = "user_abc";
const myEmail = "abc@gmail.com";
const theirId = "user_xyz";
const theirEmail = "xyz@gmail.com";
const myAuth = { uid: myId, email: myEmail };
const theirAuth = { uid: theirId, email: theirEmail };
const thirdAuth = { uid: 'user_axb', email: "axb@gmail.com" };

function getFirestore(auth) {
    return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth }).firestore();
}
function getAdminFirestore() {
    return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}
async function setupAdmin() {
    const admin = getAdminFirestore();
    const setupUser = admin.collection('/users').doc(myId);
    await setupUser.set({ isAdmin: true, name: "abc", email: myEmail });
}

beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

// Nemonics
// NT = Negative Test, PT = Positive Test
// {-} = Excluded , {+} = Included

describe('AMURoboclub app DB Unit Testing', () => {

    // User Collection Tests
    it('PT -> Read Users:  {-} Auth', async () => {
        const user_id = myId;
        const db = getFirestore(null);
        const testRead = db.collection('/users').doc(user_id);
        await firebase.assertSucceeds(testRead.get());
    });
    it('PT -> Create User: {+} All Required Fields, {+} Auth, {+} Create Own User, {+} Valid Field Type', async () => {
        const user_id = myId;
        const db = getFirestore(myAuth);

        const testRead = db.collection('/users').doc(user_id);
        await firebase.assertSucceeds(testRead.set({ uid: myId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: myEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: false, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" }));
    });
    it('NT -> Create User: {-} All Required Fields, {+} Auth, {+} Create Own User, {+} Valid Field Type', async () => {
        const user_id = myId;
        const db = getFirestore(myAuth);

        const testRead = db.collection('/users').doc(user_id);
        await firebase.assertFails(testRead.set({ uid: myId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: myEmail, instaId: "instaId", interests: "interests", isAdmin: false, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" }));
    });
    it('NT -> Create User: {+} All Required Fields, {-} Auth, {+} Create Own User, {+} Valid Field Type', async () => {
        const user_id = myId;
        const db = getFirestore(null);

        const testRead = db.collection('/users').doc(user_id);
        await firebase.assertFails(testRead.set({ uid: myId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: myEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: false, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" }));
    });
    it('NT -> Create User: {+} All Required Fields, {+} Auth, {-} Create Own User, {+} Valid Field Type', async () => {
        const user_id = myId;
        const db = getFirestore(myAuth);

        const testRead = db.collection('/users').doc(theirId);
        await firebase.assertFails(testRead.set({ uid: myId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: myEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: false, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" }));
    });
    it('NT -> Create User: {+} All Required Fields, {+} Auth, {+} Create Own User, {-} Valid Field Type', async () => {
        const user_id = myId;
        const db = getFirestore(myAuth);

        const testRead = db.collection('/users').doc(user_id);
        await firebase.assertFails(testRead.set({ uid: myId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: myEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: "false", isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" }));
    });
    it('PT -> Update User: {+} Only Allowed Fields, {+} Admin access, {-} Same User, {+} Valid Field Type', async () => {
        await setupAdmin();
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/users').doc(theirId);
        await admin.collection('/users').doc(theirId).set({ uid: theirId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: theirEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: false, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" });
        await firebase.assertSucceeds(testRead.update({ name: "new_name" }));
    });
    it('PT -> Update User: {+} Only Allowed Fields, {-} Admin access, {+} Same User, {+} Valid Field Type', async () => {
        await setupAdmin();
        const db = getFirestore(theirAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/users').doc(theirId);
        await admin.collection('/users').doc(theirId).set({ uid: theirId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: theirEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: false, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" });
        await firebase.assertSucceeds(testRead.update({ name: "new_name" }));
    });
    it('NT -> Update User: {-} Only Allowed Fields, {-} Admin access, {+} Same User, {+} Valid Field Type', async () => {
        await setupAdmin();
        const db = getFirestore(theirAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/users').doc(theirId);
        await admin.collection('/users').doc(theirId).set({ uid: theirId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: theirEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: false, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" });
        await firebase.assertFails(testRead.update({ name: "new_name", gender: "Male" }));
    });
    it('NT -> Update User: {+} Only Allowed Fields, {-} Admin access, {-} Same User, {+} Valid Field Type', async () => {
        await setupAdmin();
        const db = getFirestore(thirdAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/users').doc(theirId);
        await admin.collection('/users').doc(theirId).set({ uid: theirId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: theirEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: false, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" });
        await firebase.assertFails(testRead.update({ name: "new_name" }));
    });
    it('NT -> Update User: {+} Only Allowed Fields, {+} Admin access, {+} Same User, {-} Valid Field Type', async () => {
        await setupAdmin();
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/users').doc(myId);
        await admin.collection('/users').doc(myId).set({ uid: myId, about: "about", batch: "batch", branch: "branch", contact: "contact", cvLink: "cvLink", email: myEmail, fbId: "fbId", instaId: "instaId", interests: "interests", isAdmin: true, isMember: true, linkedinId: "linkedinId", name: "name", position: "position", profileImageUrl: "profileImageUrl", quote: "quote" });
        await firebase.assertFails(testRead.update({ name: true }));
    });
    it('NT -> Delete User: {+} Admin, {+} Delete Own User', async () => {
        const user_id = myId;
        const db = getFirestore(myAuth);

        const testRead = db.collection('/users').doc(user_id);
        await firebase.assertFails(testRead.delete());
    });

    // Project Collection Tests
    it('PT -> Read Projects:  {-} Auth', async () => {
        const project_id = 'project_abc';
        const db = getFirestore(null);
        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertSucceeds(testRead.get());
    });

    it('PT -> Create Projects: {+} All Required Fields, {+} Admin Access, {+} Valid Field Types', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertSucceeds(testRead.set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", projectImg: ["projectImg", "img"], teamMembers: ["teamMembers"] }));
    });
    it('NT -> Create Projects: {+} All Required Fields, {+} Admin Access, {-} Valid Field Types', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", projectImg: ["projectImg", "img"], teamMembers: 4 }));
    });
    it('NT -> Create Projects: {-} All Required Fields, {+} Admin Access, {+} Valid Field Type', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.set({ "name": "abc" }));
    });
    it('NT -> Create Projects: {+} All Required Fields, {-} Admin access, {+} Auth, {+} Valid Field Type', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(theirAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", projectImg: ["projectImg", "img"], teamMembers: ["teamMembers"] }));
    });
    it('NT -> Create Projects: {-} All Required Fields, {-} Admin access, {+} Auth, {+} Valid Field Type', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(theirAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.set({ date: "date", description: "description", link: "link", name: "name", progress: "progress", teamMembers: ["teamMembers"] }));
    });
    it('PT -> Update Projects: {+} Only Allowed Fields, {+} Admin access, {+} Valid Field Type', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/projects').doc(project_id);
        await admin.collection('/projects').doc(project_id).set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", projectImg: ["projectImg", "img"], teamMembers: ["teamMembers"] });
        await firebase.assertSucceeds(testRead.update({ date: "date_new" }));
    });
    it('NT -> Update Projects: {+} Only Allowed Fields, {+} Admin access, {-} Valid Field Type', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/projects').doc(project_id);
        await admin.collection('/projects').doc(project_id).set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", teamMembers: "teamMembers" });
        await firebase.assertFails(testRead.update({ date: true }));
    });
    it('NT -> Update Projects: {+} Only Allowed Fields, {-} Admin access, {+} Valid Field Type', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(theirAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.update({ date: "date", description: "description", link: "link", name: "name", progress: "progress", teamMembers: ["teamMembers"] }));
    });
    it('NT -> Update Projects: {-} Only Allowed Fields, {+} Admin access, {+} Valid Field Type', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.update({ date: "date", description: "description", link: "link", name: "name", progress: "progress", teamMembers: ["teamMembers"], uid: "uid" }));
    });
    it('NT -> Delete Projects: {+} Admin Access', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.delete());
    });

    //Feedback Collection Tests
    it('NT -> Read Feedbacks: {-} Auth', async () => {
        await setupAdmin();
        const feedback_id = 'feedback_id';
        const db = getFirestore(null);

        const testRead = db.collection('/feedbacks').doc(feedback_id);
        await firebase.assertFails(testRead.get());
    });
    it('NT -> Read Feedbacks: {-} Admin Access, {+} Auth', async () => {
        await setupAdmin();
        const feedback_id = 'feedback_id';
        const db = getFirestore(theirAuth);

        const testRead = db.collection('/feedbacks').doc(feedback_id);
        await firebase.assertFails(testRead.get());
    });
    it('PT -> Read Feedbacks: {+} Admin Access', async () => {
        await setupAdmin();
        const feedback_id = 'feedback_id';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/feedbacks').doc(feedback_id);
        await firebase.assertSucceeds(testRead.get());
    });

    //Downloads page tests

    it('NT -> Read Downloads: {-} Auth', async () => {
        const downloads_Id = 'downloadsId';
        const db = getFirestore(null);

        const testRead = db.collection('/downloads').doc(downloads_Id);
        await firebase.assertFails(testRead.get());
    });
    it('PT -> Read Downloads: {-} Admin Access {+} Auth', async () => {
        const downloads_Id = 'downloadsId';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/downloads').doc(downloads_Id);
        await firebase.assertSucceeds(testRead.get());
    });
    it('PT -> Create Downloads: {+} Admin Access {+} Only Allowed Fields', async () => {
        await setupAdmin();
        const downloads_Id = 'downloadsId';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/downloads').doc(downloads_Id);
        await firebase.assertSucceeds(testRead.set({ file : "test.pdf", name : "test", size : "200,000", url : "https://test.com" }));
    });
    it('NT -> Create Downloads: {+} Admin Access {-} Only Allowed Fields', async () =>{
        await setupAdmin();
        const downloads_Id = 'downloadsId';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/downloads').doc(downloads_Id);
        await firebase.assertFails(testRead.set({ file : "file", name : "name", size : "size", url : "url", date : "date" }));
    });
    it('NT -> Create Downloads: {-} Admin Access {+} Only Allowed Fields {+} Auth', async () =>{
        const downloads_Id = 'downloadsId';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/downloads').doc(downloads_Id);
        await firebase.assertFails(testRead.set({ file : "file", name : "name", size : "size", url : "url" }));
    });
    it('PT -> Update Projects: {+} Only Allowed Fields, {+} Admin access', async () => {
        await setupAdmin();
        const downloads_Id = 'downloadsId';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/downloads').doc(downloads_Id);
        await admin.collection('/downloads').doc(downloads_Id).set({ file : "file", name : "name", size : "size", url : "url" });
        await firebase.assertSucceeds(testRead.update({ file: "file_new" }));
    });
    it('NT -> Update Projects: {+} Only Allowed Fields, {-} Admin access {+} Auth', async () => {
        const downloads_Id = 'downloadsId';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/downloads').doc(downloads_Id);
        await firebase.assertFails(testRead.update({ file: "file_new" }));
    });
    it('NT -> Update Projects: {-} Only Allowed Fields, {+} Admin access', async () => {
        await setupAdmin();
        const downloads_Id = 'downloadsId';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/downloads').doc(downloads_Id);
        await admin.collection('/downloads').doc(downloads_Id).set({ file : "file", name : "name", size : "size", url : "url" });
        await firebase.assertFails(testRead.update({ date: "date" }));
    });

    //Current team tests

    it('PT -> Read Current team: {-} Admin Access {+} Auth', async () => {
        const singleId = 'single_Id';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/currentTeam').doc(singleId);
        await firebase.assertSucceeds(testRead.get());
    });
    it('NT -> Read Current team: {-} Auth', async () => {
        const singleId = 'single_Id';
        const db = getFirestore(null);

        const testRead = db.collection('/currentTeam').doc(singleId);
        await firebase.assertFails(testRead.get());
    });
    it('PT -> Create current team: {+} Admin Access {+} Only Allowed Fields', async () => {
        await setupAdmin();
        const singleId = 'single_Id';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/currentTeam').doc(singleId);
        await firebase.assertSucceeds(testRead.set({  data : "email" }));
    });

    //Push tokens tests

    it('PT -> Read pushTokens: {-} Admin Access {+} Auth', async () => {
        const pushTokensId = 'pushTokens_Id';
        const db = getFirestore(myAuth);
        const testRead = db.collection('/pushTokens').doc(pushTokensId);
        await firebase.assertSucceeds(testRead.get());
    });
    
    it('NT -> Read pushTokens: {-} Auth', async () => {
        const pushTokensId = 'pushTokens_Id';
        const db = getFirestore(null);
        const testRead = db.collection('/pushTokens').doc(pushTokensId);
        await firebase.assertFails(testRead.get());
    });
    it('PT -> Create pushTokens: {+} Admin Access {+} Only Allowed Fields', async () => {
        setupAdmin();
        const pushTokensId = 'pushTokens_Id';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/pushTokens').doc(pushTokensId);
        await firebase.assertSucceeds(testRead.set({ androidId : "id", createdAt : "time", deviceToken : "token", platform : "android" }));
    });
    it('NT -> Create pushTokens: {-} Admin Access {+} Only Allowed Fields', async () => {
        const pushTokensId = 'pushTokens_Id';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/pushTokens').doc(pushTokensId);
        await firebase.assertFails(testRead.set({ androidId : "id", createdAt : "time", deviceToken : "token", platform : "android" }));
    });
    it('NT -> Create pushTokens: {+} Admin Access {-} Only Allowed Fields', async () => {
        setupAdmin();
        const pushTokensId = 'pushTokens_Id';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/pushTokens').doc(pushTokensId);
        await firebase.assertFails(testRead.set({ androidId : "id", createdAt : "time", deviceToken : "token", platform : "android", location : "location" }));
    });
    it('PT -> Update pushTokens: {+} Admin Access {+} Request Id == Resource Id', async () => {
        setupAdmin();
        const pushTokensId = 'pushTokens_Id';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/pushTokens').doc(pushTokensId);
        await admin.collection('/pushTokens').doc(pushTokensId).set({ androidId : "id", createdAt : "time", deviceToken : "token", platform : "android" });
        await firebase.assertSucceeds(testRead.update({ createdAt : "time" }));
    });
    it('NT -> Update pushTokens: {+} Admin Access {-} Resource ID == Request ID', async () => {
        setupAdmin();
        const pushTokensId = 'pushTokens_Id';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/pushTokens').doc(pushTokensId);
        await admin.collection('/pushTokens').doc(pushTokensId).set({ androidId : "id", createdAt : "time", deviceToken : "token", platform : "android" });
        await firebase.assertFails(testRead.update({ androidId : "id_new", createdAt : "time" }));
    });
    it('NT -> Update pushTokens: {-} Admin Access {+} Resource ID == Request ID', async () => {
        const pushTokensId = 'pushTokens_Id';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/pushTokens').doc(pushTokensId);
        await admin.collection('/pushTokens').doc(pushTokensId).set({ androidId : "id", createdAt : "time", deviceToken : "token", platform : "android" });
        await firebase.assertFails(testRead.update({  createdAt : "time" }));
    });





});

after(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});