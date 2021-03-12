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
    await setupUser.set({ isAdmin: true, name: "Rishabh Sharma", email: myEmail });
}

beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId: MY_PROJECT_ID });
});

describe('AMURoboclub app DB Unit Testing', () => {

    // Project Collection Tests
    it('Can read projects without auth', async () => {
        const project_id = 'project_abc';
        const db = getFirestore(null);
        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertSucceeds(testRead.get());
    });

    it('Can\'t post projects without All required fields', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertFails(testRead.set({ "name": "Rishabh Sharma" }));
    });
    it('Can post projects with all Required Fields and Admin access', async () => {
        await setupAdmin();
        const project_id = 'project_abc';
        const db = getFirestore(myAuth);

        const testRead = db.collection('/projects').doc(project_id);
        await firebase.assertSucceeds(testRead.set({ date: "date", description: "description", fileUrl: "fileUrl", link: "link", name: "name", progress: "progress", teamMembers: "teamMembers" }));
    });

    //Feedback Collection Tests
    it('Can\'t read feedback without admin access and without auth', async () => {
        await setupAdmin();
        const feedback_id = 'feedback_id';
        const db = getFirestore(null);

        const testRead = db.collection('/feedbacks').doc(feedback_id);
        await firebase.assertFails(testRead.get());
    });
    it('Can\'t read feedback without admin access but with auth', async () => {
        await setupAdmin();
        const feedback_id = 'feedback_id';
        const db = getFirestore(theirAuth);

        const testRead = db.collection('/feedbacks').doc(feedback_id);
        await firebase.assertFails(testRead.get());
    });
    it('Can read feedback with admin access ', async () => {
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