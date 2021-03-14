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
});

after(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});