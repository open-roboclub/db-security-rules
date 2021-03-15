const assert = require('assert');
const firebase = require('@firebase/testing');

const MY_PROJECT_ID = "amu-roboclub";
const myId = "user_abc";
const myEmail = "abc@gmail.com";
const theirId = "user_xyz";
const theirEmail = "xyz@gmail.com";
const myAuth = { uid: myId, email: myEmail };
const theirAuth = { uid: theirId, email: theirEmail };

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

    // Project Collection Tests
    it('PT -> Read Projects:  {-} Auth', async () => {
        const project_id = 'project_abc';
        const db = getFirestore(null);
        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertSucceeds(testRead.get());
    });

    it('PT -> Create Projects: {+} All Required Fields, {+} Admin Access', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertSucceeds(testRead.set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", teamMembers: "teamMembers" }));
    });
    it('NT -> Create Projects: {-} All Required Fields, {+} Admin Access', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.set({ "name": "abc" }));
    });
    it('NT -> Create Projects: {+} All Required Fields, {-} Admin access, {+} Auth', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(theirAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", teamMembers: "teamMembers" }));
    });
    it('NT -> Create Projects: {-} All Required Fields, {-} Admin access, {+} Auth', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(theirAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.set({ date: "date", description: "description", link: "link", name: "name", progress: "progress", teamMembers: "teamMembers" }));
    });
    it('PT -> Update Projects: {+} Only Allowed Fields, {+} Admin access', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);
        const admin = getAdminFirestore();

        const testRead = db.collection('/projects').doc(project_id);
        await admin.collection('/projects').doc(project_id).set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", teamMembers: "teamMembers" });
        await firebase.assertSucceeds(testRead.update({ date: "date_new" }));
    });
    it('NT -> Update Projects: {+} Only Allowed Fields, {-} Admin access', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(theirAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.update({ date: "date", description: "description", link: "link", name: "name", progress: "progress", teamMembers: "teamMembers" }));
    });
    it('NT -> Update Projects: {-} Only Allowed Fields, {+} Admin access', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.update({ date: "date", description: "description", link: "link", name: "name", progress: "progress", teamMembers: "teamMembers", uid: "uid" }));
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